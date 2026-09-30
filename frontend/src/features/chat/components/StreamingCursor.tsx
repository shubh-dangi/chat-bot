import { cn } from "@/shared/utils/cn"

export function StreamingCursor({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-4 ml-1 bg-text-primary align-middle animate-cursor-blink select-none",
        className
      )}
      aria-hidden="true"
    />
  )
}
