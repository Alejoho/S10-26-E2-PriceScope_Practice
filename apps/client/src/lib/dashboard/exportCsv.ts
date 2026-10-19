import type { PuntoSerie } from "@/types/api";

/**
 * Exporta la serie temporal activa del Dashboard a un archivo CSV para descarga.
 */
export function exportDashboardSeriesCsv(series: PuntoSerie[]): void {
  const headers = [
    "fecha_utc",
    "precio_regular_ars",
    "precio_promocional_ars",
    "precio_usd",
    "estado_dato",
    "cotizacion_aplicada",
    "cotizacion_aproximada",
    "motivo",
  ];
  const rows = series.map((pt) =>
    [
      pt.timestamp_utc,
      pt.precio_regular ?? "",
      pt.precio_promocional ?? "",
      pt.precio_usd ?? "",
      pt.estado_dato,
      pt.cotizacion_aplicada ?? "",
      pt.cotizacion_aproximada,
      pt.motivo ? `"${pt.motivo.replace(/"/g, '""')}"` : "",
    ].join(",")
  );
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "pricescope-dashboard-series.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Alias de compatibilidad hacia atrás para exportDashboardCsv.
 */
export const exportDashboardCsv = exportDashboardSeriesCsv;
