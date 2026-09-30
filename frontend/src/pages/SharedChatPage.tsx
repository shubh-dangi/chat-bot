import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { SharedChatView } from "@/features/share/components/SharedChatView"
import { InvalidShareState } from "@/features/share/components/InvalidShareState"
import { LoadingState } from "@/shared/components/feedback/LoadingState"
import { chatService } from "@/features/chat/services/chatService"
import type { Conversation } from "@/features/chat/types/conversation.types"
import type { Message } from "@/features/chat/types/message.types"

export default function SharedChatPage() {
  const { shareToken } = useParams<{ shareToken: string }>()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{ conversation: Conversation; messages: Message[] } | null>(null)

  useEffect(() => {
    if (!shareToken) {
      setLoading(false)
      return
    }

    chatService
      .getSharedConversation(shareToken)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch(() => {
        setData(null)
        setLoading(false)
      })
  }, [shareToken])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
        <LoadingState type="chat" />
      </div>
    )
  }

  if (!data) {
    return <InvalidShareState />
  }

  return <SharedChatView conversation={data.conversation} messages={data.messages} />
}
