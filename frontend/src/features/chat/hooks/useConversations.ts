import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import type { Conversation } from "../types/conversation.types"
import { chatService } from "../services/chatService"
import { useUiStore } from "@/stores/uiStore"

export function useConversations() {
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { searchQuery, setSearchQuery } = useUiStore()

  // Sync if URL search param changes
  useEffect(() => {
    const q = searchParams.get("q")
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q)
    }
  }, [searchParams, searchQuery, setSearchQuery])

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
