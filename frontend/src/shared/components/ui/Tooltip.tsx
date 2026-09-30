import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  delay?: number
  disabled?: boolean
}

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 300,
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (disabled) return
    timerRef.current = setTimeout(() => {
      setVisible(true)
    }, delay)
  }

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  const sides = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  }

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && !disabled && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-tooltip max-w-[min(14rem,60vw)] rounded px-2 py-1 text-xs font-medium text-balance break-words pointer-events-none select-none",
            "bg-neutral-900 text-neutral-0 dark:bg-neutral-50 dark:text-neutral-900 shadow-sm",
            sides[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
