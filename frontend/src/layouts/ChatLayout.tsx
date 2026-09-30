import * as React from "react"
import { ChatSidebar } from "@/features/chat/components/ChatSidebar"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"

export interface ChatLayoutProps {
  activeId: string | null
  children: React.ReactNode
}

export function ChatLayout({ activeId, children }: ChatLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-full w-full overflow-hidden bg-bg-primary text-text-primary">
      {/* Desktop Chat Sidebar */}
      {isDesktop ? (
        <ChatSidebar activeId={activeId} />
      ) : (
        mobileSidebarOpen && (
          <div className="fixed inset-0 z-drawer select-none" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0 bg-bg-overlay transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed top-0 bottom-0 left-0 w-[280px] z-10 animate-in slide-in-from-left duration-200">
              <ChatSidebar activeId={activeId} className="w-full shadow-2xl" />
            </div>
          </div>
        )
      )}

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ onToggleSidebar?: () => void }>, {
              onToggleSidebar: () => setMobileSidebarOpen((prev) => !prev),
            })
          : children}
      </div>
    </div>
  )
}
