import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChatLayout } from "@/layouts/ChatLayout"
import { ChatHeader } from "@/features/chat/components/ChatHeader"
import { MessageArea } from "@/features/chat/components/MessageArea"
import { MessageComposer } from "@/features/chat/components/MessageComposer"
import { ShareDialog } from "@/features/chat/components/ShareDialog"
import { useChatMessages } from "@/features/chat/hooks/useChatMessages"
import { chatService } from "@/features/chat/services/chatService"
import { ROUTES } from "@/shared/config/routes"
import type { Conversation } from "@/features/chat/types/conversation.types"

export default function ChatConversationPage({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void
}) {
  const { chatId } = useParams<{ chatId: string }>()
  const navigate = useNavigate()

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [composerSeed, setComposerSeed] = useState("")

  const {
    messages,
    isSending,
    sendMessage,
    editMessage,
    regenerateResponse,
    stopStreaming,
  } = useChatMessages(chatId || null)

  useEffect(() => {
    if (chatId) {
      chatService.getConversation(chatId).then((c) => setConversation(c))
    } else {
      setConversation(null)
    }
  }, [chatId])

  const handleSend = async (content: string) => {
    if (!chatId) {
      const res = await chatService.createConversation(content)
      await chatService.sendMessage(res.conversation.id, content)
      navigate(ROUTES.CHAT_CONVERSATION(res.conversation.id))
      return
    }
    await sendMessage(content)
    // Update local conversation object
    const updated = await chatService.getConversation(chatId)
    if (updated) setConversation(updated)
  }

  const handleRename = async (id: string, newTitle: string) => {
    const updated = await chatService.renameConversation(id, newTitle)
    setConversation(updated)
  }

  const handleDelete = async (id: string) => {
    await chatService.deleteConversation(id)
    navigate(ROUTES.CHAT)
  }

  return (
    <ChatLayout activeId={chatId || null}>
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-bg-primary">
        <ChatHeader
          conversation={conversation}
          onRename={handleRename}
          onDelete={handleDelete}
          onOpenShare={() => setShareOpen(true)}
          onToggleSidebar={onToggleSidebar}
        />

        <MessageArea
          messages={messages}
          isGenerating={isSending}
          onEditMessage={editMessage}
          onRegenerateResponse={regenerateResponse}
          onSelectPrompt={(p) => setComposerSeed(p)}
        />

        <MessageComposer
          onSend={handleSend}
          isGenerating={isSending}
          onStop={stopStreaming}
          initialValue={composerSeed}
        />

        <ShareDialog
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          conversation={conversation}
          onConversationUpdated={(u) => setConversation(u)}
        />
      </div>
    </ChatLayout>
  )
}
