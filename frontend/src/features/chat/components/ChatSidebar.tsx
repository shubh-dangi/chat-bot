import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, MessageSquare } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { ConversationSearch } from "./ConversationSearch"
import { ConversationList } from "./ConversationList"
import { ShareDialog } from "./ShareDialog"
import { useConversations } from "../hooks/useConversations"
import { ROUTES } from "@/shared/config/routes"
import type { Conversation } from "../types/conversation.types"

export function ChatSidebar({
  activeId,
  className,
}: {
  activeId: string | null
  className?: string
}) {
  const navigate = useNavigate()
  const {
    conversations,
    searchQuery,
    setSearchQuery,
    createNewChat,
    renameChat,
    deleteChat,
    refresh,
  } = useConversations()

  const [shareTarget, setShareTarget] = useState<Conversation | null>(null)

  const handleNewChat = async () => {
    const newConv = await createNewChat()
    navigate(ROUTES.CHAT_CONVERSATION(newConv.id))
  }

  return (
    <>
      <div className={`w-[260px] h-full flex flex-col bg-bg-secondary border-r border-border-default select-none ${className || ""}`}>
        {/* Header Action: + New Chat */}
        <div className="p-3 border-b border-border-default space-y-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={handleNewChat}
            className="w-full justify-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>

          <ConversationSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Scrollable Conversation History */}
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-text-muted space-y-2">
              <MessageSquare className="w-6 h-6 mx-auto opacity-40 mb-2" />
              {searchQuery ? (
                <div>No chats match &quot;{searchQuery}&quot;</div>
              ) : (
                <div>No conversation history yet. Start a new chat above!</div>
              )}
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              activeId={activeId}
              onRename={renameChat}
              onDelete={deleteChat}
              onOpenShare={(conv) => setShareTarget(conv)}
            />
          )}
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
        conversation={shareTarget}
        onConversationUpdated={() => refresh()}
      />
    </>
  )
}
