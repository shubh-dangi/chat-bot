import React, { useState } from "react"
import { Copy, Check, Share2, AlertTriangle } from "lucide-react"
import { Dialog } from "@/shared/components/ui/Dialog"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import { chatService } from "../services/chatService"
import type { Conversation } from "../types/conversation.types"

export interface ShareDialogProps {
  open: boolean
  onClose: () => void
  conversation: Conversation | null
  onConversationUpdated?: (updated: Conversation) => void
}

export function ShareDialog({
  open,
  onClose,
  conversation,
  onConversationUpdated,
}: ShareDialogProps) {
  const { copied, copy } = useCopyToClipboard(2000)
  const { success, error } = useToast()
  const [loading, setLoading] = useState(false)
  const [revoking, setRevoking] = useState(false)
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false)

  if (!conversation) return null

  const shareUrl = conversation.shareToken
    ? `${window.location.origin}/shared/${conversation.shareToken}`
    : ""

  const handleCreateLink = async () => {
    setLoading(true)
    try {
      const token = await chatService.createShareLink(conversation.id)
      const updated = { ...conversation, isShared: true, shareToken: token }
      onConversationUpdated?.(updated)
      success("Share link created")
    } catch {
      error("Failed to generate share link")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!shareUrl) return
    const ok = await copy(shareUrl)
    if (ok) {
      success("Link copied to clipboard")
    }
  }

  const handleRevoke = async () => {
    setRevoking(true)
    try {
      await chatService.revokeShareLink(conversation.id)
      const updated = { ...conversation, isShared: false, shareToken: undefined }
      onConversationUpdated?.(updated)
      setShowRevokeConfirm(false)
      success("Share link revoked")
    } catch {
      error("Failed to revoke link")
    } finally {
      setRevoking(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Share Conversation"
      description="Anyone with this unique link can view a read-only snapshot of this chat."
    >
      <div className="space-y-4 pt-1">
        {conversation.isShared && shareUrl ? (
          <>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="font-mono text-xs select-all bg-bg-tertiary"
              />
              <Button variant="primary" size="md" onClick={handleCopy} className="shrink-0 gap-1.5">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>

            {showRevokeConfirm ? (
              <div className="p-3 rounded-lg border border-status-warning-border bg-status-warning-surface text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-medium text-status-warning-text">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Revoke this link?</span>
                </div>
                <p className="text-text-secondary">
                  Anyone who has this link will immediately lose access to this conversation.
                </p>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setShowRevokeConfirm(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleRevoke}
                    isLoading={revoking}
                  >
                    Confirm Revoke
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-border-default">
                <span className="text-xs text-text-muted">Public link active</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRevokeConfirm(true)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800 text-xs"
                >
                  Revoke link
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-2 text-center space-y-3">
            <p className="text-xs text-text-secondary">
              A private shareable link has not been created for this conversation yet.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateLink}
              isLoading={loading}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Create Share Link</span>
            </Button>
          </div>
        )}
      </div>
    </Dialog>
  )
}
