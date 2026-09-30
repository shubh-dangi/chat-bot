import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full min-w-0">
        <textarea
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full min-w-0 min-h-[80px] p-3 text-base xs:text-sm rounded-md bg-input-bg border border-input-border text-text-primary placeholder:text-input-placeholder transition-colors resize-none",
            "focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus",
            "disabled:bg-input-disabled-bg disabled:text-text-disabled disabled:cursor-not-allowed",
            error && "border-border-error focus:border-border-error focus:ring-border-error",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-status-error-text break-words" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"
