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
  /** Preferred vertical placement; flips automatically when space is short */
  side?: "top" | "bottom"
  className?: string
}

const VIEWPORT_PADDING = 8

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  side = "bottom",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open)

  // Measure available space and pin the menu inside the viewport.
  // Styles are written imperatively so measuring never triggers a render pass.
  React.useLayoutEffect(() => {
    const triggerEl = triggerRef.current
    const menuEl = menuRef.current
    if (!open || !triggerEl || !menuEl) return

    const reposition = () => {
      const t = triggerEl.getBoundingClientRect()
      const m = menuEl.getBoundingClientRect()
      const vw = window.innerWidth
      const vh = window.innerHeight

      const style = menuEl.style
      style.top = ""
      style.bottom = ""
      style.left = ""
      style.right = ""

      // Horizontal: honour the requested alignment, but pull inside if it would clip
      if (align === "right") {
        if (t.right - m.width < VIEWPORT_PADDING) {
          style.left = `${Math.min(
            Math.max(VIEWPORT_PADDING, t.left),
            vw - m.width - VIEWPORT_PADDING
          )}px`
        } else {
          style.right = `${Math.max(VIEWPORT_PADDING, vw - t.right)}px`
        }
      } else {
        if (t.left + m.width > vw - VIEWPORT_PADDING) {
          style.right = `${Math.min(
            Math.max(VIEWPORT_PADDING, vw - t.right),
            vw - VIEWPORT_PADDING
          )}px`
        } else {
          style.left = `${Math.max(VIEWPORT_PADDING, t.left)}px`
        }
      }

      // Vertical: flip to the opposite side when there is not enough room
      const spaceBelow = vh - t.bottom
      const spaceAbove = t.top
      const wantsBottom = side === "bottom"
      const openUp = wantsBottom
        ? spaceBelow < m.height + 24 && spaceAbove > spaceBelow
        : spaceAbove < m.height + 24

      if (openUp) {
        style.bottom = `${Math.max(VIEWPORT_PADDING, vh - t.top)}px`
      } else {
        style.top = `${Math.min(t.bottom, vh - m.height - VIEWPORT_PADDING)}px`
      }
    }

    reposition()
    window.addEventListener("resize", reposition)
    window.addEventListener("scroll", reposition, true)
    return () => {
      window.removeEventListener("resize", reposition)
      window.removeEventListener("scroll", reposition, true)
    }
  }, [open, align, side])

  // Focus first item on open, and support arrow-key roving + Escape
  React.useEffect(() => {
    if (!open) return

    const raf = requestAnimationFrame(() => {
      itemRefs.current.find(Boolean)?.focus()
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        setOpen(false)
        triggerRef.current?.querySelector<HTMLElement>("button, [role='button']")?.focus()
        return
      }
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return

      e.preventDefault()
      const focusable = itemRefs.current.filter(Boolean) as HTMLButtonElement[]
      if (focusable.length === 0) return
      const current = focusable.indexOf(document.activeElement as HTMLButtonElement)
      const nextIndex =
        e.key === "ArrowDown"
          ? (current + 1 + focusable.length) % focusable.length
          : (current - 1 + focusable.length) % focusable.length
      focusable[nextIndex]?.focus()
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <div
        ref={triggerRef}
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </div>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            "fixed z-dropdown rounded-lg bg-bg-elevated border border-border-default shadow-md p-1",
            "max-h-[min(70dvh,20rem)] overflow-y-auto overscroll-contain",
            "[scrollbar-width:thin]",
            className
          )}
        >
          {items.map((item, idx) => {
            if (item.separator) {
              return <div key={idx} role="separator" className="my-1 border-t border-border-subtle" />
            }

            return (
              <button
                key={idx}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return
                  setOpen(false)
                  item.onClick?.()
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm rounded-md text-left transition-colors select-none min-h-[40px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring",
                  item.danger
                    ? "text-status-error-text hover:bg-status-error-surface"
                    : "text-text-primary hover:bg-interactive-hover",
                  item.disabled && "opacity-50 pointer-events-none"
                )}
              >
                {item.icon && <span className="shrink-0 w-4 h-4 flex items-center">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
