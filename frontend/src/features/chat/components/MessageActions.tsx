import { Copy, Check, RotateCw, Edit3 } from "lucide-react"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import { cn } from "@/shared/utils/cn"

export interface MessageActionsProps {
  content: string
  isUser: boolean
  onEdit?: () => void
  onRegenerate?: () => void
  className?: string
}

export function MessageActions({
  content,
  isUser,
  onEdit,
  onRegenerate,
  className,
}: MessageActionsProps) {
  const { copied, copy } = useCopyToClipboard(1500)
  const { success } = useToast()

  const handleCopy = async () => {
    const ok = await copy(content)
    if (ok) {
      success("Copied to clipboard")
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity select-none duration-100",
        className
      )}
    >
      <button
        onClick={handleCopy}
        className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
        aria-label={copied ? "Copied" : "Copy message"}
        title="Copy text"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-status-success-text" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>

      {isUser && onEdit && (
        <button
          onClick={onEdit}
          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
          aria-label="Edit message"
          title="Edit message"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      )}

      {!isUser && onRegenerate && (
        <button
          onClick={onRegenerate}
          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors"
          aria-label="Regenerate response"
          title="Regenerate response"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
