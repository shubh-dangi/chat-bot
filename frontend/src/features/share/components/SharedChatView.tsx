import { Link } from "react-router-dom"
import { GraduationCap, ArrowRight } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { MessageBubble } from "@/features/chat/components/MessageBubble"
import { ROUTES } from "@/shared/config/routes"
import type { Conversation } from "@/features/chat/types/conversation.types"
import type { Message } from "@/features/chat/types/message.types"

export function SharedChatView({
  conversation,
  messages,
}: {
  conversation: Conversation
  messages: Message[]
}) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-bg-primary text-text-primary select-none">
      {/* Top Read-Only Bar */}
      <header className="h-14 px-4 sm:px-8 border-b border-border-default bg-bg-secondary flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="College AI" className="w-6 h-6 rounded" />
          <span className="font-semibold text-sm tracking-tight text-text-primary">
            College AI
          </span>
          <span className="text-xs text-text-muted hidden sm:inline">• Shared Snapshot</span>
        </div>

        <Link to={ROUTES.CHAT}>
          <Button variant="primary" size="sm" className="gap-1.5 text-xs">
            <span>Open College AI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </header>

      {/* Shared Conversation Title & Meta */}
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="border-b border-border-default pb-4">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-bg-tertiary text-text-muted mb-2">
            <GraduationCap className="w-3 h-3" />
            <span>Campus Discussion</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tight">
            {conversation.title}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Shared snapshot generated on {new Date(conversation.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </main>

      {/* Read-Only Notice at Bottom */}
      <footer className="p-3 text-center border-t border-border-default bg-bg-secondary text-xs text-text-muted">
        This is a read-only shared conversation. Start your own session at{" "}
        <Link to={ROUTES.HOME} className="text-text-primary underline">
          College AI
        </Link>
        .
      </footer>
    </div>
  )
}
