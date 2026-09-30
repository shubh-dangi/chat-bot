import React, { useState } from "react"
import { GraduationCap, Copy, Check } from "lucide-react"
import { MessageActions } from "./MessageActions"
import { StreamingCursor } from "./StreamingCursor"
import { TypingIndicator } from "@/shared/components/motion/TypingIndicator"
import { Button } from "@/shared/components/ui/Button"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"
import { cn } from "@/shared/utils/cn"
import type { Message } from "../types/message.types"

export interface MessageBubbleProps {
  message: Message
  onEdit?: (newContent: string) => Promise<unknown>
  onRegenerate?: () => void
  isGenerating?: boolean
}

/**
 * Lightweight pure Markdown renderer:
 * Handles code fences (```lang ... ```), bold, lists, and headings cleanly.
 */
function FormattedMessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-2.5 text-sm leading-relaxed select-text">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/^```(\w+)?\n([\s\S]*?)```$/)
          const language = match ? match[1] || "text" : "text"
          const codeBody = match ? match[2].trimEnd() : part.slice(3, -3)

          return <CodeBlock key={idx} language={language} code={codeBody} />
        }

        // Standard text blocks with paragraphs, bullet lists, bold and inline code
        return (
          <div key={idx} className="space-y-2 whitespace-pre-wrap">
            {part.split("\n\n").map((paragraph, pIdx) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h4 key={pIdx} className="font-semibold text-text-primary text-sm mt-3 mb-1">
                    {paragraph.replace("### ", "")}
                  </h4>
                )
              }
              if (paragraph.startsWith("#### ")) {
                return (
                  <h5 key={pIdx} className="font-medium text-text-primary text-xs uppercase tracking-wider mt-2 mb-1">
                    {paragraph.replace("#### ", "")}
                  </h5>
                )
              }
              return (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const { copied, copy } = useCopyToClipboard(1800)

  return (
    <div className="my-3 rounded-lg border border-border-default overflow-hidden bg-bg-secondary select-text">
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border-default bg-bg-tertiary text-[11px] font-mono text-text-muted">
        <span className="uppercase tracking-wider font-semibold text-[10px]">{language}</span>
        <button
          type="button"
          onClick={() => copy(code)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-text-secondary hover:text-text-primary hover:bg-interactive-hover transition-colors min-h-[44px]"
          aria-label="Copy code block"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-status-success-text" />
              <span className="text-[11px] text-status-success-text font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 text-xs font-mono overflow-x-auto text-text-primary bg-bg-primary/70">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function MessageBubble({
  message,
  onEdit,
  onRegenerate,
  isGenerating = false,
}: MessageBubbleProps) {
  const isUser = message.sender === "user"
  const isThinking = message.status === "thinking"
  const isStreaming = message.status === "streaming"

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(message.content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveEdit = async () => {
    if (!editText.trim()) return
    setIsSaving(true)
    try {
      await onEdit?.(editText.trim())
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className={cn(
        "group flex w-full gap-3 py-2 animate-message-enter select-none",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-text shrink-0 mt-0.5 shadow-xs flex-shrink-0">
          <GraduationCap className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={cn("flex flex-col max-w-[94%] sm:max-w-[82%] lg:max-w-[75%]", isUser ? "items-end" : "items-start")}>
        {isEditing ? (
          <div className="w-full min-w-0 sm:min-w-[300px] max-w-full p-3 sm:p-3.5 rounded-xl border border-brand-border bg-bg-elevated space-y-3 shadow-md animate-page-enter">
            <div className="text-xs font-semibold text-text-secondary">Edit Message</div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-xs sm:text-sm bg-bg-primary p-2.5 rounded-lg border border-border-default text-text-primary resize-none focus:outline-none focus:border-brand min-h-[80px]"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-border-default">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditText(message.content)
                  setIsEditing(false)
                }}
                className="min-h-[40px]"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEdit}
                isLoading={isSaving}
                className="min-h-[40px]"
              >
                Save & Resend
              </Button>
            </div>
          </div>
        ) : isThinking ? (
          <div className="py-1">
            <TypingIndicator label="Analyzing request" />
          </div>
        ) : (
          <>
            <div
              className={cn(
                "p-3 sm:p-4 text-sm leading-relaxed transition-all shadow-xs",
                isUser
                  ? "bg-brand text-brand-contrast rounded-2xl rounded-br-none border border-transparent font-normal select-text shadow-sm"
                  : "bg-bg-elevated text-text-primary border border-border-default rounded-2xl rounded-bl-none"
              )}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              ) : (
                <>
                  <FormattedMessageContent content={message.content} />
                  {isStreaming && <StreamingCursor />}
                </>
              )}
            </div>

            {/* Message Meta & Action Bar */}
            <div
              className={cn(
                "flex items-center gap-2 mt-1 px-1 text-[11px] text-text-muted select-none",
                isUser ? "flex-row-reverse" : "flex-row"
              )}
            >
              <span>{message.timestamp}</span>

              {!isStreaming && !isThinking && (
                <MessageActions
                  content={message.content}
                  isUser={isUser}
                  onEdit={() => setIsEditing(true)}
                  onRegenerate={onRegenerate}
                  isRegenerating={isGenerating}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}