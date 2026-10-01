import type { HTMLAttributes } from "react";
import { cn } from "@/lib/classNames";

type CardVariant = "default" | "panel" | "interactive";

const variantClasses: Record<CardVariant, string> = {
  default: "card",
  panel: "cabinet-panel",
  interactive: "card interactive-card",
};

export function Card({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLElement> & { variant?: CardVariant }) {
  return <article className={cn(variantClasses[variant], className)} {...props} />;
}
