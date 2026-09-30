import React from "react"
import { cn } from "@/shared/utils/cn"

export interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className={cn("animate-page-enter w-full h-full flex flex-col flex-1", className)}>
      {children}
    </div>
  )
}
