import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExportButton } from "@/components/ui/ExportButton";

interface DashboardHeaderCardProps {
  isLoading: boolean;
  hasData?: boolean;
  onExportCsv: () => void;
}

/**
 * Cabecera ejecutiva del Tablero Macroeconómico con acción de exportación CSV unificada.
 */
export function DashboardHeaderCard({
  isLoading,
  hasData = true,
  onExportCsv,
}: DashboardHeaderCardProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Tablero Macroeconómico de Inflación
          </h1>
          <Badge variant="teal" className="hidden font-semibold sm:inline-flex">
            B2B Real-Time
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Monitoreo analítico de canasta retail y correlación con divisa (ARS / USD Blue / Oficial)
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ExportButton
          formatLabel="CSV"
          onExport={onExportCsv}
          disabled={isLoading || !hasData}
          aria-label="Exportar CSV"
        />
      </div>
    </Card>
  );
}
