import * as React from "react"
import { cn } from "@/shared/utils/cn"

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-1 border-b border-border-default overflow-x-auto no-scrollbar", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap select-none",
              isActive
                ? "border-brand text-brand-text font-semibold"
                : "border-transparent text-text-secondary hover:text-brand-text hover:border-brand-border"
            )}
          >
            {tab.icon && <span className="w-4 h-4 shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-bg-tertiary text-text-secondary">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
