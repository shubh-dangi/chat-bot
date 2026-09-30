import { useState, useEffect, useCallback, useRef } from "react"
import type { Message } from "../types/message.types"
import { chatService } from "../services/chatService"

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const abortControllerRef = useRef<boolean>(false)

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

  const stopStreaming = useCallback(() => {
    abortControllerRef.current = true
    setIsSending(false)
    setMessages((prev) =>
      prev.map((m) =>
        m.status === "streaming" || m.status === "thinking"
          ? { ...m, status: "sent" }
          : m
      )
    )
  }, [])

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim() || isSending) return

    abortControllerRef.current = false
    setIsSending(true)

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // 1. Optimistic user message addition
    const userMsgId = "msg-user-" + Date.now()
    const userMsg: Message = {
      id: userMsgId,
      conversationId,
      sender: "user",
      content,
      timestamp: timeStr,
      status: "sent",
    }

    // 2. Assistant Thinking Placeholder
    const assistantMsgId = "msg-assistant-" + Date.now()
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      conversationId,
      sender: "assistant",
      content: "",
      timestamp: timeStr,
      status: "thinking",
    }

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg])

    try {
      // 3. Thinking phase delay (~450ms)
      await new Promise((resolve) => setTimeout(resolve, 450))
      if (abortControllerRef.current) return

      // Transition to streaming
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, status: "streaming" } : m))
      )

      // Fetch the response text from service
      const { assistantMessage } = await chatService.sendMessage(conversationId, content)
      const fullText = assistantMessage.content

      // 4. Token-by-token streaming animation
      let currentText = ""
      const chunkSize = 4
      for (let i = 0; i < fullText.length; i += chunkSize) {
        if (abortControllerRef.current) break
        currentText += fullText.slice(i, i + chunkSize)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: currentText, status: "streaming" } : m
          )
        )
        // Natural pacing delay
        await new Promise((resolve) => setTimeout(resolve, 14))
      }

      // 5. Finalize completed message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: fullText, status: "sent" }
            : m
        )
      )
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsgId ? { ...m, status: "error" } : m))
      )
    } finally {
      setIsSending(false)
    }
  }

  const editMessage = async (messageId: string, newContent: string) => {
    if (!conversationId || isSending) return
    setIsSending(true)
    try {
      const list = await chatService.getMessages(conversationId)
      const index = list.findIndex((m) => m.id === messageId)
      if (index !== -1) {
        // Keep messages up to edit
        await chatService.editMessage(conversationId, messageId, newContent)
        await fetchMessages()
      }
    } finally {
      setIsSending(false)
    }
  }

  const regenerateResponse = async () => {
    if (isSending) return
    const lastUserMessage = [...messages].reverse().find((m) => m.sender === "user")
    if (lastUserMessage) {
      // Remove last assistant message if exists
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1]
        if (lastMsg && lastMsg.sender === "assistant") {
          return prev.slice(0, -1)
        }
        return prev
      })
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
    stopStreaming,
    refreshMessages: fetchMessages,
  }
}
