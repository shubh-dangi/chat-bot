import { useNavigate } from "react-router-dom"
import {
  User as UserIcon,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  LogIn,
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { Avatar } from "@/shared/components/ui/Avatar"
import { Badge } from "@/shared/components/ui/Badge"
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu"
import { Button } from "@/shared/components/ui/Button"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

export function NavbarUserMenu({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  if (!user) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(ROUTES.LOGIN)}
          className="gap-1.5 text-xs h-9 px-3"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </Button>
      </div>
    )
  }

  const menuItems = [
    {
      label: "My Profile",
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => navigate(ROUTES.SETTINGS),
    },
    ...(user.role === "admin"
      ? [
          {
            label: "Admin Console",
            icon: <Shield className="w-4 h-4" />,
            onClick: () => navigate(ROUTES.ADMIN),
          },
        ]
      : []),
    { separator: true, label: "" },
    {
      label: "Sign out",
      icon: <LogOut className="w-4 h-4" />,
      danger: true,
      onClick: () => logout(),
    },
  ]

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu
        align="right"
        className="w-56"
        trigger={
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg",
              "hover:bg-interactive-hover transition-colors text-left",
              "border border-border-default bg-bg-secondary/60 focus:outline-none focus:ring-1 focus:ring-interactive-ring cursor-pointer"
            )}
            aria-label="User account menu"
          >
            <Avatar
              src={user.avatarUrl}
              fallback={user.name || user.email}
              size="sm"
              className="w-7 h-7 shrink-0 text-[11px]"
            />
            <div className="hidden md:flex flex-col text-left min-w-0 max-w-[130px]">
              <span className="text-xs font-semibold text-text-primary truncate leading-tight">
                {user.name || "Student"}
              </span>
              <span className="text-[10px] text-text-muted capitalize truncate leading-tight">
                {user.role}
              </span>
            </div>
            <Badge
              variant={user.role === "admin" ? "warning" : "default"}
              size="sm"
              className="hidden lg:inline-flex capitalize text-[10px] py-0 px-1.5"
            >
              {user.role}
            </Badge>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted shrink-0" />
          </button>
        }
        items={menuItems}
      />
    </div>
  )
}
