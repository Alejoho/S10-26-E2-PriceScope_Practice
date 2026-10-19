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

export interface StoreAuditExportData {
  name: string;
  tag: string;
  basketCost: string;
  monthlyVariation: string;
  skusCount: string;
  healthLabel: string;
  coveragePct: number;
  syncTimeArt: string;
}

/**
 * Exporta las filas de auditoría de la tabla de tiendas piloto a un archivo CSV descargable.
 */
export function exportStoresAuditCsv(rows: StoreAuditExportData[], currency: string = "ARS"): void {
  const headers = [
    "cadena_tienda",
    "categoria_tag",
    `canasta_regular_${currency.toLowerCase()}`,
    "variacion_mes",
    "skus_monitoreados",
    "calidad_scraping",
    "cobertura_pct",
    "ultima_sincronizacion",
  ];

  const csvRows = rows.map((r) =>
    [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.tag.replace(/"/g, '""')}"`,
      `"${r.basketCost.replace(/"/g, '""')}"`,
      `"${r.monthlyVariation.replace(/"/g, '""')}"`,
      `"${r.skusCount.replace(/"/g, '""')}"`,
      `"${r.healthLabel.replace(/"/g, '""')}"`,
      r.coveragePct,
      `"${r.syncTimeArt.replace(/"/g, '""')}"`,
    ].join(",")
  );

  const csvContent = [headers.join(","), ...csvRows].join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "pricescope-auditoria-tiendas.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
