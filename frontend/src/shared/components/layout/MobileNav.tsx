import * as React from "react"
import { NavLink } from "react-router-dom"
import {
  X,
  MessageSquare,
  GraduationCap,
  Search,
  Shield,
  Settings,
  User as UserIcon,
  LogOut,
} from "lucide-react"
import { useUiStore } from "@/stores/uiStore"
import { useAuthStore } from "@/stores/authStore"
import { Avatar } from "@/shared/components/ui/Avatar"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

export function MobileNav() {
  const { mobileNavOpen, setMobileNavOpen } = useUiStore()
  const { user, logout } = useAuthStore()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false)
    }

    if (mobileNavOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [mobileNavOpen, setMobileNavOpen])

  if (!mobileNavOpen) return null

  const navItems = [
    { label: "Chat Assistant", to: ROUTES.CHAT, icon: MessageSquare },
    { label: "Students", to: ROUTES.STUDENTS, icon: GraduationCap },
    { label: "Search", to: ROUTES.SEARCH, icon: Search },
    { label: "Profile", to: ROUTES.PROFILE, icon: UserIcon },
    { label: "Settings", to: ROUTES.SETTINGS, icon: Settings },
    ...(user?.role === "admin"
      ? [{ label: "Admin Console", to: ROUTES.ADMIN, icon: Shield }]
      : []),
  ]

  const handleNavClick = () => {
    setMobileNavOpen(false)
  }

  return (
    <div className="fixed inset-0 z-drawer lg:hidden select-none" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-bg-overlay transition-opacity duration-200"
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 w-[280px] bg-bg-secondary border-r border-border-default shadow-xl flex flex-col justify-between transition-transform duration-200 ease-out z-10 animate-in slide-in-from-left"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-border-default">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="College AI" className="w-6 h-6 rounded" />
              <span className="font-semibold text-base text-text-primary">College AI</span>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-interactive-hover"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-interactive-selected text-text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-interactive-hover"
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* User bar at bottom */}
        <div className="p-4 border-t border-border-default bg-bg-primary">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar src={user.avatarUrl} fallback={user.name} size="sm" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-text-primary truncate">{user.name}</div>
                  <div className="text-[11px] text-text-muted truncate capitalize">{user.role}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout()
                  setMobileNavOpen(false)
                }}
                className="p-1.5 text-text-muted hover:text-red-500 rounded hover:bg-interactive-hover"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <NavLink
              to={ROUTES.LOGIN}
              onClick={handleNavClick}
              className="block text-center py-2 text-xs font-medium border border-border-default rounded-md hover:bg-interactive-hover"
            >
              Sign In
            </NavLink>
          )}
        </div>
      </div>
    </div>
  )
}
