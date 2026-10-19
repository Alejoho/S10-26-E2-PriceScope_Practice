# MEMORY.md — PriceScope Client (apps/client)

Memoria viva del proyecto entre sesiones (Máximo ~50 líneas).

## Estado Actual

- **Base UI:** Next.js 16 + React 19 + Tailwind CSS v4 + Radix UI + Recharts 3.10.
- **Spec 001 Finalizada:** Dashboard analítico (`/`) alineado temporal y cromáticamente.
- **Spec 002 Finalizada (chart-grid-alignment):**
  - Modularización limpia de `dashboardUtils` en submódulos especializados bajo `src/lib/dashboard/` (~30-70 líneas) y hook `useDashboardData` en `src/hooks/`.
  - Sincronización milimétrica entre `LineChart` y `Tracker` con contenedor `pl-24 pr-3` (96px/12px).
- **Spec 003 Finalizada (alerts-components-integration):**
  - Desmantelado de la vista monolítica de `/alerts` (de 613 a 80 líneas en `page.tsx`).
  - Reemplazo 100% por componentes primitivos oficiales (`Card`, `Table`, `Badge`, `Button`, `Select`, `Pagination`, `Skeleton`, `Callout`).
  - Adaptador HTTP `src/services/alerts.service.ts` conmutando por `NEXT_PUBLIC_API_URL` a `/api/v1/alerts` y fallback local mock con latencia de red.
  - Custom hook `useAlertsData` con filtros reactivos, paginación oficial y exportación RFC 4180 (CSV/JSON).
  - Cobertura de tests unitarios en Vitest (29 tests aprobados, 0 errores, 0 advertencias).
- **Rutas en Desarrollo:** Trazabilidad de Producto `/products/[id]`.

## Decisiones y Justificación Técnica

- **Alineación Declarativa:** Coordenadas declarativas directas coincidentes con el eje X categórico (`shortDate`).
- **Conmutación Transparente de API:** Evaluación de `NEXT_PUBLIC_API_URL` para conmutar directamente al endpoint real sin tocar código de UI.
- **Técnica resolvedQueryKey:** Derivación limpia de `isLoading` en custom hooks evitando llamadas redundantes a `setState` en `useEffect`.
- **Orquestación Multiagente:** Coordinador autónomo riguroso en TDD y auditoría formal independiente vía `sdd-reviewer`.

## Aprendizajes y Errores a Evitar

- **CSpell y Convenciones:** Mantener términos de negocio y técnicos sincronizados en `cspell.json`.
- **Zero Errors:** Mantener `npm run check-all` y `npx tsc --noEmit` en 0 errores y 0 advertencias.

## Próximos Pasos en Cola

- Iniciar la siguiente especificación SDD para el módulo de Trazabilidad de Producto (`/products/[id]`).
