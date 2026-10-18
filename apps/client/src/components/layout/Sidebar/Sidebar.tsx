"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { RiDashboardLine, RiNotification3Line } from "@remixicon/react";

import { useSidebar } from "../SidebarContext";
import { SidebarBrandHeader } from "./SidebarBrandHeader";
import { SidebarNavItem } from "./SidebarNavItem";
import { type PilotStoreItem, SidebarPilotStores } from "./SidebarPilotStores";
import { SidebarStatusFooter } from "./SidebarStatusFooter";
import { SidebarUpcomingPhase } from "./SidebarUpcomingPhase";

/**
 * Propiedades del componente coordinador Sidebar.
 */
export interface SidebarProps {
  /** Lista de tiendas piloto monitoreadas (por defecto usa las 4 tiendas de HU-01). */
  stores?: readonly PilotStoreItem[];
  /** Cantidad de alertas activas mostradas en el badge de navegación. */
  alertCount?: number;
}

const DEFAULT_PILOT_STORES: readonly PilotStoreItem[] = [
  { id: "carrefour", name: "Carrefour", lastRun: "14:00 ART" },
  { id: "jumbo", name: "Jumbo (Cencosud)", lastRun: "13:58 ART" },
  { id: "fravega", name: "Frávega", lastRun: "13:45 ART" },
  { id: "musimundo", name: "Musimundo", lastRun: "13:30 ART" },
];

/**
 * Coordinador principal de la barra lateral ejecutiva de PriceScope.
 * Coordina `SidebarBrandHeader`, `SidebarNavItem`, `SidebarPilotStores`, `SidebarUpcomingPhase` y `SidebarStatusFooter`.
 */
export function Sidebar({ stores = DEFAULT_PILOT_STORES, alertCount = 3 }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, state, toggleSidebar } = useSidebar();

  const isDashboard = pathname === "/" || pathname === "/dashboard";
  const isAlerts = pathname === "/alerts";

  return (
    <div
      data-slot="sidebar"
      data-state={state}
      data-collapsible={isCollapsed ? "icon" : ""}
      className="group text-slate-200 select-none"
    >
      {/* Espaciador en flujo que anima el ancho suavemente en 200ms ease-linear */}
      <div
        data-slot="sidebar-gap"
        className="relative h-screen w-(--sidebar-width) shrink-0 bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
      />

      {/* Contenedor fijo lateral con overflow-hidden para revelar texto sin mover iconos ni letras */}
      <aside
        data-slot="sidebar-container"
        className="fixed inset-y-0 left-0 z-30 flex h-screen w-(--sidebar-width) flex-col justify-between overflow-hidden border-r border-slate-800/80 bg-[#0a0f1d] transition-[width] duration-200 ease-linear group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <SidebarBrandHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />

          <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto px-2 py-4 group-data-[collapsible=icon]:overflow-hidden">
            {/* Sección 1: Analítica Principal */}
            <div>
              <div className="mb-1 flex h-6 items-center px-2.5 text-[10px] font-bold tracking-[0.12em] whitespace-nowrap text-slate-400 uppercase opacity-100 transition-opacity delay-75 duration-150 ease-linear group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:delay-0 group-data-[collapsible=icon]:duration-0">
                Analítica Principal
              </div>

              <ul className="flex flex-col gap-1">
                <SidebarNavItem
                  href="/"
                  label="Tablero Macroeconómico"
                  icon={RiDashboardLine}
                  isActive={isDashboard}
                  isCollapsed={isCollapsed}
                  accent="blue"
                />
                <SidebarNavItem
                  href="/alerts"
                  label="Alertas de Inflación"
                  icon={RiNotification3Line}
                  isActive={isAlerts}
                  isCollapsed={isCollapsed}
                  accent="amber"
                  badgeCount={alertCount}
                />
              </ul>
            </div>

            {/* Sección 2: Tiendas Piloto Monitoreadas (HU-01) */}
            <SidebarPilotStores stores={stores} />

            {/* Sección 3: Próxima Fase (1.5) */}
            <SidebarUpcomingPhase />
          </div>
        </div>

        <SidebarStatusFooter />
      </aside>
    </div>
  );
}
