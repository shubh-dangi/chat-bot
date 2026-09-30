import React, { useState, useRef, useEffect } from "react"
import { ArrowUp, Square, Paperclip, Sparkles } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Tooltip } from "@/shared/components/ui/Tooltip"
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`
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
    if (!text.trim() || disabled || isGenerating) return
    onSend(text.trim())
    setText("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const hasText = text.trim().length > 0

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 sm:pb-6 select-none">
      <div className="relative rounded-2xl bg-bg-elevated border border-border-default shadow-xs hover:border-border-strong focus-within:border-border-focus focus-within:ring-2 focus-within:ring-interactive-ring focus-within:shadow-sm transition-all duration-normal overflow-hidden">
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
            "w-full resize-none bg-transparent pt-3.5 pb-12 pl-4 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none max-h-[180px] leading-relaxed",
            disabled && "cursor-not-allowed opacity-60"
          )}
        />

        {/* Bottom Toolbar inside Composer */}
        <div className="absolute left-3 bottom-2.5 flex items-center gap-1.5">
          <Tooltip content="Attach academic document or syllabus reference">
            <button
              type="button"
              disabled={disabled}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-interactive-hover transition-colors disabled:opacity-40"
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
        <div className="absolute right-3 bottom-2.5 flex items-center">
          {isGenerating ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={onStop}
              aria-label="Stop generation"
              className="w-8 h-8 rounded-xl bg-bg-secondary text-text-primary border border-border-default shadow-xs hover:bg-interactive-hover active:scale-95"
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
                "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-fast select-none cursor-pointer",
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
      <div className="flex items-center justify-between text-[11px] text-text-muted mt-2 px-1">
        <div className="flex items-center gap-2">
          <span>
            Use <kbd className="font-mono px-1 py-0.5 rounded bg-bg-secondary border border-border-subtle text-[10px]">Enter</kbd> to send, <kbd className="font-mono px-1 py-0.5 rounded bg-bg-secondary border border-border-subtle text-[10px]">Shift + Enter</kbd> for line breaks
          </span>
        </div>
        <div className="flex items-center gap-2">
          {text.length > 0 && (
            <span className="font-mono text-[10px]">{text.length} chars</span>
          )}
          <span className="hidden sm:inline">College AI v2.4 • Production</span>
        </div>
      </div>
    </div>
  )
}
