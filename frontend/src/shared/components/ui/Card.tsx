import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  interactive?: boolean
}

export function Card({ className, elevated = false, interactive = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-default transition-all duration-normal",
        elevated ? "bg-bg-elevated shadow-xs" : "bg-bg-primary",
        interactive && "hover:border-border-strong hover:shadow-sm motion-safe:hover:-translate-y-[1px] cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5 sm:pb-3", className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-text-primary text-balance break-words", className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text-secondary mt-1 text-pretty break-words", className)} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5 pt-0", className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 sm:p-5 pt-0 flex flex-wrap items-center justify-end gap-2 sm:gap-3", className)} {...props} />
}
