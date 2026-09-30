import React from "react"
import { cn } from "@/shared/utils/cn"

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number // ms delay
  children: React.ReactNode
  className?: string
}

export function FadeIn({ delay = 0, children, className, style, ...props }: FadeInProps) {
  return (
    <div
      className={cn("animate-page-enter", className)}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
