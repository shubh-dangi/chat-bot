import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  id?: string
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  id,
}: SwitchProps) {
  const generatedId = React.useId()
  const switchId = id || generatedId

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <label htmlFor={switchId} className="cursor-pointer select-none">
          {label && <div className="text-sm font-medium text-text-primary">{label}</div>}
          {description && <div className="text-xs text-text-secondary">{description}</div>}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ring disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-text-primary"
            : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-bg-primary shadow-xs ring-0 transition-transform duration-fast",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}
