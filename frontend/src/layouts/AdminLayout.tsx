import { NavLink, Outlet, Link, Navigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  ArrowLeft,
} from "lucide-react"
import { Header } from "@/shared/components/layout/Header"
import { MobileNav } from "@/shared/components/layout/MobileNav"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"
import { useAuthStore } from "@/stores/authStore"

export function AdminLayout() {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${redirectUrl}`} replace />
  }

  if (user.role !== "admin") {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }
  const adminNav = [
    { label: "Overview", to: ROUTES.ADMIN, icon: LayoutDashboard, end: true },
    { label: "Users", to: ROUTES.ADMIN_USERS, icon: Users },
    { label: "Students", to: ROUTES.ADMIN_STUDENTS, icon: UserCheck },
    { label: "Documents", to: ROUTES.ADMIN_DOCUMENTS, icon: FileText },
  ]

  return (
    <div className="flex h-screen-dvh w-full max-w-full overflow-hidden bg-bg-primary text-text-primary">
      {/* Admin Desktop Sidebar */}
      <aside className="w-[220px] h-full shrink-0 bg-bg-secondary border-r border-border-default desktop:flex flex-col justify-between select-none hidden">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-14 px-4 flex items-center border-b border-border-default shrink-0">
            <BrandLogo size="sm" subtitle="Admin Console" />
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto flex-1 min-h-0">
            {adminNav.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px]",
                      isActive
                        ? "bg-interactive-selected text-text-primary font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-interactive-hover"
                    )
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-border-default shrink-0">
          <Link
            to={ROUTES.CHAT}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-interactive-hover rounded-md transition-colors min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Return to App</span>
          </Link>
        </div>
      </aside>

      <MobileNav />

      {/* Main Admin Content Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-bg-primary">
        <Header
          title="Administration"
          subtitle="System controls, user permissions & document ingestion"
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 p-page-x py-fluid-4 sm:py-fluid-6">
          <div className="min-w-0 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
