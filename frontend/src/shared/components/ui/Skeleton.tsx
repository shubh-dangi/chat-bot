import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-shimmer rounded-md bg-bg-skeleton", className)}
      {...props}
    />
  )
}
