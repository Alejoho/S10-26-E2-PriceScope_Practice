import type { AlertaItem } from "@/types/api";

/**
 * Escapes CSV text fields conforming to RFC 4180.
 */
function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Builds RFC 4180 compliant CSV string from alerts list.
 */
export function buildAlertsCsv(alerts: AlertaItem[]): string {
  const headers = [
    "alerta_id",
    "producto_canonico_id",
    "producto_nombre",
    "tienda_nombre",
    "periodo_inicio_utc",
    "periodo_fin_utc",
    "variacion_precio_pct",
    "variacion_cotizacion_pct",
    "diferencial_puntos",
    "cotizacion_usada_cierre",
    "cobertura_pct",
    "regla_faltantes",
    "tipo_alerta",
  ];

  const rows = alerts.map((alert) =>
    [
      escapeCsvField(alert.alerta_id),
      escapeCsvField(alert.producto_canonico_id),
      escapeCsvField(alert.producto_nombre),
      escapeCsvField(alert.tienda_nombre),
      escapeCsvField(alert.periodo.inicio_utc),
      escapeCsvField(alert.periodo.fin_utc),
      escapeCsvField(alert.variacion_precio_pct),
      escapeCsvField(alert.variacion_cotizacion_pct),
      escapeCsvField(alert.diferencial_puntos),
      escapeCsvField(alert.cotizacion_usada_cierre),
      escapeCsvField(alert.cobertura_pct),
      escapeCsvField(alert.regla_faltantes),
      escapeCsvField(alert.tipo_alerta),
    ].join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Triggers a browser download of alerts in CSV format.
 */
export function exportAlertsCsv(
  alerts: AlertaItem[],
  filename: string = "pricescope-alertas.csv"
): void {
  const csvContent = buildAlertsCsv(alerts);
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  triggerBrowserDownload(blob, filename);
}

/**
 * Triggers a browser download of alerts in JSON format.
 */
export function exportAlertsJson(
  alerts: AlertaItem[],
  filename: string = "pricescope-alertas.json"
): void {
  const jsonContent = JSON.stringify(alerts, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  triggerBrowserDownload(blob, filename);
}

/**
 * Helper to initiate a client-side file download via dynamic anchor.
 */
function triggerBrowserDownload(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
