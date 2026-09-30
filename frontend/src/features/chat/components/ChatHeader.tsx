import { useState } from "react"
import { Share2, MoreVertical, Edit2, Trash2, Check, X, Menu, Search } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu"
import { Dialog } from "@/shared/components/ui/Dialog"
import { NavbarUserMenu } from "@/shared/components/layout/NavbarUserMenu"
import { UniversalSearchBar } from "@/shared/components/layout/UniversalSearchBar"
import { useUiStore } from "@/stores/uiStore"
import type { Conversation } from "../types/conversation.types"

export interface ChatHeaderProps {
  conversation: Conversation | null
  onRename?: (id: string, newTitle: string) => Promise<unknown>
  onDelete?: (id: string) => Promise<unknown>
  onOpenShare?: () => void
  onToggleSidebar?: () => void
}

export function ChatHeader({
  conversation,
  onRename,
  onDelete,
  onOpenShare,
  onToggleSidebar,
}: ChatHeaderProps) {
  const { toggleMobileNav, toggleSidebar } = useUiStore()
  const [isEditing, setIsEditing] = useState(false)
  const [titleInput, setTitleInput] = useState(conversation?.title || "")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const handleSaveRename = async () => {
    if (conversation && titleInput.trim() && titleInput !== conversation.title) {
      await onRename?.(conversation.id, titleInput.trim())
    }
    setIsEditing(false)
  }

  const handleDeleteConfirm = async () => {
    if (!conversation) return
    setIsDeleting(true)
    try {
      await onDelete?.(conversation.id)
      setShowDeleteModal(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const moreItems = [
    {
      label: "Rename title",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => {
        setTitleInput(conversation?.title || "")
        setIsEditing(true)
      },
    },
    { separator: true, label: "" },
    {
      label: "Delete conversation",
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: () => setShowDeleteModal(true),
    },
  ]

  return (
    <>
      <header className="h-14 px-3 sm:px-4 shrink-0 bg-bg-primary border-b border-border-default flex items-center justify-between gap-2 sm:gap-4 select-none relative z-sticky">
        {/* Mobile Search Overlay */}
        {mobileSearchOpen ? (
          <div className="flex items-center gap-2 w-full animate-page-enter">
            <div className="flex-1">
              <UniversalSearchBar className="w-full max-w-full" placeholder="Search chats..." />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearchOpen(false)}
              className="w-9 h-9 text-text-muted hover:text-text-primary"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Left: Mobile Nav Toggle + Title */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <button
                onClick={onToggleSidebar || toggleMobileNav}
                className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-interactive-hover lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
                aria-label="Toggle chat sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              {isEditing && conversation ? (
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveRename()
                      if (e.key === "Escape") setIsEditing(false)
                    }}
                    className="h-8 px-2 text-sm font-semibold rounded bg-bg-tertiary border border-border-focus text-text-primary focus:outline-none flex-1 min-w-0 truncate"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveRename}
                    className="p-1 rounded text-text-muted hover:text-text-primary min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
                    aria-label="Confirm rename"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-1 rounded text-text-muted hover:text-text-primary min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
                    aria-label="Cancel rename"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="text-xs sm:text-sm font-semibold text-text-primary truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px] cursor-pointer hover:text-text-secondary transition-colors"
                  onClick={() => {
                    if (conversation) {
                      setTitleInput(conversation.title)
                      setIsEditing(true)
                    }
                  }}
                  title="Click to rename"
                >
                  {conversation ? conversation.title : "College AI Assistant"}
                </div>
              )}
            </div>

            {/* Middle: Universal Search Bar in Navbar */}
            <div className="flex-1 flex justify-center px-1 sm:px-2 min-w-0 max-w-xs sm:max-w-sm md:max-w-md hidden sm:flex">
              <UniversalSearchBar placeholder="Search your chats..." />
            </div>

            {/* Right: Actions + User Profile */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
              {/* Mobile Search Icon Trigger */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors sm:hidden min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Open search"
              >
                <Search className="w-4 h-4" />
              </button>

              {conversation && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onOpenShare}
                    className="text-xs h-8 gap-1.5 px-2.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Share</span>
                  </Button>

                  <DropdownMenu
                    align="right"
                    trigger={
                      <button
                        className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
                        aria-label="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    }
                    items={moreItems}
                  />
                </>
              )}

              {/* User Account Profile Menu */}
              <NavbarUserMenu />
            </div>
          </>
        )}
      </header>

      {/* Delete Dialog */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Conversation"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Are you sure you want to delete this conversation? This action cannot be reversed.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)} className="min-h-[40px]">
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
              className="min-h-[40px]"
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}