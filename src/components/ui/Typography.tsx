import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/classNames";

export function SmallLabel({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("eyebrow", className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <SmallLabel>{eyebrow}</SmallLabel>}
      <h2 className="mt-3 font-display text-4xl font-bold leading-none sm:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-ink/62">{children}</p>}
    </div>
  );
}

export function NumericText({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("venue-number", className)} {...props} />;
}
