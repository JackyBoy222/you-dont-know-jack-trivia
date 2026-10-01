import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/classNames";

type ButtonVariant = "primary" | "secondary" | "navigation";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  navigation: "ticket-link",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Exclude<ButtonVariant, "navigation">;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(variantClasses[variant], className)} {...props} />;
}

export function ButtonLink({
  className,
  href,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http");
  const classNames = cn(variantClasses[variant], className);

  if (isExternal) {
    return <a className={classNames} href={href} {...props} />;
  }

  return <Link className={classNames} href={href} {...props} />;
}

export function NavigationButton({ className, ...props }: ButtonLinkProps) {
  return <ButtonLink className={className} variant="navigation" {...props} />;
}
