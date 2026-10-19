# MEMORY.md — PriceScope Client (apps/client)

Memoria viva del proyecto entre sesiones (Máximo ~50 líneas).

## Estado Actual

- **Base UI:** Next.js 16 + React 19 + Tailwind CSS v4 + Radix UI + Recharts 3.10.
- **Spec 001 Finalizada:** Dashboard analítico (`/`) alineado temporal y cromáticamente.
- **Spec 002 Finalizada (chart-grid-alignment):**
  - Modularización limpia de `dashboardUtils` en submódulos especializados bajo `src/lib/dashboard/` (~30-70 líneas) y hook `useDashboardData` en `src/hooks/`.
  - Eliminación de puntos sintéticos de frontera: correspondencia limpia 1:1 (`chartData.length === series.length`).
  - Geometría adaptativa en `ReferenceArea` SVG con expansión $\pm W/2$ por día para bordes continuos sin desalinear la escala ordinal.
  - Sincronización milimétrica entre `LineChart` y `Tracker` con contenedor `pl-24 pr-3` (96px/12px).
- **Rutas en Desarrollo:** `/alerts` y `/products/[id]`.

## Decisiones y Justificación Técnica

- **Alineación Declarativa:** Eliminados offsets empíricos y puntos sintéticos en favor de coordenadas declarativas directas coincidentes con el eje X categórico (`shortDate`).
- **Homologación Cromática:** Unificados tokens cromáticos de alerta (Verde `#10b981`, Amarillo `#f59e0b`, Rojo `#ef4444`, Púrpura `#8b5cf6`).
- **Orquestación Multiagente:** Coordinador autónomo `sdd-coordinator` riguroso en TDD y auditoría formal independiente vía `sdd-reviewer`.

## Aprendizajes y Errores a Evitar

- **Recharts ReferenceArea:** Usar claves coincidentes exactas con el eje categórico para evitar desalineaciones con flexbox horizontal del Tracker.
- **CSpell y Convenciones:** Mantener términos de negocio y técnicos sincronizados en `cspell.json`.
- **Zero Errors:** Mantener `npm run check-all` y `npx tsc --noEmit` en 0 errores y 0 advertencias.

## Próximos Pasos en Cola

- Iniciar la siguiente especificación SDD para el módulo de Alertas (`/alerts`) o Trazabilidad de Producto (`/products/[id]`).
