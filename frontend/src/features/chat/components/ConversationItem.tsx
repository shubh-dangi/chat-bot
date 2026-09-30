import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MoreHorizontal, Edit2, Share2, Trash2, Check, X, AlertTriangle } from "lucide-react"
import { DropdownMenu } from "@/shared/components/ui/DropdownMenu"
import { Dialog } from "@/shared/components/ui/Dialog"
import { Button } from "@/shared/components/ui/Button"
import { ROUTES } from "@/shared/config/routes"
import { cn } from "@/shared/utils/cn"
import type { Conversation } from "../types/conversation.types"

export interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onRename: (id: string, newTitle: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
  onOpenShare: (conv: Conversation) => void
}

export function ConversationItem({
  conversation,
  isActive,
  onRename,
  onDelete,
  onOpenShare,
}: ConversationItemProps) {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [titleInput, setTitleInput] = useState(conversation.title)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const handleSaveRename = async () => {
    if (titleInput.trim() && titleInput !== conversation.title) {
      await onRename(conversation.id, titleInput.trim())
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveRename()
    if (e.key === "Escape") {
      setTitleInput(conversation.title)
      setIsEditing(false)
    }
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete(conversation.id)
      setShowDeleteModal(false)
      navigate(ROUTES.CHAT)
    } finally {
      setIsDeleting(false)
    }
  }

  const menuItems = [
    {
      label: "Rename",
      icon: <Edit2 className="w-3.5 h-3.5" />,
      onClick: () => setIsEditing(true),
    },
    {
      label: "Share link",
      icon: <Share2 className="w-3.5 h-3.5" />,
      onClick: () => onOpenShare(conversation),
    },
    { separator: true, label: "" },
    {
      label: "Delete",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      danger: true,
      onClick: () => setShowDeleteModal(true),
    },
  ]

  if (isEditing) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-bg-elevated rounded-lg border border-border-focus shadow-xs animate-page-enter">
        <input
          ref={inputRef}
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveRename}
          className="flex-1 min-w-0 bg-transparent text-xs text-text-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSaveRename}
          className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-interactive-hover"
          aria-label="Save title"
        >
          <Check className="w-3.5 h-3.5 text-status-success-text" />
        </button>
        <button
          type="button"
          onClick={() => {
            setTitleInput(conversation.title)
            setIsEditing(false)
          }}
          className="p-1 text-text-muted hover:text-text-primary rounded hover:bg-interactive-hover"
          aria-label="Cancel editing"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <>
      <div
        onClick={() => navigate(ROUTES.CHAT_CONVERSATION(conversation.id))}
        className={cn(
          "group relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all duration-fast cursor-pointer select-none",
          isActive
            ? "bg-interactive-selected text-text-primary font-medium shadow-xs"
            : "text-text-secondary hover:text-text-primary hover:bg-interactive-hover"
        )}
      >
        {/* Left active marker */}
        {isActive && (
          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-text-primary" />
        )}

        <div className="min-w-0 flex-1 pr-2">
          <div className="truncate font-medium leading-snug">{conversation.title}</div>
          {conversation.lastMessagePreview && (
            <div className="text-[11px] text-text-muted truncate mt-0.5 opacity-80">
              {conversation.lastMessagePreview}
            </div>
          )}
        </div>

        <div
          className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-fast shrink-0 flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu
            align="right"
            trigger={
              <button
                type="button"
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
                aria-label="Conversation options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            }
            items={menuItems}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Conversation"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-status-error-surface border border-status-error-border flex items-center justify-center text-status-error-text shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-text-primary">&quot;{conversation.title}&quot;</span>? This will permanently remove the message history.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
            >
              Delete Conversation
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}
