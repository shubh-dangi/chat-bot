import * as React from "react"
import { Menu, Sun, Moon, Laptop } from "lucide-react"
import { useUiStore } from "@/stores/uiStore"
import { useTheme } from "@/shared/hooks/useTheme"
import { Button } from "@/shared/components/ui/Button"
import { Tooltip } from "@/shared/components/ui/Tooltip"
import { Logo } from "@/shared/components/ui/Logo"
import { UniversalSearchBar } from "./UniversalSearchBar"
import { NavbarUserMenu } from "./NavbarUserMenu"
import { cn } from "@/shared/utils/cn"

export interface HeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
  showSearch?: boolean
}

export function Header({
  title,
  subtitle,
  actions,
  className,
  showSearch = true,
}: HeaderProps) {
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
        "flex items-center justify-between gap-2 sm:gap-4 select-none",
        "sticky top-0 z-sticky",
        className
      )}
    >
      {/* Left: Hamburger + Mobile Logo + Title */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink-0">
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
          <div className="min-w-0 hidden xs:block">
            <h1 className="text-xs sm:text-sm font-semibold text-text-primary truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-text-muted hidden md:block truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Middle: Universal Search Bar fixed in Navbar */}
      {showSearch && (
        <div className="flex-1 flex justify-center px-1 sm:px-2 min-w-0 max-w-lg">
          <UniversalSearchBar />
        </div>
      )}

      {/* Right Corner: Actions + Theme Toggle + User Account Profile Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
        {actions && (
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {actions}
          </div>
        )}

        <Tooltip content={themeLabel()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleTheme}
            aria-label="Toggle visual theme"
            className="text-text-secondary hover:text-text-primary w-9 h-9"
          >
            {themeIcon()}
          </Button>
        </Tooltip>

        {/* User Account Details in top navbar right corner */}
        <NavbarUserMenu />
      </div>
    </header>
  )
}
