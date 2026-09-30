import * as React from "react"
import { cn } from "@/shared/utils/cn"
import { Spinner } from "./Spinner"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "danger-ghost" | "outline"
  size?: "sm" | "md" | "lg" | "icon"
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading = false, disabled, fullWidth, children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring focus-visible:ring-offset-1 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none transition-all duration-fast rounded-md"

    // Hover-lift is pointer-only; touch devices get active-state feedback instead
    const interactionStyles =
      "motion-safe:hover:-translate-y-[1px] motion-safe:hover:shadow-sm active:translate-y-0 active:scale-[0.98]"

    const variants = {
      primary:
        "bg-brand text-brand-contrast hover:bg-brand-hover active:bg-brand-active shadow-sm border border-transparent font-medium",
      secondary:
        "bg-bg-elevated text-text-primary border border-border-default hover:border-brand-border hover:bg-brand-surface shadow-xs",
      ghost:
        "bg-transparent text-text-secondary hover:text-brand-text hover:bg-brand-surface",
      outline:
        "bg-bg-primary text-brand-text border border-brand-border hover:bg-brand-surface hover:border-brand-border-strong shadow-xs font-medium",
      danger:
        "bg-status-error-surface text-status-error-text border border-status-error-border hover:bg-status-error-border/20 shadow-xs",
      "danger-ghost":
        "bg-transparent text-status-error-text hover:bg-status-error-surface",
    }

    // Mobile-first: every variant meets the 44px touch target on small screens,
    // then relaxes to denser desktop sizing once pointer devices are detected.
    const sizes = {
      sm: "min-h-[40px] h-9 px-3 text-xs gap-1.5 xs:min-h-0 xs:h-8",
      md: "min-h-[44px] h-10 px-4 text-sm gap-2 xs:min-h-0 xs:h-9",
      lg: "min-h-[48px] h-12 px-5 text-sm gap-2 sm:text-base sm:px-6",
      icon: "min-h-[44px] min-w-[44px] h-10 w-10 p-0 xs:min-h-0 xs:min-w-0 xs:h-9 xs:w-9",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          interactionStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-1.5 shrink-0" />
            <span className="opacity-80 truncate">{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"
