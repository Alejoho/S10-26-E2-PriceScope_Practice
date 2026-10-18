"use client";

import * as React from "react";
import * as PopoverPrimitives from "@radix-ui/react-popover";
import { RiCalendar2Line, RiArrowRightLine, RiRefreshLine, RiCheckLine } from "@remixicon/react";
import {
  format,
  subDays,
  startOfDay,
  endOfDay,
  isSameDay,
  isAfter,
  isBefore,
  differenceInCalendarDays,
} from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker, type DateRange } from "react-day-picker";

import { cx, focusInput } from "@/lib/utils";

export type { DateRange };

export interface DateRangePreset {
  label: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

export interface DateRangePickerProps {
  /** Rango de fechas seleccionado (controlado) */
  value?: DateRange;
  /** Callback emitido al confirmar el rango seleccionado */
  onChange?: (dateRange: DateRange | undefined) => void;
  /** Texto cuando no hay fecha seleccionada */
  placeholder?: string;
  /** Clases CSS adicionales para el botón disparador */
  className?: string;
  /** Lista de atajos rápidos de selección */
  presets?: DateRangePreset[];
  /** Deshabilita la interacción */
  disabled?: boolean;
  /** Número máximo de días permitidos en el rango (RN-09: 365 días máx.) */
  maxDays?: number;
  /** Prohíbe la selección de fechas futuras (RN-09: fecha_hasta <= hoy) */
  disableFuture?: boolean;
  /** Número de meses visibles simultáneamente en el calendario */
  numberOfMonths?: number;
  /** Alineación del Popover respecto al botón disparador */
  align?: "start" | "center" | "end";
}

/**
 * Formatea un objeto Date al estándar YYYY-MM-DD esperado por los endpoints del backend
 * (`fecha_desde` y `fecha_hasta`), evitando desplazamientos por zona horaria UTC.
 */
export function formatDateForApi(date: Date | undefined): string {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

/**
 * Genera la lista de atajos rápidos (presets) para PriceScope, incluyendo cortes
 * semanales, mensuales y trimestrales hasta el tope anual de 365 días (RN-09).
 */
export function getPriceScopePresets(referenceDate: Date = new Date()): DateRangePreset[] {
  const today = endOfDay(referenceDate);
  const buildPreset = (label: string, days: number): DateRangePreset => ({
    label,
    dateRange: {
      from: startOfDay(subDays(today, days - 1)),
      to: today,
    },
  });

  return [
    buildPreset("Última semana (7D)", 7),
    buildPreset("Últimos 15 días (15D)", 15),
    buildPreset("Últimos 30 días (30D)", 30),
    buildPreset("Últimos 2 meses (60D)", 60),
    buildPreset("Últimos 3 meses (90D)", 90),
    buildPreset("Últimos 6 meses (180D)", 180),
    buildPreset("Últimos 9 meses (270D)", 270),
    buildPreset("Último año (1A)", 365),
  ];
}

/**
 * Selector de rango de fechas estilo Tremor adaptado a las reglas de negocio de PriceScope (RN-09).
 * Permite editar independientemente "Fecha Desde" o "Fecha Hasta", navegar al mes correspondiente
 * y confirmar los cambios mediante el botón "Aplicar Selección".
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = "Seleccionar rango de fechas",
  className,
  presets = getPriceScopePresets(),
  disabled = false,
  maxDays = 365,
  disableFuture = true,
  numberOfMonths = 1,
  align = "start",
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draftRange, setDraftRange] = React.useState<DateRange | undefined>(value);
  const [activeField, setActiveField] = React.useState<"from" | "to" | null>(null);

  const today = React.useMemo(() => endOfDay(new Date()), []);
  const minHistoricalDate = React.useMemo(
    () => startOfDay(subDays(today, maxDays - 1)),
    [today, maxDays]
  );

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    () => value?.to ?? value?.from ?? today
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setActiveField(null);
    if (nextOpen) {
      setDraftRange(value);
      setCurrentMonth(value?.to ?? value?.from ?? today);
    }
  };

  const handlePillClick = (field: "from" | "to") => {
    if (activeField === field) {
      setActiveField(null);
      return;
    }
    setActiveField(field);
    if (field === "from" && draftRange?.from) {
      setCurrentMonth(draftRange.from);
    } else if (field === "to" && draftRange?.to) {
      setCurrentMonth(draftRange.to);
    }
  };

  const handleDaySelect = (selectedRange: DateRange | undefined, triggerDate?: Date) => {
    if (activeField && triggerDate) {
      const from = activeField === "from" ? triggerDate : (draftRange?.from ?? triggerDate);
      const to = activeField === "to" ? triggerDate : (draftRange?.to ?? triggerDate);
      setDraftRange(isAfter(from, to) ? { from: to, to: from } : { from, to });
      setActiveField(null);
      return;
    }

    setDraftRange(selectedRange);
    if (selectedRange?.from && !selectedRange.to) {
      setActiveField("to");
    } else {
      setActiveField(null);
    }
  };

  const handlePresetSelect = (preset: DateRangePreset) => {
    setDraftRange(preset.dateRange);
    setCurrentMonth(preset.dateRange.to);
    setActiveField(null);
  };

  const isPresetActive = (preset: DateRangePreset) => {
    if (!draftRange?.from || !draftRange?.to) return false;
    return (
      isSameDay(draftRange.from, preset.dateRange.from) &&
      isSameDay(draftRange.to, preset.dateRange.to)
    );
  };

  const handleApply = () => {
    if (!draftRange?.from || !draftRange?.to) return;
    onChange?.(draftRange);
    setOpen(false);
  };

  const handleCancel = () => {
    setDraftRange(value);
    setActiveField(null);
    setOpen(false);
  };

  const handleReset = () => {
    const defaultPreset = presets[2] ?? presets[0];
    if (defaultPreset) {
      setDraftRange(defaultPreset.dateRange);
      setCurrentMonth(defaultPreset.dateRange.to);
    } else {
      setDraftRange(undefined);
    }
    setActiveField(null);
  };

  const selectedDayCount = React.useMemo(() => {
    if (!draftRange?.from) return null;
    if (!draftRange.to) return 1;
    return Math.max(1, differenceInCalendarDays(draftRange.to, draftRange.from) + 1);
  }, [draftRange]);

  const formattedDisplay = React.useMemo(() => {
    if (!value?.from) return placeholder;
    if (!value.to) return format(value.from, "dd/MM/yyyy");
    const days = Math.max(1, differenceInCalendarDays(value.to, value.from) + 1);
    return `${format(value.from, "dd/MM/yyyy")} - ${format(value.to, "dd/MM/yyyy")} (${days}d)`;
  }, [value, placeholder]);

  return (
    <PopoverPrimitives.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitives.Trigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label={formattedDisplay}
          className={cx(
            "peer flex min-w-[240px] cursor-pointer appearance-none items-center gap-x-2 truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-2xs transition-transform duration-150 ease-out hover:bg-slate-50 active:scale-[0.98] disabled:pointer-events-none disabled:bg-slate-100 disabled:text-slate-400",
            focusInput,
            className
          )}
        >
          <RiCalendar2Line className="size-4 shrink-0 text-slate-500" />
          <span className="flex-1 truncate text-left font-medium tabular-nums">
            {formattedDisplay}
          </span>
        </button>
      </PopoverPrimitives.Trigger>

      <PopoverPrimitives.Portal>
        <PopoverPrimitives.Content
          sideOffset={8}
          align={align}
          className="z-50 flex max-h-[85vh] max-w-[95vw] origin-(--radix-popover-content-transform-origin) flex-col overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xl sm:max-w-none sm:flex-row"
        >
          {/* Columna de Atajos Rápidos (Presets) */}
          {presets.length > 0 && (
            <div className="mb-2 flex min-w-40 flex-row flex-wrap gap-1 border-b border-slate-200 pb-2 sm:mr-1 sm:mb-0 sm:w-44 sm:flex-col sm:border-r sm:border-b-0 sm:pr-3 sm:pb-0">
              <span className="mb-0.5 px-2 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Atajos Rápidos
              </span>
              {presets.map((preset) => {
                const active = isPresetActive(preset);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={cx(
                      "flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-all duration-150 ease-out active:scale-[0.98]",
                      active
                        ? "bg-blue-50 font-semibold text-blue-700 ring-1 ring-blue-500/20"
                        : "font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                    )}
                  >
                    <span>{preset.label}</span>
                    {active && <span className="ml-2 size-1.5 shrink-0 rounded-full bg-blue-600" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Contenedor del Calendario y Controles */}
          <div
            className={cx(
              "flex flex-col",
              numberOfMonths === 1 ? "w-full sm:w-[276px]" : "w-full sm:w-auto"
            )}
          >
            {/* Píldoras Interactivas Desde -> Hasta (saltan al mes y permiten editar cada extremo) */}
            <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-slate-100 pb-2.5">
              <button
                type="button"
                aria-pressed={activeField === "from"}
                onClick={() => handlePillClick("from")}
                title="Clic para saltar al mes inicial y ajustar Fecha Desde"
                className={cx(
                  "group flex min-w-0 cursor-pointer flex-col rounded-lg border px-2.5 py-1.5 text-left transition-all duration-150 ease-out select-none active:scale-[0.97]",
                  activeField === "from"
                    ? "border-blue-500 bg-blue-50/70 ring-1 ring-blue-500"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/70"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    Desde
                  </span>
                  {activeField === "from" ? (
                    <span className="size-1.5 animate-pulse rounded-full bg-blue-600" />
                  ) : (
                    <span className="text-[9px] font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Editar
                    </span>
                  )}
                </div>
                <span className="mt-0.5 truncate text-xs font-bold text-slate-900 tabular-nums">
                  {draftRange?.from ? format(draftRange.from, "dd/MM/yyyy") : "Seleccionar"}
                </span>
              </button>

              <RiArrowRightLine className="size-3.5 shrink-0 text-slate-400" />

              <button
                type="button"
                aria-pressed={activeField === "to"}
                onClick={() => handlePillClick("to")}
                title="Clic para saltar al mes final y ajustar Fecha Hasta"
                className={cx(
                  "group flex min-w-0 cursor-pointer flex-col rounded-lg border px-2.5 py-1.5 text-left transition-all duration-150 ease-out select-none active:scale-[0.97]",
                  activeField === "to"
                    ? "border-blue-500 bg-blue-50/70 ring-1 ring-blue-500"
                    : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-100/70"
                )}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                    Hasta
                  </span>
                  {activeField === "to" ? (
                    <span className="size-1.5 animate-pulse rounded-full bg-blue-600" />
                  ) : (
                    <span className="text-[9px] font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                      Editar
                    </span>
                  )}
                </div>
                <span className="mt-0.5 truncate text-xs font-bold text-slate-900 tabular-nums">
                  {draftRange?.to ? format(draftRange.to, "dd/MM/yyyy") : "Seleccionar"}
                </span>
              </button>
            </div>

            {/* Calendario react-day-picker v10 */}
            <div className="relative flex justify-center p-0.5">
              <DayPicker
                locale={es}
                mode="range"
                selected={draftRange}
                onSelect={handleDaySelect}
                resetOnSelect={!activeField}
                numberOfMonths={numberOfMonths}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                startMonth={minHistoricalDate}
                endMonth={disableFuture ? today : undefined}
                max={maxDays}
                disabled={[
                  ...(disableFuture ? [{ after: today }] : []),
                  ...(maxDays > 0 ? [{ before: minHistoricalDate }] : []),
                  ...(activeField === "to" && draftRange?.from && !isBefore(today, draftRange.from)
                    ? [{ before: draftRange.from }]
                    : []),
                ]}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-3 sm:space-x-4 sm:space-y-0",
                  month: "relative space-y-2",
                  month_caption:
                    "flex justify-center h-8 items-center text-sm font-bold text-slate-900",
                  caption_label: "text-sm font-bold select-none capitalize text-slate-900",
                  nav: "flex items-center justify-between absolute top-0 inset-x-0 w-full pointer-events-none z-10 px-1",
                  button_previous:
                    "h-7 w-7 bg-transparent p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors pointer-events-auto flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none cursor-pointer",
                  button_next:
                    "h-7 w-7 bg-transparent p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors pointer-events-auto flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none cursor-pointer",
                  month_grid: "w-full border-collapse space-y-1",
                  weekdays: "flex text-slate-500 text-xs justify-around mb-1",
                  weekday:
                    "w-8 font-semibold text-center select-none text-[11px] capitalize text-slate-500",
                  week: "flex w-full mt-1 justify-around",
                  day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-8 h-8 flex items-center justify-center text-slate-800",
                  day_button:
                    "h-8 w-8 p-0 font-medium rounded-md hover:bg-slate-100 transition-colors text-center text-sm flex items-center justify-center text-inherit cursor-pointer",
                  selected: "bg-blue-600 text-white font-semibold rounded-md",
                  today:
                    "[&:not([data-selected])]:font-bold [&:not([data-selected])]:text-blue-600",
                  outside: "invisible pointer-events-none",
                  disabled: "text-slate-300 opacity-40 cursor-not-allowed pointer-events-none",
                  range_middle: "!bg-blue-50 !text-blue-900 !rounded-none font-medium",
                  range_start: "!rounded-r-none !rounded-l-md !bg-blue-600 !text-white font-bold",
                  range_end: "!rounded-l-none !rounded-r-md !bg-blue-600 !text-white font-bold",
                  hidden: "invisible",
                }}
              />
            </div>

            {/* Footer en 2 filas apiladas verticalmente para evitar scroll-x en contenedor de 276px */}
            <div className="mt-3 flex flex-col gap-2.5 border-t border-slate-100 px-1 pt-2.5">
              {/* Fila 1: Metadatos de días RN-09 + Botón Restablecer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 tabular-nums">
                  {selectedDayCount !== null ? (
                    <span className="font-bold text-slate-800">
                      {selectedDayCount} {selectedDayCount === 1 ? "día" : "días"}
                    </span>
                  ) : (
                    <span className="text-slate-400">Sin rango</span>
                  )}
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400">Máx. {maxDays}d</span>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 active:scale-[0.97]"
                  title="Restablecer a 30 días"
                >
                  <RiRefreshLine className="size-3" />
                  <span>Restablecer</span>
                </button>
              </div>

              {/* Fila 2: Botones de Acción (Cancelar y Aplicar a ancho completo 50/50) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition-all duration-150 ease-out hover:bg-slate-50 hover:text-slate-900 active:scale-[0.97]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!draftRange?.from || !draftRange?.to}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs transition-all duration-150 ease-out hover:bg-blue-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RiCheckLine className="size-3.5 shrink-0" />
                  <span>Aplicar</span>
                </button>
              </div>
            </div>
          </div>
        </PopoverPrimitives.Content>
      </PopoverPrimitives.Portal>
    </PopoverPrimitives.Root>
  );
}
