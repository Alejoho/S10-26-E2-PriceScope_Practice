"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

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
}

const SidebarContext = createContext<SidebarContextType | null>(null);

/**
 * Proveedor de estado para la barra lateral (Sidebar) con soporte de atajo de teclado (Ctrl+B / Cmd+B)
 * y colapso automático en pantallas menores a 1024px mediante `matchMedia`.
 */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    }),
    [isCollapsed, toggleSidebar]
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

/**
 * Hook para consumir el estado y acciones del Sidebar dentro de `SidebarProvider`.
 */
export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar debe utilizarse dentro de un SidebarProvider.");
  }
  return context;
}
