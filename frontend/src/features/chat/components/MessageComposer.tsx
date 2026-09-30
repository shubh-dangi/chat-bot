import React, { useState, useRef, useEffect } from "react"
import { ArrowUp, Square, Paperclip, Sparkles, Check } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Tooltip } from "@/shared/components/ui/Tooltip"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import { cn } from "@/shared/utils/cn"

export interface MessageComposerProps {
  onSend: (content: string) => void
  disabled?: boolean
  isGenerating?: boolean
  onStop?: () => void
  placeholder?: string
  initialValue?: string
}

export function MessageComposer({
  onSend,
  disabled = false,
  isGenerating = false,
  onStop,
  placeholder = "Message College AI... (Ask about syllabus, regulations, or student records)",
  initialValue = "",
}: MessageComposerProps) {
  const [text, setText] = useState(initialValue)
  const [attachedFile, setAttachedFile] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error } = useToast()

  const adjustHeight = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }

  useEffect(() => {
    if (initialValue) {
      setText(initialValue)
      adjustHeight()
    }
  }, [initialValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled || isGenerating) return
    const finalContent = attachedFile ? `[Attached: ${attachedFile}]\n\n${trimmed}` : trimmed
    onSend(finalContent)
    setText("")
    setAttachedFile(null)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      error("File exceeds maximum allowed size (10 MB)")
      return
    }

    setAttachedFile(file.name)
    success(`Document "${file.name}" attached for inquiry context`)
    // Reset file input so same file can be re-selected if desired
    e.target.value = ""
  }

  const hasText = text.trim().length > 0 || Boolean(attachedFile)

  return (
    <div className="w-full max-w-3xl mx-auto px-2.5 sm:px-4 pb-2.5 sm:pb-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] select-none shrink-0">
      <div className="relative rounded-2xl bg-bg-elevated border border-border-default shadow-xs hover:border-border-strong focus-within:border-border-focus focus-within:ring-2 focus-within:ring-interactive-ring focus-within:shadow-sm transition-all duration-normal overflow-hidden">
        {/* Hidden File Input for Paperclip */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.doc,.txt,.csv"
          className="hidden"
          aria-hidden="true"
        />

        {/* Attachment Pill if attached */}
        {attachedFile && (
          <div className="mx-3.5 mt-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-surface border border-brand-border text-xs text-brand-text max-w-fit">
            <Check className="w-3.5 h-3.5 text-status-success-text shrink-0" />
            <span className="truncate max-w-[200px] font-mono text-[11px]">{attachedFile}</span>
            <button
              type="button"
              onClick={() => setAttachedFile(null)}
              className="ml-1 text-text-muted hover:text-text-primary text-[11px] px-1 hover:bg-interactive-hover rounded"
              title="Remove attachment"
            >
              ×
            </button>
          </div>
        )}

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={disabled}
          onChange={(e) => {
            setText(e.target.value)
            adjustHeight()
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full resize-none bg-transparent pt-3 pb-11 pl-3.5 pr-11 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none max-h-[160px] leading-relaxed",
            disabled && "cursor-not-allowed opacity-60"
          )}
        />

        {/* Bottom Toolbar inside Composer */}
        <div className="absolute left-2.5 bottom-2 flex items-center gap-1.5">
          <Tooltip content="Attach academic document or syllabus reference (PDF, DOCX, TXT)">
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors disabled:opacity-40 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Attach document"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </Tooltip>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-bg-secondary border border-border-subtle">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <span>Campus AI Grounded</span>
          </span>
        </div>

        {/* Send / Stop Action Button */}
        <div className="absolute right-2.5 bottom-2 flex items-center">
          {isGenerating ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={onStop}
              aria-label="Stop generation"
              className="w-8 h-8 rounded-xl bg-bg-secondary text-text-primary border border-border-default shadow-xs hover:bg-interactive-hover active:scale-95 min-w-[44px] min-h-[44px]"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </Button>
          ) : (
            <button
              type="button"
              disabled={!hasText || disabled}
              onClick={handleSend}
              aria-label="Send message"
              className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-fast select-none cursor-pointer min-w-[44px] min-h-[44px]",
                hasText && !disabled
                  ? "bg-brand text-brand-contrast shadow-sm hover:bg-brand-hover active:scale-95 translate-y-0"
                  : "bg-bg-tertiary text-text-disabled cursor-not-allowed opacity-50"
              )}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Helper Footer */}
      <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Use <kbd className="font-mono px-1 py-0.5 rounded bg-bg-secondary border border-border-subtle text-[10px]">Enter</kbd> to send, <kbd className="font-mono px-1 py-0.5 rounded bg-bg-secondary border border-border-subtle text-[10px]">Shift + Enter</kbd> for line breaks
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {text.length > 0 && (
            <span className="font-mono text-[10px]">{text.length} chars</span>
          )}
          <span className="hidden xs:inline">College AI v2.4 • Grounded</span>
        </div>
      </div>
    </div>
  )
}