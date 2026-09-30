import React from "react"
import { ErrorBoundary } from "@/shared/components/feedback/ErrorBoundary"
import { ToastProvider } from "@/shared/components/feedback/ToastContainer"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ToastProvider>{children}</ToastProvider>
    </ErrorBoundary>
  )
}
