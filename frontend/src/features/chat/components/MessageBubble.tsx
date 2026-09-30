import React, { useState } from "react"
import { GraduationCap, Copy, Check } from "lucide-react"
import { MessageActions } from "./MessageActions"
import { StreamingCursor } from "./StreamingCursor"
import { Button } from "@/shared/components/ui/Button"
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard"
import { cn } from "@/shared/utils/cn"
import type { Message } from "../types/message.types"

export interface MessageBubbleProps {
  message: Message
  onEdit?: (newContent: string) => Promise<unknown>
  onRegenerate?: () => void
}

/**
 * Lightweight pure Markdown-style renderer for assistant responses:
 * Handles code fences (```lang ... ```), bold, lists, and headings cleanly without giant external packages.
 */
function FormattedMessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/^```(\w+)?\n([\s\S]*?)```$/)
          const language = match ? match[1] || "code" : "code"
          const codeBody = match ? match[2].trimEnd() : part.slice(3, -3)

          return <CodeBlock key={idx} language={language} code={codeBody} />
        }

        // Standard text blocks with paragraphs, bullet lists, bold and inline code
        return (
          <div key={idx} className="space-y-1.5 whitespace-pre-wrap">
            {part.split("\n\n").map((paragraph, pIdx) => {
              if (paragraph.startsWith("### ")) {
                return (
                  <h4 key={pIdx} className="font-semibold text-text-primary text-sm mt-2 mb-1">
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
  const { copied, copy } = useCopyToClipboard(1500)

  return (
    <div className="my-2.5 rounded-lg border border-border-default overflow-hidden bg-bg-tertiary select-text">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border-default bg-bg-secondary text-[11px] font-mono text-text-muted">
        <span>{language}</span>
        <button
          onClick={() => copy(code)}
          className="flex items-center gap-1 hover:text-text-primary transition-colors"
          aria-label="Copy code block"
        >
          {copied ? <Check className="w-3 h-3 text-status-success-text" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-3 text-xs font-mono overflow-x-auto text-text-primary bg-bg-primary/50">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function MessageBubble({ message, onEdit, onRegenerate }: MessageBubbleProps) {
  const isUser = message.sender === "user"
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
        "group flex w-full gap-3 py-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-bg-secondary border border-border-default flex items-center justify-center text-text-primary shrink-0 mt-0.5">
          <GraduationCap className="w-4 h-4" />
        </div>
      )}

      {/* Bubble Container */}
      <div className={cn("flex flex-col max-w-[85%] sm:max-w-[78%]", isUser ? "items-end" : "items-start")}>
        {isEditing ? (
          <div className="w-full min-w-[280px] sm:min-w-[400px] p-3 rounded-lg border border-border-focus bg-bg-elevated space-y-2 shadow-sm">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-xs sm:text-sm bg-transparent text-text-primary resize-none focus:outline-none min-h-[70px]"
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
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveEdit}
                isLoading={isSaving}
              >
                Save & Resend
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "p-3.5 text-sm transition-colors",
                isUser
                  ? "bg-neutral-800 text-neutral-50 dark:bg-neutral-800 dark:text-neutral-50 rounded-2xl rounded-br-none shadow-xs"
                  : "bg-bg-secondary text-text-primary border border-border-default rounded-2xl rounded-bl-none shadow-xs"
              )}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
              ) : (
                <>
                  <FormattedMessageContent content={message.content} />
                  {message.status === "streaming" && <StreamingCursor />}
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

              {message.status !== "streaming" && (
                <MessageActions
                  content={message.content}
                  isUser={isUser}
                  onEdit={() => setIsEditing(true)}
                  onRegenerate={onRegenerate}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
