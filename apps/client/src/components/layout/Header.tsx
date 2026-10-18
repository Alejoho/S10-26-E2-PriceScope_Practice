"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiDatabase2Line } from "@remixicon/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/StatusDot";

export interface HeaderProps {
  /** Etiqueta de hora de la última sincronización exitosa (HU-49) */
  lastUpdatedLabel?: string;
  /** Cantidad de tiendas piloto activas en el sistema (HU-01) */
  monitoredStoresCount?: number;
  /** Etiqueta regional del entorno analítico */
  regionLabel?: string;
}

/**
 * Resuelve el título de la vista activa a partir de la ruta actual (`pathname`).
 */
export function getViewTitle(pathname: string): string {
  if (pathname === "/" || pathname === "/dashboard") {
    return "Tablero Macroeconómico de Inflación";
  }
  if (pathname.includes("/traceability") || pathname.startsWith("/products")) {
    return "Ficha de Producto y Trazabilidad Forense";
  }
  if (pathname.startsWith("/alerts")) {
    return "Módulo de Alertas de Inflación";
  }
  return "Monitor Analítico";
}

/**
 * Cabecera superior del layout principal construida sobre los primitivos Breadcrumb y Badge
 * de Shadcn UI / Tremor, con indicadores de frescura de datos del sistema (HU-49).
 */
export function Header({
  lastUpdatedLabel = "Hoy 14:00 ART",
  monitoredStoresCount = 4,
  regionLabel = "Argentina B2B",
}: HeaderProps) {
  const pathname = usePathname();
  const currentViewTitle = getViewTitle(pathname);

  return (
    <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6 sm:px-8">
      {/* Breadcrumb oficial de Shadcn UI + Etiqueta de Contexto */}
      <div className="flex min-w-0 items-center gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">PriceScope</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-50 truncate sm:max-w-none">
                {currentViewTitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Badge
          variant="neutral"
          size="xs"
          className="hidden rounded-full px-2 py-0.5 font-bold tracking-wider text-slate-600 uppercase md:inline-flex"
        >
          {regionLabel}
        </Badge>
      </div>

      {/* Indicadores de Sistema (HU-49 - Sin login de usuario) */}
      <div className="flex shrink-0 items-center gap-4">
        {/* Frescura de Datos HU-49 */}
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
          <StatusDot variant="emerald" size="sm" ping />
          <span className="text-[11px] font-medium tabular-nums">
            Últ. actualización: <strong className="text-slate-800">{lastUpdatedLabel}</strong>
          </span>
        </div>

        {/* Cobertura de Scraping */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500 sm:flex">
          <RiDatabase2Line className="size-3.5 text-blue-600" />
          <span className="tabular-nums">{monitoredStoresCount} Tiendas Monitoreadas</span>
        </div>
      </div>
    </header>
  );
}
