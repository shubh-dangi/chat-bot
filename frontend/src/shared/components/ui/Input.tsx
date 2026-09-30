import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <div className="w-full min-w-0">
        <div className="relative flex items-center w-full min-w-0">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(
              "w-full min-w-0 h-10 xs:h-11 px-3.5 text-base xs:text-sm rounded-md bg-input-bg border border-input-border text-text-primary placeholder:text-input-placeholder transition-colors",
              "focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus",
              "disabled:bg-input-disabled-bg disabled:text-text-disabled disabled:cursor-not-allowed",
              error && "border-border-error focus:border-border-error focus:ring-border-error",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-status-error-text break-words" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"
