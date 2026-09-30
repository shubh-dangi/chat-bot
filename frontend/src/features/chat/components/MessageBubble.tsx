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
 * Handles code fences (```lang ... ```), headings, bold/italic/strikethrough,
 * inline code, ordered and unordered lists, and paragraphs.
 */
const INLINE_PATTERN = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(__[^_\n]+__)|(~~[^~\n]+~~)/g
const HEADING_PATTERN = /^(#{1,4})\s+(.*)$/
const BULLET_PATTERN = /^[-*+]\s+(.*)$/
const ORDERED_PATTERN = /^\d+[.)]\s+(.*)$/

/** Renders inline spans (code, bold, strikethrough) inside an already-parsed block. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  INLINE_PATTERN.lastIndex = 0
  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    const token = match[0]
    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-c${nodes.length}`}
          className="font-mono text-[0.9em] px-1 py-0.5 rounded bg-bg-tertiary text-text-primary break-all"
        >
          {token.slice(1, -1)}
        </code>
      )
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(
        <strong key={`${keyPrefix}-b${nodes.length}`} className="font-semibold text-text-primary">
          {token.slice(2, -2)}
        </strong>
      )
    } else {
      nodes.push(
        <del key={`${keyPrefix}-s${nodes.length}`} className="text-text-muted">
          {token.slice(2, -2)}
        </del>
      )
    }

    lastIndex = INLINE_PATTERN.lastIndex
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

/** Splits one blank-line-delimited chunk into headings, lists and paragraphs. */
function renderBlocks(block: string, keyPrefix: string): React.ReactNode[] {
  const lines = block.split("\n")
  const out: React.ReactNode[] = []
  const textBuffer: string[] = []
  let i = 0

  const flushText = () => {
    if (textBuffer.length === 0) return
    const joined = textBuffer.join("\n")
    textBuffer.length = 0
    out.push(
      <p key={`${keyPrefix}-p${out.length}`} className="leading-relaxed whitespace-pre-wrap">
        {renderInline(joined, `${keyPrefix}-p${out.length}`)}
      </p>
    )
  }

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }

    const heading = line.match(HEADING_PATTERN)
    if (heading) {
      flushText()
      const level = heading[1].length
      const inner = heading[2]
      const key = `${keyPrefix}-h${out.length}`

      if (level <= 2) {
        out.push(
          <h3 key={key} className="text-base font-semibold text-text-primary mt-3 mb-1 text-balance break-words">
            {renderInline(inner, key)}
          </h3>
        )
      } else if (level === 3) {
        out.push(
          <h4 key={key} className="text-sm font-semibold text-text-primary mt-3 mb-1 text-balance break-words">
            {renderInline(inner, key)}
          </h4>
        )
      } else {
        out.push(
          <h5 key={key} className="text-xs font-semibold uppercase tracking-wider text-text-secondary mt-2 mb-1 break-words">
            {renderInline(inner, key)}
          </h5>
        )
      }
      i++
      continue
    }

    const isBullet = BULLET_PATTERN.test(line)
    const isOrdered = !isBullet && ORDERED_PATTERN.test(line)
    if (isBullet || isOrdered) {
      flushText()
      const pattern = isBullet ? BULLET_PATTERN : ORDERED_PATTERN
      const items: string[] = []

      while (i < lines.length) {
        const m = lines[i].match(pattern)
        if (!m) break
        items.push(m[1])
        i++
      }

      const key = `${keyPrefix}-l${out.length}`
      const items_ = items.map((item, idx) => (
        <li key={idx} className="leading-relaxed marker:text-text-muted">
          {renderInline(item, `${key}-${idx}`)}
        </li>
      ))

      out.push(
        isOrdered ? (
          <ol key={key} className="space-y-1.5 ps-5 list-decimal">
            {items_}
          </ol>
        ) : (
          <ul key={key} className="space-y-1.5 ps-5 list-disc">
            {items_}
          </ul>
        )
      )
      continue
    }

    textBuffer.push(line)
    i++
  }

  flushText()
  return out
}

function FormattedMessageContent({ content }: { content: string }) {
  // Normalise CRLF so the code-fence and list parsers behave the same on Windows-authored content.
  const parts = content.replace(/\r\n/g, "\n").split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-2.5 text-sm leading-relaxed select-text break-words overflow-wrap-anywhere">
      {parts.map((part, idx) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/^```([\w+#.-]*)\n?([\s\S]*?)```$/)
          const language = (match?.[1] || "text").toLowerCase()
          const codeBody = (match?.[2] ?? part.slice(3, -3)).replace(/\n$/, "")

          return <CodeBlock key={idx} language={language} code={codeBody} />
        }

        return <div key={idx} className="space-y-2">{renderBlocks(part, `b${idx}`)}</div>
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
                  ? "bg-bg-tertiary text-text-primary rounded-2xl rounded-br-none border border-border-subtle font-normal select-text shadow-xs"
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