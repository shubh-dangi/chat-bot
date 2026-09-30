import * as React from "react"
import { cn } from "@/shared/utils/cn"

export function PageContainer({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "w-full max-w-5xl mx-auto min-w-0",
        "px-page-x py-fluid-5 sm:py-fluid-6",
        className
      )}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-3 sm:gap-4",
        "mb-fluid-4 sm:mb-fluid-6 pb-fluid-3 border-b border-border-default",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="text-heading-4 sm:text-heading-3 font-semibold text-text-primary tracking-tight text-balance break-words">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-text-secondary leading-normal text-pretty break-words">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap [&>*]:min-w-0">
          {actions}
        </div>
      )}
    </div>
  )
}
