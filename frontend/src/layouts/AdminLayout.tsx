import { NavLink, Outlet, Link } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  ArrowLeft,
} from "lucide-react"
import { Header } from "@/shared/components/layout/Header"
import { MobileNav } from "@/shared/components/layout/MobileNav"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"

export function AdminLayout() {
  const adminNav = [
    { label: "Overview", to: ROUTES.ADMIN, icon: LayoutDashboard, end: true },
    { label: "Users", to: ROUTES.ADMIN_USERS, icon: Users },
    { label: "Students", to: ROUTES.ADMIN_STUDENTS, icon: UserCheck },
    { label: "Documents", to: ROUTES.ADMIN_DOCUMENTS, icon: FileText },
  ]

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Admin Desktop Sidebar */}
      <aside className="w-[220px] h-screen shrink-0 bg-bg-secondary border-r border-border-default hidden lg:flex flex-col justify-between select-none">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-14 px-4 flex items-center gap-2 border-b border-border-default">
            <span className="font-semibold text-sm tracking-tight text-text-primary">
              Admin Console
            </span>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto flex-1">
            {adminNav.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
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

        <div className="p-3 border-t border-border-default">
          <Link
            to={ROUTES.CHAT}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-interactive-hover rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to App</span>
          </Link>
        </div>
      </aside>

      <MobileNav />

      {/* Main Admin Content Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-bg-primary">
        <Header title="Administration" subtitle="System controls, user permissions & document ingestion" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
