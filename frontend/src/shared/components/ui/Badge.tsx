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
      "bg-bg-tertiary text-text-primary border-border-default",
    secondary:
      "bg-bg-secondary text-text-secondary border-border-subtle",
    outline:
      "bg-transparent text-text-primary border-border-default",
    success:
      "bg-status-success-surface text-status-success-text border-status-success-border",
    warning:
      "bg-status-warning-surface text-status-warning-text border-status-warning-border",
    error:
      "bg-status-error-surface text-status-error-text border-status-error-border",
    info:
      "bg-status-info-surface text-status-info-text border-status-info-border",
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
