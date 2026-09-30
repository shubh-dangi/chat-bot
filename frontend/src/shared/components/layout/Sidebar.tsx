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
import { Button } from "@/shared/components/ui/Button"
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
          "h-full shrink-0 bg-bg-secondary border-r border-border-default flex flex-col justify-between select-none transition-all duration-normal ease-out relative z-10",
          isMini ? "w-[72px]" : "w-[280px] xl:w-[300px]",
          className
        )}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Brand & Collapse Toggle */}
          {!isMini ? (
            <div className="h-14 px-3.5 flex items-center justify-between border-b border-border-default shrink-0">
              <BrandLogo
                size="md"
                subtitle="Campus Assistant"
                onClick={() => navigate(ROUTES.CHAT)}
              />
              <Tooltip content="Collapse sidebar" side="right">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors shrink-0"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          ) : (
            <div className="h-14 flex items-center justify-center border-b border-border-default px-2 shrink-0">
              <Tooltip content="Expand sidebar" side="right">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                >
                  <PanelLeftOpen className="w-5 h-5" />
                </button>
              </Tooltip>
            </div>
          )}

          {/* New Chat Button */}
          <div className={cn("p-3 border-b border-border-default shrink-0", isMini && "px-2 py-3 flex justify-center")}>
            {!isMini ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleNewChat}
                className="w-full justify-center gap-2 shadow-xs font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </Button>
            ) : (
              <Tooltip content="New Chat" side="right">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="w-10 h-10 rounded-xl bg-brand text-brand-contrast flex items-center justify-center shadow-xs hover:bg-brand-hover active:scale-95 transition-all"
                  aria-label="Start new chat"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
          </div>

          {/* Middle: Recent Chats List */}
          {!isMini ? (
            <div className="flex-1 min-h-0 min-w-0 flex flex-col">
              <div className="px-3 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold tracking-wider text-text-muted uppercase select-none shrink-0">
                <span>Recent</span>
                {searchQuery && (
                  <span className="text-[10px] font-normal lowercase tracking-normal text-brand truncate max-w-[120px]">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>

              <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain p-2 space-y-1">
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
            </div>
          ) : (
            <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain p-2 flex flex-col items-center gap-1.5">
              {conversations.slice(0, 15).map((conv) => (
                <Tooltip key={conv.id} content={conv.title} side="right">
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.CHAT_CONVERSATION(conv.id))}
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-text-secondary hover:text-brand-text hover:bg-brand-surface",
                      conv.id === activeId && "bg-brand-surface text-brand-text font-semibold border border-brand-border"
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

          {/* Bottom Utility Links (Settings, Admin) */}
          <div className="p-2 border-t border-border-default space-y-1 shrink-0">
            <NavLink
              to={ROUTES.SETTINGS}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors select-none",
                  isMini ? "justify-center p-2.5" : "px-3 py-2",
                  isActive
                    ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                    : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                )
              }
            >
              {isMini ? (
                <Tooltip content="Settings" side="right">
                  <Settings className="w-4 h-4 shrink-0" />
                </Tooltip>
              ) : (
                <>
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="truncate">Settings</span>
                </>
              )}
            </NavLink>

            {user?.role === "admin" && (
              <NavLink
                to={ROUTES.ADMIN}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors select-none",
                    isMini ? "justify-center p-2.5" : "px-3 py-2",
                    isActive
                      ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                      : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                  )
                }
              >
                {isMini ? (
                  <Tooltip content="Admin Console" side="right">
                    <Shield className="w-4 h-4 shrink-0" />
                  </Tooltip>
                ) : (
                  <>
                    <Shield className="w-4 h-4 shrink-0" />
                    <span className="truncate">Admin Console</span>
                  </>
                )}
              </NavLink>
            )}
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className={cn("p-2.5 border-t border-border-default shrink-0 bg-bg-primary/50", isMini && "flex justify-center")}>
          {user ? (
            <div className="flex items-center justify-between gap-1 w-full">
              <DropdownMenu
                align="left"
                className="bottom-full mb-2 w-56"
                trigger={
                  <div
                    className={cn(
                      "flex items-center rounded-lg hover:bg-interactive-hover transition-colors cursor-pointer group flex-1 min-w-0",
                      isMini ? "p-1.5 justify-center" : "justify-between p-1.5"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar
                        src={user.avatarUrl}
                        fallback={user.name}
                        size="sm"
                        className="shrink-0"
                      />
                      {!isMini && (
                        <div className="min-w-0 text-left">
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
                      <ChevronUp className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary shrink-0 transition-transform" />
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
                "flex items-center justify-center py-2 text-xs font-medium text-brand-text bg-brand-surface border border-brand-border rounded-lg hover:bg-brand-surface-strong",
                isMini ? "w-9 h-9 p-0" : "w-full"
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