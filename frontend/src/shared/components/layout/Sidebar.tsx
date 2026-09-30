import { useState } from "react"
import { useNavigate, useLocation, NavLink } from "react-router-dom"
import {
  MessageSquare,
  Plus,
  Shield,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Laptop,
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { useUiStore } from "@/stores/uiStore"
import { useConversations } from "@/features/chat/hooks/useConversations"
import { ConversationList } from "@/features/chat/components/ConversationList"
import { ShareDialog } from "@/features/chat/components/ShareDialog"
import { Avatar } from "@/shared/components/ui/Avatar"
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu"
import { Tooltip } from "@/shared/components/ui/Tooltip"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { useTheme } from "@/shared/hooks/useTheme"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"
import type { Conversation } from "@/features/chat/types/conversation.types"

export function Sidebar({ className, compact = false }: { className?: string; compact?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const [shareTarget, setShareTarget] = useState<Conversation | null>(null)

  const {
    conversations,
    searchQuery,
    createNewChat,
    renameChat,
    deleteChat,
    refresh,
  } = useConversations()

  const isMini = compact || sidebarCollapsed

  // Determine active conversation id from URL
  const activeId = location.pathname.startsWith("/chat/")
    ? location.pathname.replace("/chat/", "")
    : null

  const handleNewChat = async () => {
    const newConv = await createNewChat()
    navigate(ROUTES.CHAT_CONVERSATION(newConv.id))
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const userMenuItems = [
    {
      label: "Profile",
      icon: <UserIcon className="w-4 h-4" />,
      onClick: () => {
        navigate(ROUTES.PROFILE)
      },
    },
    {
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      onClick: () => {
        navigate(ROUTES.SETTINGS)
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
    <>
      <aside
        className={cn(
          "h-full shrink-0 bg-bg-secondary border-r border-border-default flex flex-col justify-between select-none overflow-hidden transition-[width] duration-300 ease-in-out will-change-[width] relative z-10",
          isMini ? "w-[72px]" : "w-[280px] xl:w-[300px]",
          className
        )}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Brand & Collapse Toggle */}
          <div className="h-14 px-3 flex items-center border-b border-border-default shrink-0 overflow-hidden relative">
            {!isMini && (
              <div
                onClick={() => navigate(ROUTES.CHAT)}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1 animate-page-enter transition-opacity duration-300"
              >
                <BrandLogo size="md" subtitle="Campus Assistant" />
              </div>
            )}

            <div
              className={cn(
                "transition-all duration-300 flex items-center shrink-0",
                isMini ? "w-full justify-center" : "justify-end"
              )}
            >
              <Tooltip content={isMini ? "Expand sidebar" : "Collapse sidebar"} side="right">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-interactive-hover active:scale-95 transition-all duration-200"
                  aria-label={isMini ? "Expand sidebar" : "Collapse sidebar"}
                  title={isMini ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {isMini ? (
                    <PanelLeftOpen className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
                  ) : (
                    <PanelLeftClose className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>

          {/* New Chat Button (Smooth Morphing) */}
          <div className="p-3 border-b border-border-default shrink-0 overflow-hidden">
            <Tooltip content="New Chat" side="right" disabled={!isMini}>
              <button
                type="button"
                onClick={handleNewChat}
                className={cn(
                  "h-10 rounded-xl bg-brand text-brand-contrast flex items-center shadow-xs hover:bg-brand-hover active:scale-95 transition-all duration-300 font-medium overflow-hidden",
                  isMini ? "w-10 justify-center mx-auto px-0" : "w-full px-3.5 justify-start gap-2.5"
                )}
                aria-label="Start new chat"
              >
                <Plus className="w-4 h-4 shrink-0 transition-transform duration-200" />
                {!isMini && (
                  <span className="text-xs whitespace-nowrap animate-page-enter font-medium transition-opacity duration-300">
                    New Chat
                  </span>
                )}
              </button>
            </Tooltip>
          </div>

          {/* Middle: Recent Chats Section */}
          <div className="flex-1 min-h-0 min-w-0 flex flex-col">
            {!isMini && (
              <div className="px-3 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold tracking-wider text-text-muted uppercase select-none shrink-0 animate-page-enter transition-opacity duration-300">
                <span>Recent</span>
                {searchQuery && (
                  <span className="text-[10px] font-normal lowercase tracking-normal text-brand truncate max-w-[120px]">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
            )}

            <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain px-2 py-1 space-y-1">
              {!isMini ? (
                <div className="animate-page-enter transition-opacity duration-300 space-y-1">
                  {conversations.length === 0 ? (
                    <div className="text-center py-8 px-3 text-xs text-text-muted space-y-1.5">
                      <MessageSquare className="w-6 h-6 mx-auto text-brand opacity-40 mb-2" />
                      {searchQuery ? (
                        <div>No chats match &quot;{searchQuery}&quot;</div>
                      ) : (
                        <div>No conversation history yet. Start a new chat above!</div>
                      )}
                    </div>
                  ) : (
                    <ConversationList
                      conversations={conversations}
                      activeId={activeId}
                      onRename={renameChat}
                      onDelete={deleteChat}
                      onOpenShare={(conv) => setShareTarget(conv)}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 animate-page-enter transition-opacity duration-300 py-1">
                  {conversations.slice(0, 15).map((conv) => (
                    <Tooltip key={conv.id} content={conv.title} side="right">
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.CHAT_CONVERSATION(conv.id))}
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 text-text-secondary hover:text-brand-text hover:bg-brand-surface active:scale-95",
                          conv.id === activeId && "bg-brand-surface text-brand-text font-semibold border border-brand-border shadow-xs"
                        )}
                        aria-label={conv.title}
                      >
                        <MessageSquare className="w-4 h-4 shrink-0" />
                      </button>
                    </Tooltip>
                  ))}

                  {conversations.length === 0 && (
                    <Tooltip content="No recent chats" side="right">
                      <div className="p-2 text-text-muted">
                        <MessageSquare className="w-4 h-4 opacity-40" />
                      </div>
                    </Tooltip>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Utility Links (Settings, Admin) */}
          <div className="p-2 border-t border-border-default space-y-1 shrink-0 overflow-hidden">
            <NavLink
              to={ROUTES.SETTINGS}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg text-xs font-medium transition-all duration-300 select-none overflow-hidden",
                  isMini ? "w-10 h-10 mx-auto justify-center p-0" : "w-full px-3 py-2 gap-2.5",
                  isActive
                    ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                    : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                )
              }
            >
              <Tooltip content="Settings" side="right" disabled={!isMini}>
                <div className="flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4 shrink-0" />
                </div>
              </Tooltip>
              {!isMini && (
                <span className="truncate whitespace-nowrap animate-page-enter transition-opacity duration-300">
                  Settings
                </span>
              )}
            </NavLink>

            {user?.role === "admin" && (
              <NavLink
                to={ROUTES.ADMIN}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg text-xs font-medium transition-all duration-300 select-none overflow-hidden",
                    isMini ? "w-10 h-10 mx-auto justify-center p-0" : "w-full px-3 py-2 gap-2.5",
                    isActive
                      ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                      : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                  )
                }
              >
                <Tooltip content="Admin Console" side="right" disabled={!isMini}>
                  <div className="flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 shrink-0" />
                  </div>
                </Tooltip>
                {!isMini && (
                  <span className="truncate whitespace-nowrap animate-page-enter transition-opacity duration-300">
                    Admin Console
                  </span>
                )}
              </NavLink>
            )}
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-2.5 border-t border-border-default shrink-0 bg-bg-primary/50 overflow-hidden transition-all duration-300">
          {user ? (
            <div className={cn("flex items-center transition-all duration-300", isMini ? "justify-center" : "justify-between gap-1 w-full")}>
              <DropdownMenu
                align="left"
                className="bottom-full mb-2 w-56"
                trigger={
                  <div
                    className={cn(
                      "flex items-center rounded-lg hover:bg-interactive-hover transition-all duration-200 cursor-pointer group",
                      isMini ? "p-1.5 justify-center" : "justify-between p-1.5 flex-1 min-w-0"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar
                        src={user.avatarUrl}
                        fallback={user.name}
                        size="sm"
                        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
                      />
                      {!isMini && (
                        <div className="min-w-0 text-left animate-page-enter transition-opacity duration-300">
                          <div className="text-xs font-semibold text-text-primary truncate">
                            {user.name}
                          </div>
                          <div className="text-[10px] text-text-muted truncate capitalize">
                            {user.role} • {user.department || "General"}
                          </div>
                        </div>
                      )}
                    </div>
                    {!isMini && (
                      <ChevronUp className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary shrink-0 transition-transform duration-200" />
                    )}
                  </div>
                }
                items={userMenuItems}
              />

              {!isMini && (
                <Tooltip content={theme === "dark" ? "Dark Theme" : theme === "light" ? "Light Theme" : "System Theme"}>
                  <button
                    type="button"
                    onClick={cycleTheme}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors shrink-0"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <Moon className="w-3.5 h-3.5" />
                    ) : theme === "light" ? (
                      <Sun className="w-3.5 h-3.5" />
                    ) : (
                      <Laptop className="w-3.5 h-3.5" />
                    )}
                  </button>
                </Tooltip>
              )}
            </div>
          ) : (
            <NavLink
              to={ROUTES.LOGIN}
              className={cn(
                "flex items-center justify-center text-xs font-medium text-brand-text bg-brand-surface border border-brand-border rounded-lg hover:bg-brand-surface-strong transition-all duration-300",
                isMini ? "w-9 h-9 p-0 mx-auto" : "w-full py-2"
              )}
            >
              {isMini ? "In" : "Sign In"}
            </NavLink>
          )}
        </div>
      </aside>

      {/* Share Dialog */}
      <ShareDialog
        open={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
        conversation={shareTarget}
        onConversationUpdated={() => refresh()}
      />
    </>
  )
}