"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  Legend as RechartsLegend,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AxisDomain } from "recharts/types/util/types";

import {
  AvailableChartColors,
  type AvailableChartColorsKeys,
  constructCategoryColors,
  getColorClassName,
  getYAxisDomain,
} from "@/lib/chartUtils";
import { cx } from "@/lib/utils";

/**
 * Elemento individual del payload del tooltip en el LineChart de Tremor.
 */
export interface TooltipPayloadItem {
  /** Nombre de la serie o categoría. */
  category: string;
  /** Valor numérico del punto. */
  value: number;
  /** Etiqueta del eje X asociada al punto. */
  index: string;
  /** Color asignado a la serie. */
  color: AvailableChartColorsKeys;
  /** Objeto de datos original de la fila. */
  payload: Record<string, unknown>;
}

/**
 * Propiedades pasadas al componente de tooltip (por defecto o personalizado) del LineChart.
 */
export interface TooltipProps {
  /** Indica si el tooltip está activo. */
  active: boolean | undefined;
  /** Colección de valores de las series en la coordenada activa. */
  payload: TooltipPayloadItem[];
  /** Etiqueta del eje X activa. */
  label: string;
}

interface ChartTooltipProps extends TooltipProps {
  valueFormatter: (value: number) => string;
}

/**
 * Tooltip predeterminado oficial de Tremor LineChart adaptado a la paleta de PriceScope.
 */
