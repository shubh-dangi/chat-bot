import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/shared/utils/cn"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  label?: string
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full min-w-0 h-11 xs:h-10 pl-3 pr-9 text-base xs:text-sm rounded-md bg-input-bg border border-input-border text-text-primary appearance-none transition-colors",
              "focus:outline-none focus:border-input-border-focus focus:ring-1 focus:ring-input-border-focus",
              "disabled:bg-input-disabled-bg disabled:text-text-disabled disabled:cursor-not-allowed",
              error && "border-border-error",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bg-elevated text-text-primary">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        </div>
        {error && (
          <p className="mt-1 text-xs text-status-error-text break-words" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"
