import React, { useState } from "react"
import { Copy, Check, RotateCw, Edit3, Loader2 } from "lucide-react"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import { cn } from "@/shared/utils/cn"

export interface MessageActionsProps {
  content: string
  isUser: boolean
  onEdit?: () => void
  onRegenerate?: () => void
  isRegenerating?: boolean
  className?: string
}

export function MessageActions({
  content,
  isUser,
  onEdit,
  onRegenerate,
  isRegenerating = false,
  className,
}: MessageActionsProps) {
  const { copied, copy } = useCopyToClipboard(1800)
  const { success } = useToast()
  const [isTriggeringRegen, setIsTriggeringRegen] = useState(false)

  const handleCopy = async () => {
    const ok = await copy(content)
    if (ok) {
      success("Copied to clipboard")
    }
  }

  const handleRegenerate = async () => {
    if (isRegenerating || isTriggeringRegen || !onRegenerate) return
    setIsTriggeringRegen(true)
    try {
      await onRegenerate()
    } finally {
      setTimeout(() => setIsTriggeringRegen(false), 500)
    }
  }

  const isBusy = isRegenerating || isTriggeringRegen

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-fast select-none",
        className
      )}
    >
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-fast min-h-[28px]",
          copied
            ? "text-status-success-text bg-status-success-surface border border-status-success-border"
            : "text-text-muted hover:text-text-primary hover:bg-interactive-hover"
        )}
        aria-label={copied ? "Copied to clipboard" : "Copy message"}
        title="Copy text"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-status-success-text animate-in zoom-in-75 duration-fast" />
            <span className="text-[11px] font-medium text-status-success-text">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Copy</span>
          </>
        )}
      </button>

      {isUser && onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors min-h-[28px]"
          aria-label="Edit message"
          title="Edit message"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">Edit</span>
        </button>
      )}

      {!isUser && onRegenerate && (
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isBusy}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors min-h-[28px]",
            isBusy
              ? "opacity-60 cursor-not-allowed text-text-muted"
              : "text-text-muted hover:text-text-primary hover:bg-interactive-hover"
          )}
          aria-label="Regenerate response"
          title="Regenerate response"
        >
          {isBusy ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-[11px] hidden sm:inline">Regenerating...</span>
            </>
          ) : (
            <>
              <RotateCw className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Regenerate</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
