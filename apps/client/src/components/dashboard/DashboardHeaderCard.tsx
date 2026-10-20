import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

/**
 * Cabecera ejecutiva del Tablero Macroeconómico.
 */
export function DashboardHeaderCard() {
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
    </Card>
  );
}
