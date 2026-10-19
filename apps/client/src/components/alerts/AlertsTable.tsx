import { RiDownload2Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AlertTableRowView } from "@/lib/alerts/types";
import { AlertTableRowItem } from "./AlertTableRowItem";
import { TableSkeletonRows } from "./TableSkeletonRows";

export interface AlertsTableProps {
  rows: AlertTableRowView[];
  isLoading: boolean;
  limitPerPage?: number;
  children?: React.ReactNode;
  onExportCsv?: () => void;
  onExportJson?: () => void;
}

/**
 * Forensic table displaying divergence alert items with export actions, loading skeletons and traceability links.
 */
export function AlertsTable({
  rows,
  isLoading,
  children,
  onExportCsv,
  onExportJson,
}: AlertsTableProps) {
  return (
    <Card className="overflow-hidden shadow-2xs">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Detalle Forense de Productos con Alerta
          </h2>
          <p className="text-xs text-slate-500">
            Productos con divergencia detectada según los filtros activos
          </p>
        </div>
        {(onExportCsv || onExportJson) && (
          <div className="flex items-center gap-2">
            {onExportCsv && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onExportCsv}
                disabled={isLoading || rows.length === 0}
                aria-label="Exportar CSV"
              >
                <RiDownload2Line className="size-3.5 text-slate-500" />
                <span>Exportar CSV</span>
              </Button>
            )}
            {onExportJson && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onExportJson}
                disabled={isLoading || rows.length === 0}
                aria-label="Exportar JSON"
              >
                <RiDownload2Line className="size-3.5 text-slate-500" />
                <span>Exportar JSON</span>
              </Button>
            )}
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-5 py-3.5">Producto Monitoreado</TableHead>
            <TableHead className="px-4 py-3.5">Tienda</TableHead>
            <TableHead className="px-4 py-3.5">Var. ARS</TableHead>
            <TableHead className="px-4 py-3.5">Var. USD</TableHead>
            <TableHead className="px-4 py-3.5">Diferencial (Δpts)</TableHead>
            <TableHead className="px-4 py-3.5">Cotiz. Usada</TableHead>
            <TableHead className="px-4 py-3.5 text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-slate-100 font-medium">
          {isLoading ? (
            <TableSkeletonRows count={5} />
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-xs text-slate-500">
                No se encontraron alertas para los filtros seleccionados.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => <AlertTableRowItem key={row.id} row={row} />)
          )}
        </TableBody>
      </Table>
      {children}
    </Card>
  );
}
