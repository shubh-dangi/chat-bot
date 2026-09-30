import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/shared/utils/cn"

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg"
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  maxWidth = "md",
}: DialogProps) {
  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const previousActiveElement = React.useRef<HTMLElement | null>(null)
  const titleId = React.useId()

  // Lock body scroll, trap focus, restore focus on close
  React.useEffect(() => {
    if (!open) return

    previousActiveElement.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation()
        onClose()
        return
      }

      if (e.key !== "Tab") return

      const surface = surfaceRef.current
      if (!surface) return

      const focusable = Array.from(surface.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      )
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Move focus into the dialog on the next frame
    const raf = requestAnimationFrame(() => {
      const surface = surfaceRef.current
      if (!surface) return
      const target =
        surface.querySelector<HTMLElement>('[data-autofocus="true"]') ??
        surface.querySelector<HTMLElement>(FOCUSABLE) ??
        surface
      target.focus({ preventScroll: true })
    })

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
      document.body.style.overflow = prevOverflow
      cancelAnimationFrame(raf)
      previousActiveElement.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const maxWidths = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-xl",
  }

  return (
    <div
      className="fixed inset-0 z-modal flex items-end sm:items-center justify-center overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg-overlay transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface — bottom sheet on mobile, centered dialog on >=sm */}
      <div
        ref={surfaceRef}
        tabIndex={-1}
        className={cn(
          "relative w-full z-10 bg-bg-elevated border border-border-default shadow-lg",
          "flex flex-col max-h-[92dvh] sm:max-h-[90dvh] sm:rounded-xl",
          "rounded-t-2xl sm:rounded-xl",
          "pb-[env(safe-area-inset-bottom)] sm:pb-0",
          "p-4 sm:p-6 animate-dialog-enter outline-none",
          maxWidths[maxWidth],
          className
        )}
      >
        {/* Drag affordance on mobile */}
        <div
          className="mx-auto mb-2 h-1 w-10 rounded-full bg-border-strong shrink-0 sm:hidden"
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4 shrink-0">
          <div className="min-w-0">
            {title && (
              <h2
                id={titleId}
                className="text-base sm:text-lg font-semibold text-text-primary tracking-tight text-balance break-words"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-xs sm:text-sm text-text-secondary break-words">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 -m-1 rounded-md text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain -mx-1 px-1 pb-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}
