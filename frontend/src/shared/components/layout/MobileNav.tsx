import React, { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation, NavLink } from "react-router-dom"
import {
  X,
  Plus,
  MessageSquare,
  Search,
  GraduationCap,
  Shield,
  Settings,
  LogOut,
  Sun,
  Moon,
  Laptop,
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  ArrowLeft,
} from "lucide-react"
import { useUiStore } from "@/stores/uiStore"
import { useAuthStore } from "@/stores/authStore"
import { useConversations } from "@/features/chat/hooks/useConversations"
import { ConversationSearch } from "@/features/chat/components/ConversationSearch"
import { ConversationList } from "@/features/chat/components/ConversationList"
import { ShareDialog } from "@/features/chat/components/ShareDialog"
import { Button } from "@/shared/components/ui/Button"
import { Avatar } from "@/shared/components/ui/Avatar"
import { BrandLogo } from "@/shared/components/ui/Logo"
import { useTheme } from "@/shared/hooks/useTheme"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"
import type { Conversation } from "@/features/chat/types/conversation.types"

export function MobileNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { mobileNavOpen, setMobileNavOpen } = useUiStore()
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [shareTarget, setShareTarget] = useState<Conversation | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const {
    conversations,
    searchQuery,
    setSearchQuery,
    createNewChat,
    renameChat,
    deleteChat,
    refresh,
  } = useConversations()

  const activeId = location.pathname.startsWith("/chat/")
    ? location.pathname.replace("/chat/", "")
    : null

  const isAdminRoute = location.pathname.startsWith("/admin")

  // Handle keyboard navigation and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileNavOpen(false)
      }
    }

    if (mobileNavOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      setTimeout(() => drawerRef.current?.focus(), 0)
    } else {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      previousActiveElement.current?.focus()
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [mobileNavOpen, setMobileNavOpen])

  const handleNavClick = () => {
    setMobileNavOpen(false)
  }

  if (!mobileNavOpen) return null

  const handleNewChat = async () => {
    const newConv = await createNewChat()
    setMobileNavOpen(false)
    navigate(ROUTES.CHAT_CONVERSATION(newConv.id))
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <>
      <div className="fixed inset-0 z-drawer lg:hidden select-none" role="dialog" aria-modal="true" aria-label="Navigation menu">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-bg-overlay transition-opacity duration-200"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div
          ref={drawerRef}
          tabIndex={-1}
          className={cn(
            "fixed top-0 bottom-0 left-0 w-[300px] max-w-[85vw] bg-bg-secondary border-r border-border-default shadow-xl flex flex-col justify-between transition-transform duration-200 ease-out z-10",
            "animate-in slide-in-from-left",
            "h-screen-dvh",
            // Fixed overlays ignore the body safe-area padding, so the drawer
            // reserves the top inset itself to stay clear of notches.
            "pt-[env(safe-area-inset-top)]"
          )}
        >
          {/* Header */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="h-14 px-4 flex items-center justify-between border-b border-border-default shrink-0">
              <BrandLogo
                size="sm"
                subtitle={isAdminRoute ? "Admin Console" : "Campus Assistant"}
                onClick={() => {
                  setMobileNavOpen(false)
                  navigate(ROUTES.CHAT)
                }}
              />
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-interactive-hover min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If inside Admin Area on Mobile, show admin nav tabs */}
            {isAdminRoute ? (
              <div className="p-3 border-b border-border-default space-y-1 shrink-0">
                <div className="text-[10px] uppercase font-bold tracking-wider text-text-muted px-2 mb-1">
                  Admin Navigation
                </div>
                <NavLink
                  to={ROUTES.ADMIN}
                  end
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                      isActive
                        ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                        : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                    )
                  }
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Overview</span>
                </NavLink>
                <NavLink
                  to={ROUTES.ADMIN_USERS}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                      isActive
                        ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                        : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                    )
                  }
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Users</span>
                </NavLink>
                <NavLink
                  to={ROUTES.ADMIN_STUDENTS}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                      isActive
                        ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                        : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                    )
                  }
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Students</span>
                </NavLink>
                <NavLink
                  to={ROUTES.ADMIN_DOCUMENTS}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                      isActive
                        ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                        : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                    )
                  }
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Documents</span>
                </NavLink>
                <NavLink
                  to={ROUTES.CHAT}
                  onClick={handleNavClick}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-brand-text hover:bg-brand-surface transition-colors min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  <span>Return to Student App</span>
                </NavLink>
              </div>
            ) : (
              <>
                {/* Main Nav Links */}
                <div className="p-3 border-b border-border-default space-y-1 shrink-0">
                  <NavLink
                    to={ROUTES.CHAT}
                    end
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                        isActive
                          ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                          : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                      )
                    }
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>Chat Assistant</span>
                  </NavLink>

                  <NavLink
                    to={ROUTES.SEARCH}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                        isActive
                          ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                          : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                      )
                    }
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Search Knowledge</span>
                  </NavLink>

                  <NavLink
                    to={ROUTES.STUDENTS}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                        isActive
                          ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                          : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                      )
                    }
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <span>Student Directory</span>
                  </NavLink>
                </div>

                {/* New Chat & In-Sidebar Chat Search */}
                <div className="p-3 border-b border-border-default space-y-2.5 shrink-0">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNewChat}
                    className="w-full justify-center gap-2 shadow-sm font-medium min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Chat</span>
                  </Button>

                  <ConversationSearch
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                </div>

                {/* Scrollable Conversation List */}
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
                    <div onClick={handleNavClick}>
                      <ConversationList
                        conversations={conversations}
                        activeId={activeId}
                        onRename={renameChat}
                        onDelete={deleteChat}
                        onOpenShare={(conv) => setShareTarget(conv)}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Navigation shortcuts (Settings, Admin) */}
            <div className="p-2.5 border-t border-border-default space-y-1 shrink-0">
              <NavLink
                to={ROUTES.SETTINGS}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                    isActive
                      ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                      : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                  )
                }
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Settings</span>
              </NavLink>

              {user?.role === "admin" && (
                <NavLink
                  to={ROUTES.ADMIN}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors select-none min-h-[44px]",
                      isActive
                        ? "bg-brand-surface text-brand-text font-semibold border border-brand-border"
                        : "text-text-secondary hover:text-brand-text hover:bg-brand-surface"
                    )
                  }
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Admin Console</span>
                </NavLink>
              )}
            </div>
          </div>

          {/* User Profile Bar at Bottom */}
          <div className="p-3 border-t border-border-default bg-bg-primary shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            {user ? (
              <div className="flex items-center justify-between gap-2">
                <div
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                  onClick={() => {
                    setMobileNavOpen(false)
                    navigate(ROUTES.PROFILE)
                  }}
                >
                  <Avatar src={user.avatarUrl} fallback={user.name} size="sm" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-text-primary truncate">{user.name}</div>
                    <div className="text-[10px] text-text-muted truncate capitalize">{user.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={cycleTheme}
                    className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Toggle visual theme"
                  >
                    {theme === "dark" ? (
                      <Moon className="w-4 h-4 text-brand" />
                    ) : theme === "light" ? (
                      <Sun className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      logout()
                      setMobileNavOpen(false)
                    }}
                    className="p-1.5 text-text-muted hover:text-status-error-text rounded hover:bg-interactive-hover min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <NavLink
                to={ROUTES.LOGIN}
                onClick={() => setMobileNavOpen(false)}
                className="block text-center py-2.5 text-xs font-medium text-brand-text bg-brand-surface border border-brand-border rounded-md hover:bg-brand-surface-strong min-h-[44px] flex items-center justify-center"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>

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