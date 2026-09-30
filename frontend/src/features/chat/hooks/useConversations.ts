import { useState, useEffect, useCallback } from "react"
import type { Conversation } from "../types/conversation.types"
import { chatService } from "../services/chatService"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const refresh = useCallback(async () => {
    try {
      const data = await chatService.getConversations()
      setConversations(data)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const createNewChat = async (initialMessage?: string) => {
    const res = await chatService.createConversation(initialMessage)
    await refresh()
    return res.conversation
  }

  const renameChat = async (id: string, newTitle: string) => {
    const updated = await chatService.renameConversation(id, newTitle)
    setConversations((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }

  const deleteChat = async (id: string) => {
    await chatService.deleteConversation(id)
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    isLoading,
    searchQuery,
    setSearchQuery,
    refresh,
    createNewChat,
    renameChat,
    deleteChat,
  }
}
