import * as React from "react"
import { Menu, Sun, Moon, Laptop } from "lucide-react"
import { useUiStore } from "@/stores/uiStore"
import { useTheme } from "@/shared/hooks/useTheme"
import { Button } from "@/shared/components/ui/Button"
import { Tooltip } from "@/shared/components/ui/Tooltip"
import { Logo } from "@/shared/components/ui/Logo"
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
        "h-14 px-3 sm:px-page-x shrink-0 bg-bg-primary border-b border-border-default",
        "flex items-center justify-between gap-2 sm:gap-3 select-none",
        "sticky top-0 z-sticky",
        className
      )}
    >
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          onClick={toggleMobileNav}
          className="tablet:hidden p-2 -ml-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-interactive-hover transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="tablet:hidden shrink-0">
          <Logo size="xs" />
        </div>

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

      <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
        {actions && <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">{actions}</div>}

        <Tooltip content={themeLabel()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label="Toggle visual theme"
            className="text-text-secondary hover:text-text-primary"
          >
            {themeIcon()}
          </Button>
        </Tooltip>
      </div>
    </header>
  )
}
