import React, { useState, useRef, useEffect } from "react"
import { ArrowUp, Square } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
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
  placeholder = "Ask anything about courses, exams, policies, or student details...",
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

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 sm:pb-6 select-none">
      <div className="relative rounded-2xl bg-bg-elevated border border-border-default shadow-sm transition-all focus-within:border-border-focus focus-within:ring-1 focus-within:ring-border-focus overflow-hidden">
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
            "w-full resize-none bg-transparent py-3.5 pl-4 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none max-h-[180px] leading-relaxed",
            disabled && "cursor-not-allowed opacity-60"
          )}
        />

        <div className="absolute right-2.5 bottom-2.5 flex items-center">
          {isGenerating ? (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={onStop}
              aria-label="Stop response generation"
              className="w-8 h-8 rounded-xl bg-bg-secondary text-text-primary border border-border-default"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="button"
              size="icon"
              variant="primary"
              disabled={!text.trim() || disabled}
              onClick={handleSend}
              aria-label="Send message"
              className={cn(
                "w-8 h-8 rounded-xl transition-all duration-100",
                text.trim()
                  ? "opacity-100 scale-100"
                  : "opacity-40 pointer-events-none scale-95"
              )}
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-text-muted mt-2 px-1">
        <span>Press <kbd className="font-mono px-1 py-0.5 rounded bg-bg-tertiary border border-border-subtle">Enter</kbd> to send, <kbd className="font-mono px-1 py-0.5 rounded bg-bg-tertiary border border-border-subtle">Shift + Enter</kbd> for new line</span>
        <span>College AI Model v1</span>
      </div>
    </div>
  )
}
