import * as React from "react"
import { Menu, Sun, Moon, Laptop } from "lucide-react"
import { useUiStore } from "@/stores/uiStore"
import { useTheme } from "@/shared/hooks/useTheme"
import { Button } from "@/shared/components/ui/Button"
import { Tooltip } from "@/shared/components/ui/Tooltip"
import { cn } from "@/shared/utils/cn"

export interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function Header({ title, subtitle, actions, className }: HeaderProps) {
  const { toggleMobileNav } = useUiStore()
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const themeIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4" />
    if (theme === "light") return <Sun className="w-4 h-4" />
    return <Laptop className="w-4 h-4" />
  }

  const themeLabel = () => {
    if (theme === "dark") return "Dark theme (click for system)"
    if (theme === "light") return "Light theme (click for dark)"
    return "System theme (click for light)"
  }

  return (
    <header
      className={cn(
        "h-14 px-4 sm:px-6 shrink-0 bg-bg-primary border-b border-border-default flex items-center justify-between gap-4 select-none",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleMobileNav}
          className="lg:hidden p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-interactive-hover transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-semibold text-text-primary truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-text-muted hidden sm:block truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        <Tooltip content={themeLabel()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label="Toggle visual theme"
            className="w-8 h-8 rounded-md text-text-secondary hover:text-text-primary"
          >
            {themeIcon()}
          </Button>
        </Tooltip>
      </div>
    </header>
  )
}