function ChartTooltip({ active, payload, label, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white text-xs shadow-lg">
      <div className="border-b border-slate-100 px-3.5 py-2">
        <p className="font-semibold text-slate-900">{label}</p>
      </div>
      <div className="space-y-1.5 px-3.5 py-2">
        {payload.map(({ value, category, color }, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cx("h-1 w-3.5 shrink-0 rounded-full", getColorClassName(color, "bg"))}
              />
              <span className="whitespace-nowrap text-slate-600">{category}</span>
            </div>
            <span className="font-bold whitespace-nowrap text-slate-900 tabular-nums">
              {valueFormatter(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LegendItemProps {
  name: string;
  color: AvailableChartColorsKeys;
  activeLegend?: string;
  onClick?: (name: string) => void;
}

/**
 * Ítem individual de la leyenda superior de Tremor LineChart.
 */
function LegendItem({ name, color, activeLegend, onClick }: LegendItemProps) {
  return (
    <li
      onClick={() => onClick?.(name)}
      className={cx(
        "group inline-flex items-center gap-1.5 rounded-md px-2 py-1 whitespace-nowrap transition",
        onClick ? "cursor-pointer hover:bg-slate-100" : "cursor-default"
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "h-1 w-3.5 shrink-0 rounded-full",
          getColorClassName(color, "bg"),
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100"
        )}
      />
      <span
        className={cx(
          "text-xs font-medium whitespace-nowrap text-slate-700",
          activeLegend && activeLegend !== name ? "opacity-40" : "opacity-100"
        )}
      >
        {name}
      </span>
    </li>
  );
}

/**
 * Propiedades del componente LineChart oficial de Tremor.
 */
export interface LineChartProps extends React.ComponentProps<"div"> {
  /** Arreglo de objetos con los puntos de la serie temporal. */
  data: Record<string, unknown>[];
  /** Clave del objeto usada para el eje X (ej. `fecha`). */
  index: string;
  /** Lista de claves numéricas a trazar como líneas independientes. */
  categories: string[];
  /** Colores de Tremor para cada categoría en el mismo orden. */
  colors?: AvailableChartColorsKeys[];
  /** Categorías que deben dibujarse con línea punteada de referencia (ej. divisa). */
  dashedCategories?: string[];
  /** Función de formato para valores numéricos en el eje Y y en el tooltip. */
  valueFormatter?: (value: number) => string;
  /** Muestra únicamente la primera y última etiqueta del eje X. */
  startEndOnly?: boolean;
  /** Muestra u oculta el eje X. */
  showXAxis?: boolean;
  /** Muestra u oculta el eje Y. */
  showYAxis?: boolean;
  /** Muestra u oculta la grilla horizontal de referencia. */
  showGridLines?: boolean;
  /** Ancho reservado en píxeles para las etiquetas del eje Y. */
  yAxisWidth?: number;
  /** Muestra u oculta el tooltip interactivo. */
  showTooltip?: boolean;
  /** Muestra u oculta la leyenda superior. */
  showLegend?: boolean;
  /** Ajusta automáticamente el valor mínimo del eje Y al rango de los datos. */
  autoMinValue?: boolean;
  /** Valor mínimo fijo del eje Y. */
  minValue?: number;
  /** Valor máximo fijo del eje Y. */
  maxValue?: number;
  /** Permite decimales en las marcas del eje Y. */
  allowDecimals?: boolean;
  /**
   * Controla el tratamiento de valores `null` (RN-04):
   * - `false` (Modo Estricto): genera un corte físico visible ante datos faltantes.
   * - `true` (Modo Continuo): interpola con línea continua entre puntos válidos.
   */
  connectNulls?: boolean;
  /** Separación mínima en píxeles entre etiquetas del eje X. */
  tickGap?: number;
  /** Posición horizontal de la leyenda superior. */
  legendPosition?: "left" | "center" | "right";
  /** Componente de tooltip personalizado para auditoría forense. */
  customTooltip?: React.ComponentType<TooltipProps>;
}

/**
 * Componente LineChart oficial de Tremor construido sobre Recharts para series financieras a 60 FPS.
 * Soporta cortes físicos por datos nulos (`connectNulls={false}` según RN-04) y líneas de referencia punteadas.
 */
function LineChart({
  data = [],
  categories = [],
  index,
  colors = AvailableChartColors,
  dashedCategories = [],
  valueFormatter = (value: number) => value.toString(),
  startEndOnly = false,
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  yAxisWidth = 64,
  showTooltip = true,
  showLegend = true,
  autoMinValue = false,
  minValue,
  maxValue,
  allowDecimals = true,
  connectNulls = false,
  tickGap = 12,
  legendPosition = "right",
  customTooltip: CustomTooltip,
  className,
  ...props
}: LineChartProps) {
  const [activeLegend, setActiveLegend] = React.useState<string | undefined>(undefined);

  const categoryColors = React.useMemo(
    () => constructCategoryColors(categories, colors),
    [categories, colors]
  );

  const yAxisDomain = React.useMemo(
    () => getYAxisDomain(autoMinValue, minValue, maxValue),
    [autoMinValue, minValue, maxValue]
  );

  const handleLegendClick = React.useCallback((category: string) => {
    setActiveLegend((prev) => (prev === category ? undefined : category));
  }, []);

  return (
    <div
      data-slot="line-chart"
      tremor-id="tremor-raw"
      className={cx("h-80 w-full select-none", className)}
      {...props}
    >
      <ResponsiveContainer className="size-full">
        <RechartsLineChart data={data} margin={{ top: 8, left: 4, right: 12, bottom: 4 }}>
          {showGridLines ? (
            <CartesianGrid
              className="stroke-slate-200/80 stroke-1"
              horizontal={true}
              vertical={false}
            />
          ) : null}

          <XAxis
            hide={!showXAxis}
            dataKey={index}
            interval="equidistantPreserveStart"
            tick={{ transform: "translate(0, 6)" }}
            ticks={
              startEndOnly && data.length > 0
                ? [String(data[0][index]), String(data[data.length - 1][index])]
                : undefined
            }
            fill=""
            stroke=""
            className="fill-slate-500 text-xs font-medium"
            tickLine={false}
            axisLine={false}
            minTickGap={tickGap}
          />

          <YAxis
            width={yAxisWidth}
            hide={!showYAxis}
            axisLine={false}
            tickLine={false}
            type="number"
            domain={yAxisDomain as AxisDomain}
            tick={{ transform: "translate(-3, 0)" }}
            fill=""
            stroke=""
            className="fill-slate-400 text-[11px] font-medium tabular-nums"
            tickFormatter={valueFormatter}
            allowDecimals={allowDecimals}
          />

          <Tooltip
            wrapperStyle={{ outline: "none" }}
            isAnimationActive={false}
            cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
            content={({ active, payload, label }) => {
              const cleanPayload: TooltipPayloadItem[] = payload
                ? payload
                    .filter((item) => item.value !== null && item.value !== undefined)
                    .map((item) => ({
                      category: String(item.dataKey ?? ""),
                      value: Number(item.value),
                      index: String(
                        (item.payload as Record<string, unknown>)?.[index] ?? label ?? ""
                      ),
                      color: (categoryColors.get(String(item.dataKey ?? "")) ??
                        "blue") as AvailableChartColorsKeys,
                      payload: (item.payload as Record<string, unknown>) ?? {},
                    }))
                : [];

              if (!showTooltip || !active) {
                return null;
              }

              return CustomTooltip ? (
                <CustomTooltip active={active} payload={cleanPayload} label={String(label ?? "")} />
              ) : (
                <ChartTooltip
                  active={active}
                  payload={cleanPayload}
                  label={String(label ?? "")}
                  valueFormatter={valueFormatter}
                />
              );
            }}
          />

          {showLegend ? (
            <RechartsLegend
              verticalAlign="top"
              height={36}
              content={() => (
                <div
                  className={cx(
                    "mb-2 flex items-center",
                    legendPosition === "left" && "justify-start",
                    legendPosition === "center" && "justify-center",
                    legendPosition === "right" && "justify-end"
                  )}
                >
                  <ol className="flex flex-wrap items-center gap-2">
                    {categories.map((category) => (
                      <LegendItem
                        key={category}
                        name={category}
                        color={categoryColors.get(category) ?? "blue"}
                        activeLegend={activeLegend}
                        onClick={handleLegendClick}
                      />
                    ))}
                  </ol>
                </div>
              )}
            />
          ) : null}

          {categories.map((category) => {
            const color = categoryColors.get(category) ?? "blue";
            const isDashed = dashedCategories.includes(category);
            return (
              <Line
                key={category}
                name={category}
                type="linear"
                dataKey={category}
                stroke=""
                strokeWidth={isDashed ? 2 : 2.5}
                strokeDasharray={isDashed ? "5 4" : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
                isAnimationActive={false}
                connectNulls={isDashed ? true : connectNulls}
                strokeOpacity={activeLegend && activeLegend !== category ? 0.25 : 1}
                className={cx(getColorClassName(color, "stroke"))}
                dot={false}
                activeDot={{
                  r: 4.5,
                  strokeWidth: 2,
                  className: cx("stroke-white", getColorClassName(color, "fill")),
                }}
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export { LineChart };
