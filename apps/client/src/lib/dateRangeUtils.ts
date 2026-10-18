import * as React from "react";
import {
  differenceInCalendarDays,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  subDays,
} from "date-fns";
import type { DateRange } from "react-day-picker";

export type { DateRange };

/**
 * Configuración de un atajo rápido de rango de fechas (`Preset` de Tremor).
 */
export interface DateRangePreset {
  /** Etiqueta visible en la lista lateral de atajos. */
  label: string;
  /** Rango de fechas asociado al atajo. */
  dateRange: {
    from: Date;
    to: Date;
  };
}

/**
 * Formatea un objeto Date al estándar `YYYY-MM-DD` requerido por los contratos OpenAPI (`fecha_desde` y `fecha_hasta`).
 */
export function formatDateForApi(date: Date | undefined): string {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
}

/**
 * Genera la lista de atajos rápidos (presets) de PriceScope hasta el límite anual de 365 días (RN-09).
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
 * Calcula la cantidad inclusiva de días seleccionados en un rango temporal.
 */
export function calculateRangeDayCount(range: DateRange | undefined): number | null {
  if (!range?.from) return null;
  if (!range.to) return 1;
  return Math.max(1, differenceInCalendarDays(range.to, range.from) + 1);
}

/**
 * Formatea la etiqueta resumida del botón disparador (`dd/MM/yyyy - dd/MM/yyyy (Nd)`).
 */
export function formatDateRangeLabel(range: DateRange | undefined, placeholder: string): string {
  if (!range?.from) return placeholder;
  if (!range.to) return format(range.from, "dd/MM/yyyy");
  const days = calculateRangeDayCount(range) ?? 1;
  return `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")} (${days}d)`;
}

/**
 * Evalúa si un rango temporal coincide exactamente con un atajo predefinido.
 */
export function isPresetRangeMatch(range: DateRange | undefined, preset: DateRangePreset): boolean {
  if (!range?.from || !range?.to) return false;
  return isSameDay(range.from, preset.dateRange.from) && isSameDay(range.to, preset.dateRange.to);
}

/**
 * Parámetros de configuración del hook de estado `useDateRangeDraft`.
 */
export interface UseDateRangeDraftParams {
  /** Rango controlado actual. */
  value?: DateRange;
  /** Callback al aplicar el rango. */
  onChange?: (dateRange: DateRange | undefined) => void;
  /** Lista de atajos opcionales. */
  presets?: DateRangePreset[];
  /** Límite máximo de días (RN-09). */
  maxDays: number;
  /** Deshabilita fechas futuras (RN-09). */
  disableFuture: boolean;
}

/**
 * Hook que aísla la lógica de estado temporal, validación RN-09 y navegación de meses del DateRangePicker.
 */
export function useDateRangeDraft({
  value,
  onChange,
  presets: presetsProp,
  maxDays,
  disableFuture,
}: UseDateRangeDraftParams) {
  const today = React.useMemo(() => endOfDay(new Date()), []);
  const presets = React.useMemo(
    () => presetsProp ?? getPriceScopePresets(today),
    [presetsProp, today]
  );
  const defaultRange = React.useMemo(() => (presets[2] ?? presets[0])?.dateRange, [presets]);
  const effectiveValue = value ?? defaultRange;

  const [open, setOpen] = React.useState(false);
  const [draftRange, setDraftRange] = React.useState<DateRange | undefined>(effectiveValue);
  const [activeField, setActiveField] = React.useState<"from" | "to" | null>(null);

  const minHistoricalDate = React.useMemo(
    () => startOfDay(subDays(today, maxDays - 1)),
    [today, maxDays]
  );

  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    () => effectiveValue?.to ?? effectiveValue?.from ?? today
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      setActiveField(null);
      if (nextOpen) {
        setDraftRange(effectiveValue);
        setCurrentMonth(effectiveValue?.to ?? effectiveValue?.from ?? today);
      }
    },
    [effectiveValue, today]
  );

  const handlePillClick = React.useCallback(
    (field: "from" | "to") => {
      if (activeField === field) {
        setActiveField(null);
        return;
      }
      setActiveField(field);
      const targetDate = field === "from" ? draftRange?.from : draftRange?.to;
      if (targetDate) {
        setCurrentMonth(targetDate);
      }
    },
    [activeField, draftRange]
  );

  const handleDaySelect = React.useCallback(
    (selectedRange: DateRange | undefined, triggerDate?: Date) => {
      if (activeField && triggerDate) {
        const from = activeField === "from" ? triggerDate : (draftRange?.from ?? triggerDate);
        const to = activeField === "to" ? triggerDate : (draftRange?.to ?? triggerDate);
        setDraftRange(isAfter(from, to) ? { from: to, to: from } : { from, to });
        setActiveField(null);
        return;
      }

      setDraftRange(selectedRange);
      setActiveField(selectedRange?.from && !selectedRange.to ? "to" : null);
    },
    [activeField, draftRange]
  );

  const handlePresetSelect = React.useCallback((preset: DateRangePreset) => {
    setDraftRange(preset.dateRange);
    setCurrentMonth(preset.dateRange.to);
    setActiveField(null);
  }, []);

  const handleApply = React.useCallback(() => {
    if (!draftRange?.from || !draftRange?.to) return;
    onChange?.(draftRange);
    setOpen(false);
  }, [draftRange, onChange]);

  const handleCancel = React.useCallback(() => {
    setDraftRange(effectiveValue);
    setActiveField(null);
    setOpen(false);
  }, [effectiveValue]);

  const handleReset = React.useCallback(() => {
    const defaultPreset = presets[2] ?? presets[0];
    if (defaultPreset) {
      setDraftRange(defaultPreset.dateRange);
      setCurrentMonth(defaultPreset.dateRange.to);
    } else {
      setDraftRange(undefined);
    }
    setActiveField(null);
  }, [presets]);

  const disabledMatchers = React.useMemo(
    () => [
      ...(disableFuture ? [{ after: today }] : []),
      ...(maxDays > 0 ? [{ before: minHistoricalDate }] : []),
      ...(activeField === "to" && draftRange?.from && !isBefore(today, draftRange.from)
        ? [{ before: draftRange.from }]
        : []),
    ],
    [disableFuture, today, maxDays, minHistoricalDate, activeField, draftRange]
  );

  return {
    open,
    effectiveValue,
    draftRange,
    activeField,
    currentMonth,
    setCurrentMonth,
    today,
    presets,
    minHistoricalDate,
    disabledMatchers,
    selectedDayCount: calculateRangeDayCount(draftRange),
    handleOpenChange,
    handlePillClick,
    handleDaySelect,
    handlePresetSelect,
    handleApply,
    handleCancel,
    handleReset,
  };
}
