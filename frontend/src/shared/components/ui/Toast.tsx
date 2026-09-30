import * as React from "react"
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react"
import { cn } from "@/shared/utils/cn"

export type ToastType = "success" | "error" | "info" | "warning"

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  React.useEffect(() => {
    const duration = toast.duration ?? (toast.type === "error" ? 6000 : 4000)
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-status-success-text shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-status-error-text shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-status-warning-text shrink-0" />,
    info: <Info className="w-4 h-4 text-status-info-text shrink-0" />,
  }

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 w-full max-w-sm p-3.5 rounded-lg bg-bg-elevated border border-border-default shadow-lg text-sm transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in"
      )}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <div className="font-semibold text-text-primary text-xs mb-0.5">{toast.title}</div>}
        <div className="text-text-primary text-xs leading-relaxed break-words">{toast.message}</div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
