import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { cn } from "@/shared/utils/cn"

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  onGoHome?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't complete your request. Please try again or return home.",
  onRetry,
  onGoHome,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto select-none",
        className
      )}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-status-error-surface border border-status-error-border flex items-center justify-center text-status-error-text mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-6 max-w-xs">{message}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button variant="primary" size="sm" onClick={onGoHome}>
            <Home className="w-3.5 h-3.5 mr-1.5" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  )
}
