import * as React from "react"

export interface ChatLayoutProps {
  activeId?: string | null
  children: React.ReactNode
}

export function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-bg-primary text-text-primary">
      {children}
    </div>
  )
}
