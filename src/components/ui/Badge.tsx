import type { HTMLAttributes } from "react";
import { cn } from "@/lib/classNames";

type BadgeTone = "brass" | "cyan" | "magenta" | "emerald" | "muted";

const toneClasses: Record<BadgeTone, string> = {
  brass: "badge-brass",
  cyan: "badge-cyan",
  magenta: "badge-magenta",
  emerald: "badge-emerald",
  muted: "badge-muted",
};

export function Badge({
  className,
  tone = "brass",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={cn("badge", toneClasses[tone], className)} {...props} />;
}
