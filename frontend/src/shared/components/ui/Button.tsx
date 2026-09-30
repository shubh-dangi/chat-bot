import * as React from "react"
import { cn } from "@/shared/utils/cn"
import { Spinner } from "./Spinner"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "danger-ghost" | "outline"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-all duration-fast rounded-md"

    const variants = {
      primary:
        "bg-text-primary text-bg-primary hover:opacity-95 shadow-xs border border-transparent",
      secondary:
        "bg-bg-elevated text-text-primary border border-border-default hover:border-border-strong hover:bg-interactive-hover shadow-xs",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-interactive-hover",
      outline:
        "bg-bg-primary text-text-primary border border-border-default hover:bg-interactive-hover hover:border-border-strong shadow-xs",
      danger:
        "bg-status-error-border text-status-error-text bg-status-error-surface hover:border-status-error-text border shadow-xs",
      "danger-ghost":
        "bg-transparent text-status-error-text hover:bg-status-error-surface",
    }

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5",
      icon: "h-9 w-9 p-0 flex items-center justify-center shrink-0",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-1.5" />
            <span className="opacity-80">{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"
