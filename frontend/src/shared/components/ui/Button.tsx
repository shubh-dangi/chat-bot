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
      "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] duration-100 rounded-md"

    const variants = {
      primary:
        "bg-neutral-800 text-neutral-0 hover:bg-neutral-700 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100 shadow-xs",
      secondary:
        "bg-transparent text-text-primary border border-border-default hover:bg-interactive-hover hover:border-border-strong",
      ghost:
        "bg-transparent text-text-secondary hover:text-text-primary hover:bg-interactive-hover",
      outline:
        "bg-bg-primary text-text-primary border border-border-default hover:bg-interactive-hover",
      danger:
        "bg-red-500 text-white hover:bg-red-600 shadow-xs",
      "danger-ghost":
        "bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-neutral-800",
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
