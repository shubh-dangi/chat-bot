import { useContext } from "react"
import { ToastContext } from "@/shared/components/feedback/ToastContainer"
import type { ToastType } from "@/shared/components/ui/Toast"

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
