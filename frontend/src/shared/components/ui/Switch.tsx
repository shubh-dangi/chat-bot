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
  const switchId = id || React.useId()

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
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50",
          checked
            ? "bg-neutral-800 dark:bg-neutral-100"
            : "bg-neutral-300 dark:bg-neutral-700"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-neutral-900 shadow ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  )
}
