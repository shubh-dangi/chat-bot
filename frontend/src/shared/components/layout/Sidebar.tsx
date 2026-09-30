import { NavLink } from "react-router-dom"
import {
  MessageSquare,
  GraduationCap,
  Search,
  Shield,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronUp,
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { Avatar } from "@/shared/components/ui/Avatar"
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

export function Sidebar({ className }: { className?: string }) {
  const { user, logout } = useAuthStore()

  const navItems = [
    { label: "Chat Assistant", to: ROUTES.CHAT, icon: MessageSquare },
    { label: "Students", to: ROUTES.STUDENTS, icon: GraduationCap },
    { label: "Search", to: ROUTES.SEARCH, icon: Search },
    ...(user?.role === "admin"
      ? [{ label: "Admin Console", to: ROUTES.ADMIN, icon: Shield }]
      : []),
  ]

  const userMenuItems = [
    {
      label: "Profile",
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => {
        window.location.href = ROUTES.PROFILE
      },
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => {
        window.location.href = ROUTES.SETTINGS
      },
    },
    { separator: true, label: "" },
    {
      label: "Sign out",
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: () => logout(),
    },
  ]

  return (
    <aside
      className={cn(
        "w-[260px] h-screen shrink-0 bg-bg-secondary border-r border-border-default flex flex-col justify-between select-none",
        className
      )}
    >
      {/* Brand & Nav */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-border-default">
          <img src="/logo.svg" alt="College AI logo" className="w-6 h-6 rounded" />
          <span className="font-semibold text-base tracking-tight text-text-primary">
            College AI
          </span>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto flex-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-100",
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

      {/* User profile dropdown at bottom */}
      <div className="p-3 border-t border-border-default">
        {user ? (
          <DropdownMenu
            align="left"
            className="bottom-full mb-2 w-56"
            trigger={
              <div className="flex items-center justify-between w-full p-2 rounded-md hover:bg-interactive-hover transition-colors cursor-pointer group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={user.avatarUrl}
                    fallback={user.name}
                    size="sm"
                    className="shrink-0"
                  />
                  <div className="min-w-0 text-left">
                    <div className="text-xs font-semibold text-text-primary truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] text-text-muted truncate capitalize">
                      {user.role} • {user.department || "General"}
                    </div>
                  </div>
                </div>
                <ChevronUp className="w-4 h-4 text-text-muted group-hover:text-text-primary shrink-0 transition-transform" />
              </div>
            }
            items={userMenuItems}
          />
        ) : (
          <NavLink
            to={ROUTES.LOGIN}
            className="flex items-center justify-center w-full py-2 text-xs font-medium text-text-primary border border-border-default rounded-md hover:bg-interactive-hover"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </aside>
  )
}
