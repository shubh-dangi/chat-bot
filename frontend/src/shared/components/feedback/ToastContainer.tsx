import React, { createContext, useState, useCallback } from "react"
import { Toast, type ToastItem, type ToastType } from "@/shared/components/ui/Toast"
import { useToast, type ToastContextValue } from "@/shared/hooks/useToast"

export const ToastContext = createContext<ToastContextValue | null>(null)
export { useToast }

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, type: ToastType = "info", title?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6)
    setToasts((prev) => [...prev, { id, message, type, title }])
  }, [])

  const success = useCallback((msg: string, title?: string) => showToast(msg, "success", title), [showToast])
  const error = useCallback((msg: string, title?: string) => showToast(msg, "error", title), [showToast])
  const info = useCallback((msg: string, title?: string) => showToast(msg, "info", title), [showToast])
  const warning = useCallback((msg: string, title?: string) => showToast(msg, "warning", title), [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Desktop: bottom-right. Mobile: full-width sheet above the composer / safe area. */}
      <div
        className="fixed z-toast flex flex-col gap-2 pointer-events-none
                   inset-x-0 bottom-0 px-3
                   pb-[max(0.75rem,env(safe-area-inset-bottom))]
                   items-stretch
                   sm:inset-x-auto sm:bottom-4 sm:right-4 sm:right-6 sm:left-auto sm:items-end sm:pb-0
                   sm:max-w-sm sm:w-[min(24rem,calc(100vw-2rem))]"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full min-w-0">
            <Toast toast={toast} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
