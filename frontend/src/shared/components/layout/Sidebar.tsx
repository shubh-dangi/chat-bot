import { useState } from "react"
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { Avatar } from "@/shared/components/ui/Avatar"
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu"
import { Tooltip } from "@/shared/components/ui/Tooltip"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

export function Sidebar({ className }: { className?: string }) {
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

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
        "h-screen shrink-0 bg-bg-secondary border-r border-border-default flex flex-col justify-between select-none transition-all duration-normal ease-out",
        collapsed ? "w-[72px]" : "w-[260px]",
        className
      )}
    >
      {/* Brand & Nav */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className={cn(
          "h-14 flex items-center border-b border-border-default transition-all duration-normal",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          {!collapsed ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-text-primary text-bg-primary flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                CA
              </div>
              <span className="font-semibold text-base tracking-tight text-text-primary truncate">
                College AI
              </span>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-text-primary text-bg-primary flex items-center justify-center font-bold text-xs shadow-xs">
              CA
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="p-2.5 space-y-1 overflow-y-auto flex-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const linkContent = (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "relative flex items-center gap-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-fast select-none",
                    collapsed ? "justify-center p-2.5" : "px-3 py-2",
                    isActive
                      ? "bg-bg-elevated text-text-primary font-semibold shadow-xs border border-border-default"
                      : "text-text-secondary hover:text-text-primary hover:bg-interactive-hover"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-text-primary" />
                    )}
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.to} content={item.label} side="right">
                  {linkContent}
                </Tooltip>
              )
            }
            return linkContent
          })}
        </nav>
      </div>

      {/* User profile dropdown at bottom */}
      <div className={cn("p-2.5 border-t border-border-default", collapsed && "flex justify-center")}>
        {user ? (
          <DropdownMenu
            align="left"
            className="bottom-full mb-2 w-56"
            trigger={
              <div
                className={cn(
                  "flex items-center rounded-lg hover:bg-interactive-hover transition-colors cursor-pointer group",
                  collapsed ? "p-1.5 justify-center" : "justify-between p-2 w-full"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    src={user.avatarUrl}
                    fallback={user.name}
                    size="sm"
                    className="shrink-0"
                  />
                  {!collapsed && (
                    <div className="min-w-0 text-left">
                      <div className="text-xs font-semibold text-text-primary truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-text-muted truncate capitalize">
                        {user.role} • {user.department || "General"}
                      </div>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <ChevronUp className="w-4 h-4 text-text-muted group-hover:text-text-primary shrink-0 transition-transform" />
                )}
              </div>
            }
            items={userMenuItems}
          />
        ) : (
          <NavLink
            to={ROUTES.LOGIN}
            className={cn(
              "flex items-center justify-center py-2 text-xs font-medium text-text-primary border border-border-default rounded-lg hover:bg-interactive-hover",
              collapsed ? "w-9 h-9 p-0" : "w-full"
            )}
          >
            {collapsed ? "In" : "Sign In"}
          </NavLink>
        )}
      </div>
    </aside>
  )
}
