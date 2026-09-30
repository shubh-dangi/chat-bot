import { useState, useEffect, useCallback } from "react"
import type { Message } from "../types/message.types"
import { chatService } from "../services/chatService"

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setIsLoading(true)
    try {
      const list = await chatService.getMessages(conversationId)
      setMessages(list)
    } finally {
      setIsLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim() || isSending) return

    setIsSending(true)
    // Optimistic user message addition
    const tempUserMsg: Message = {
      id: "temp-" + Date.now(),
      conversationId,
      sender: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }
    setMessages((prev) => [...prev, tempUserMsg])

    try {
      const { userMessage, assistantMessage } = await chatService.sendMessage(conversationId, content)
      setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), userMessage, assistantMessage])
    } catch {
      // Mark as error
      setMessages((prev) =>
        prev.map((m) => (m.id === tempUserMsg.id ? { ...m, status: "error" } : m))
      )
    } finally {
      setIsSending(false)
    }
  }

  const editMessage = async (messageId: string, newContent: string) => {
    if (!conversationId) return
    setIsSending(true)
    try {
      const updatedList = await chatService.editMessage(conversationId, messageId, newContent)
      setMessages(updatedList)
    } finally {
      setIsSending(false)
    }
  }

  const regenerateResponse = async () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.sender === "user")
    if (lastUserMessage) {
      await sendMessage(lastUserMessage.content)
    }
  }

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    editMessage,
    regenerateResponse,
    refreshMessages: fetchMessages,
  }
}
