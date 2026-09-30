import { Skeleton } from "@/shared/components/ui/Skeleton"
import { cn } from "@/shared/utils/cn"

export interface LoadingStateProps {
  type?: "card" | "table" | "chat" | "page"
  className?: string
}

export function LoadingState({ type = "card", className }: LoadingStateProps) {
  if (type === "chat") {
    return (
      <div className={cn("space-y-4 max-w-2xl mx-auto w-full p-4", className)}>
        <div className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>
        <div className="flex items-start justify-end gap-3">
          <div className="space-y-2 flex-1 max-w-md">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (type === "table") {
    return (
      <div className={cn("space-y-3 w-full", className)}>
        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-14 w-full rounded" />
        <Skeleton className="h-14 w-full rounded" />
        <Skeleton className="h-14 w-full rounded" />
      </div>
    )
  }

  if (type === "page") {
    return (
      <div className={cn("space-y-6 w-full max-w-4xl mx-auto p-6", className)}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded" />
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className={cn("p-6 rounded-lg border border-border-default space-y-4", className)}>
      <Skeleton className="h-6 w-1/3 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
    </div>
  )
}
