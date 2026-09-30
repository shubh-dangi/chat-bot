import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuthStore } from "@/stores/authStore"
import { Sidebar } from "@/shared/components/layout/Sidebar"
import { MobileNav } from "@/shared/components/layout/MobileNav"
import { ROUTES } from "@/shared/config/routes"

export function RootLayout() {
  const { user } = useAuthStore()
  const location = useLocation()

  // Protect all child shell routes — unauthenticated users redirected to login
  if (!user) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${redirectUrl}`} replace />
  }

  // The shell uses a definite height (not min-height) so the `h-full` scroll
  // containers in the page layouts resolve against a real containing block
  // instead of collapsing to content height.
  return (
    <div className="flex h-screen-dvh w-full max-w-full overflow-hidden bg-bg-primary text-text-primary">
      {/* Persistent Sidebar: full panel on desktop, compact rail on tablet */}
      <Sidebar className="hidden tablet:flex" />

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileNav />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-bg-primary">
        <Outlet />
      </main>
    </div>
  )
}
