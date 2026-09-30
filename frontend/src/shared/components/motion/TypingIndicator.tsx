import { cn } from "@/shared/utils/cn"

export interface TypingIndicatorProps {
  label?: string
  className?: string
}

export function TypingIndicator({ label = "Thinking", className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-bg-secondary border border-border-default text-text-muted text-xs shadow-xs animate-message-enter select-none",
        className
      )}
      role="status"
      aria-label="Assistant is thinking"
    >
      <span className="text-[11px] font-medium tracking-wide text-text-secondary">{label}</span>
      <div className="inline-flex items-center gap-1.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-text-secondary typing-dot-1" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-secondary typing-dot-2" />
        <span className="w-1.5 h-1.5 rounded-full bg-text-secondary typing-dot-3" />
      </div>
    </div>
  )
}
