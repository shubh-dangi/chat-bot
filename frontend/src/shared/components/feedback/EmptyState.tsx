import * as React from "react"
import { Button } from "@/shared/components/ui/Button"
import { cn } from "@/shared/utils/cn"

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  children?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto select-none",
        className
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary mb-4 border border-border-default">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary leading-relaxed mb-5 max-w-xs">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  )
}
