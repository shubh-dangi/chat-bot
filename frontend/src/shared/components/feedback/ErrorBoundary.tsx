import React, { Component, type ErrorInfo, type ReactNode } from "react"
import { ErrorState } from "./ErrorState"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In production, log to telemetry service
    console.error("Uncaught frontend error:", error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <ErrorState
            title="An error occurred in this view"
            message="Something didn't load correctly. You can try refreshing this section."
            onRetry={this.handleRetry}
            onGoHome={() => (window.location.href = "/")}
          />
        </div>
      )
    }

    return this.props.children
  }
}
