import { Outlet } from "react-router-dom"
import { Sidebar } from "@/shared/components/layout/Sidebar"
import { MobileNav } from "@/shared/components/layout/MobileNav"

export function RootLayout() {
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
