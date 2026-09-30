import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline"
  size?: "sm" | "md"
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full select-none transition-colors border"

  const variants = {
    default:
      "bg-bg-secondary text-text-primary border-border-default",
    brand:
      "bg-brand text-brand-contrast border-transparent",
    secondary:
      "bg-bg-tertiary text-text-secondary border-border-subtle",
    outline:
      "bg-transparent text-text-primary border-border-default",
    success:
      "bg-bg-secondary text-text-primary border-border-strong",
    warning:
      "bg-bg-tertiary text-text-primary border-border-strong",
    error:
      "bg-bg-secondary text-text-primary border-border-strong font-medium",
    info:
      "bg-bg-secondary text-text-secondary border-border-default",
  }

  const sizes = {
    sm: "px-2 py-0.5 text-[11px] leading-tight",
    md: "px-2.5 py-0.5 text-xs leading-normal",
  }

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  )
}
