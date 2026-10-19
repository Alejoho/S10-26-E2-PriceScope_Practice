import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface AlertsHeaderProps {
  criticalCount: number;
  isLoading?: boolean;
}

/**
 * Executive header component displaying active critical divergence alerts.
 */
export function AlertsHeader({ criticalCount, isLoading = false }: AlertsHeaderProps) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Alertas de Inflación Divergente
          </h1>
          {isLoading ? (
            <Skeleton className="h-6 w-32 rounded-full" />
          ) : (
            <Badge variant="error" className="rounded-full px-2.5 py-1 text-[11px] font-bold">
              {criticalCount} Críticas Activas
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Detección algorítmica de productos cuya aceleración de precio regular supera a la divisa
          cambiaria (Δ &gt; 0)
        </p>
      </div>
    </Card>
  );
}
