import Link from "next/link";
import { RiArrowLeftLine, RiShieldCheckLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface TraceabilityHeaderProps {
  productId: string;
  divergenceDelta?: string;
  isDanger?: boolean;
}

/**
 * Cabecera ejecutiva para la pantalla de trazabilidad y auditoría forense envuelta en Card.
 * Proporciona navegación de retorno hacia alertas o catálogo, identificadores y badges.
 */
export function TraceabilityHeader({
  productId,
  divergenceDelta,
  isDanger = false,
}: TraceabilityHeaderProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/alerts" className="gap-1.5 text-xs text-slate-700">
                <RiArrowLeftLine className="size-3.5" aria-hidden="true" />
                <span>Volver a Alertas</span>
              </Link>
            </Button>
            <span className="text-slate-300">|</span>
            <Badge variant="neutral" size="default" className="font-mono font-bold text-slate-600">
              SKU: {productId}
            </Badge>
            {divergenceDelta && (
              <Badge
                variant={isDanger ? "error" : "warning"}
                size="default"
                className="font-semibold"
              >
                Divergencia {divergenceDelta}
              </Badge>
            )}
            <Badge variant="success" size="default" className="gap-1 font-semibold">
              <RiShieldCheckLine className="size-3 text-emerald-600" aria-hidden="true" />
              <span>Auditado v1.0</span>
            </Badge>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Ficha de Producto y Trazabilidad Forense
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Certificación inmutable de observaciones diarias y trazabilidad matemática contra
              divisa benchmark.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
