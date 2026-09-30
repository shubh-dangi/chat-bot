import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { MessageBubble } from "./MessageBubble"
import { EmptyChat } from "./EmptyChat"
import { Button } from "@/shared/components/ui/Button"
import type { Message } from "../types/message.types"

export interface MessageAreaProps {
  messages: Message[]
  isGenerating?: boolean
  onEditMessage?: (id: string, newContent: string) => Promise<unknown>
  onRegenerateResponse?: () => void
  onSelectPrompt?: (prompt: string) => void
}

export function MessageArea({
  messages,
  isGenerating,
  onEditMessage,
  onRegenerateResponse,
  onSelectPrompt,
}: MessageAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom("smooth")
    }
  }, [messages, isGenerating, showScrollBottom])

  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    setShowScrollBottom(!isNearBottom)
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col justify-center overflow-y-auto">
        <EmptyChat onSelectPrompt={onSelectPrompt || (() => {})} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="relative flex-1 overflow-y-auto px-3 sm:px-6 py-6"
    >
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onEdit={
              onEditMessage
                ? (newText) => onEditMessage(message.id, newText)
                : undefined
            }
            onRegenerate={onRegenerateResponse}
          />
        ))}

        <div ref={bottomRef} className="h-4" />
      </div>

      {showScrollBottom && (
        <div className="sticky bottom-4 flex justify-center pointer-events-none">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => scrollToBottom("smooth")}
            className="pointer-events-auto gap-1.5 shadow-md bg-bg-elevated border border-border-default rounded-full text-xs py-1.5 px-3"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>New messages below</span>
          </Button>
        </div>
      )}
    </div>
  )
}
