import * as React from "react"
import { cn } from "@/shared/utils/cn"
import { useClickOutside } from "@/shared/hooks/useClickOutside"

export interface DropdownMenuItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
  separator?: boolean
}

export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: "left" | "right"
  className?: string
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open)

  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-dropdown mt-1.5 min-w-[160px] rounded-lg bg-bg-elevated border border-border-default shadow-md p-1 duration-fast animate-page-enter",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {items.map((item, idx) => {
            if (item.separator) {
              return <div key={idx} className="my-1 border-t border-border-subtle" />
            }

            return (
              <button
                key={idx}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return
                  setOpen(false)
                  item.onClick?.()
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-1.5 text-xs sm:text-sm rounded text-left transition-colors select-none",
                  item.danger
                    ? "text-status-error-text hover:bg-status-error-surface"
                    : "text-text-primary hover:bg-interactive-hover",
                  item.disabled && "opacity-50 pointer-events-none"
                )}
              >
                {item.icon && <span className="shrink-0 w-4 h-4">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
