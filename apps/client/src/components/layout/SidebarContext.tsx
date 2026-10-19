"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

export interface PilotStoreItem {
  id: string;
  name: string;
  lastRun: string;
}

export const DEFAULT_PILOT_STORES: readonly PilotStoreItem[] = [
  { id: "carrefour", name: "Carrefour", lastRun: "14:00 ART" },
  { id: "jumbo", name: "Jumbo", lastRun: "14:05 ART" },
  { id: "fravega", name: "Frávega", lastRun: "14:10 ART" },
  { id: "musimundo", name: "Musimundo", lastRun: "14:15 ART" },
];

export interface SidebarContextType {
  /** Estado booleano corto: true cuando está colapsado a modo icono */
  isCollapsed: boolean;
  /** Estado booleano equivalente al estándar de Shadcn Sidebar (`!isCollapsed`) */
  open: boolean;
  /** Estado textual para selectores CSS `data-state` ("expanded" | "collapsed") */
  state: "expanded" | "collapsed";
  /** Alterna entre estado expandido y colapsado */
  toggleSidebar: () => void;
  /** Fija explícitamente el estado colapsado */
  setCollapsed: (collapsed: boolean) => void;
  /** Tiendas piloto monitoreadas en tiempo real */
  pilotStores: readonly PilotStoreItem[];
  /** Actualiza las tiendas piloto con los datos del backend */
  setPilotStores: (stores: readonly PilotStoreItem[]) => void;
  /** Etiqueta de última sincronización general del sistema */
  lastUpdatedLabel: string;
  /** Actualiza la etiqueta de sincronización general */
  setLastUpdatedLabel: (label: string) => void;
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

/**
 * Proveedor de estado para la barra lateral (Sidebar) con soporte de atajo de teclado (Ctrl+B / Cmd+B)
 * y colapso automático en pantallas menores a 1024px mediante `matchMedia`.
 */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pilotStores, setPilotStores] = useState<readonly PilotStoreItem[]>(DEFAULT_PILOT_STORES);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState<string>("Hoy 14:00 ART");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsCollapsed(true);
      }
    };

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const contextValue = useMemo<SidebarContextType>(
    () => ({
      isCollapsed,
      open: !isCollapsed,
      state: isCollapsed ? "collapsed" : "expanded",
      toggleSidebar,
      setCollapsed: setIsCollapsed,
      pilotStores,
      setPilotStores,
      lastUpdatedLabel,
      setLastUpdatedLabel,
    }),
    [isCollapsed, toggleSidebar, pilotStores, lastUpdatedLabel]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3.5rem",
          } as React.CSSProperties
        }
        className="group/sidebar-wrapper flex h-screen w-full overflow-hidden"
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export { useSidebar } from "@/hooks/useSidebar";
