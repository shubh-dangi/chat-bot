import { Outlet } from "react-router-dom"
import { Sidebar } from "@/shared/components/layout/Sidebar"
import { MobileNav } from "@/shared/components/layout/MobileNav"

export function RootLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Persistent Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Slide-out Mobile Navigation Drawer */}
      <MobileNav />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-bg-primary">
        <Outlet />
      </main>
    </div>
  )
}
