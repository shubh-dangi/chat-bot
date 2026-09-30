import { useState } from "react"
import { useNavigate, useLocation, NavLink } from "react-router-dom"
import {
  MessageSquare,
  Search,
  GraduationCap,
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
import { useConversations } from "@/features/chat/hooks/useConversations"
import { ConversationSearch } from "@/features/chat/components/ConversationSearch"
import { ConversationList } from "@/features/chat/components/ConversationList"
import { ShareDialog } from "@/features/chat/components/ShareDialog"
import { Button } from "@/shared/components/ui/Button"
import { Avatar } from "@/shared/components/ui/Avatar"
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu"
import { Tooltip } from "@/shared/components/ui/Tooltip"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { useTheme } from "@/shared/hooks/useTheme"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"
import type { Conversation } from "@/features/chat/types/conversation.types"

// Matches the `tablet` .. `desktop` range declared in tailwind.config.js.
const TABLET_COMPACT_QUERY = "(min-width: 640px) and (max-width: 1023.98px)"

export function Sidebar({ className, compact = false }: { className?: string; compact?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [shareTarget, setShareTarget] = useState<Conversation | null>(null)

  const {
    conversations,
    searchQuery,
    setSearchQuery,
    createNewChat,
    renameChat,
    deleteChat,
    refresh,
  } = useConversations()

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

  // Hook runs unconditionally; the `compact` prop only forces the rail on.
  const isTabletRange = useMediaQuery(TABLET_COMPACT_QUERY)
  const isTabletCompact = compact || isTabletRange
  const isMini = collapsed || isTabletCompact

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
          {/* Header Brand */}
          <div
            className={cn(
              "h-14 flex items-center border-b border-border-default transition-all duration-normal shrink-0",
              isMini ? "justify-center px-2" : "justify-between px-4"
            )}
          >
            {!isMini ? (
              <BrandLogo
                size="sm"
                subtitle="Campus Assistant"
                onClick={() => navigate(ROUTES.CHAT)}
              />
            ) : (
              <BrandLogo
                size="sm"
                compact
                onClick={() => navigate(ROUTES.CHAT)}
              />
            )}

            {!isTabletCompact && (
              <button
                type="button"
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <PanelLeftOpen className="w-4 h-4" />
                ) : (
                  <PanelLeftClose className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Primary Quick Nav Links */}
          <div className={cn("p-2 border-b border-border-default space-y-1 shrink-0", isMini && "flex flex-col items-center px-2")}>
            <NavLink
              to={ROUTES.CHAT}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors select-none",
                  isMini ? "justify-center p-2.5 w-10 h-10" : "px-3 py-2 w-full",
                  isActive
                    ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                    : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                )
              }
            >
              {isMini ? (
                <Tooltip content="Chat Assistant" side="right">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                </Tooltip>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">Chat Assistant</span>
                </>
              )}
            </NavLink>

            <NavLink
              to={ROUTES.SEARCH}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors select-none",
                  isMini ? "justify-center p-2.5 w-10 h-10" : "px-3 py-2 w-full",
                  isActive
                    ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                    : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                )
              }
            >
              {isMini ? (
                <Tooltip content="Search Knowledge" side="right">
                  <Search className="w-4 h-4 shrink-0" />
                </Tooltip>
              ) : (
                <>
                  <Search className="w-4 h-4 shrink-0" />
                  <span className="truncate">Search Knowledge</span>
                </>
              )}
            </NavLink>

            <NavLink
              to={ROUTES.STUDENTS}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg text-xs font-medium transition-colors select-none",
                  isMini ? "justify-center p-2.5 w-10 h-10" : "px-3 py-2 w-full",
                  isActive
                    ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                    : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                )
              }
            >
              {isMini ? (
                <Tooltip content="Student Directory" side="right">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                </Tooltip>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  <span className="truncate">Student Directory</span>
                </>
              )}
            </NavLink>
          </div>

          {/* New Chat Button & Chat Search Bar */}
          <div className={cn("p-3 border-b border-border-default shrink-0", isMini && "px-2 py-3 flex justify-center")}>
            {!isMini ? (
              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNewChat}
                  className="w-full justify-center gap-2 shadow-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </Button>

                {/* In-Sidebar Chat Search Input */}
                <ConversationSearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>
            ) : (
              <Tooltip content="New Chat" side="right">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="w-10 h-10 rounded-xl bg-brand text-brand-contrast flex items-center justify-center shadow-sm hover:bg-brand-hover active:scale-95 transition-all"
                  aria-label="Start new chat"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </Tooltip>
            )}
          </div>

          {/* Middle: Scrollable Chat History */}
          {!isMini ? (
            <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
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
            <div className="flex-1 overflow-y-auto p-2 flex flex-col items-center gap-2">
              <Tooltip content="All Chats" side="right">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.CHAT)}
                  className={cn(
                    "p-2.5 rounded-lg text-text-secondary hover:text-brand-text hover:bg-brand-surface transition-colors",
                    location.pathname.startsWith("/chat") && "bg-brand-surface text-brand-text font-semibold"
                  )}
                  aria-label="View chats"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </Tooltip>
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
                      <Moon className="w-3.5 h-3.5 text-brand" />
                    ) : theme === "light" ? (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
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