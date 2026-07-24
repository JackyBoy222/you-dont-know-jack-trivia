import type { HTMLAttributes } from "react";
import { cn } from "@/lib/classNames";

export function CountdownDisplay({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-live="polite"
      className={cn("venue-number countdown-display", className)}
      {...props}
    />
  );
}
