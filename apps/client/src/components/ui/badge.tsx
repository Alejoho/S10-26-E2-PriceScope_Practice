import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { cx } from "@/lib/utils";

const badgeVariants = tv({
  base: "inline-flex items-center gap-x-1 rounded-md font-semibold whitespace-nowrap ring-1 ring-inset tabular-nums",
  variants: {
    variant: {
      default: "bg-blue-50 text-blue-700 ring-blue-600/20",
      neutral: "bg-slate-100 text-slate-700 ring-slate-500/20",
      success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
      error: "bg-rose-50 text-rose-700 ring-rose-600/20",
      purple: "bg-purple-50 text-purple-700 ring-purple-600/20",
      cyanDark: "bg-cyan-950/70 text-cyan-300 ring-cyan-800/60",
      amberDark: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
      slateDark: "bg-slate-800/80 text-slate-400 ring-slate-700/50",
    },
    size: {
      default: "px-2 py-0.5 text-xs",
      xs: "px-1.5 py-0.5 text-[10px] leading-none",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<"span">, VariantProps<typeof badgeVariants> {}

/**
 * Primitivo Badge de Tremor / Shadcn UI para etiquetas de estado, alertas y variaciones (BadgeDelta).
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cx(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
