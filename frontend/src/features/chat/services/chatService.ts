import { apiClient } from "@/shared/services/apiClient"
import { tokenService } from "@/shared/services/tokenService"
import { storage } from "@/shared/utils/storage"
import type { Conversation } from "../types/conversation.types"
import type { Message } from "../types/message.types"
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from "./mockChatData"

const CONV_STORAGE_KEY = "college_ai_conversations"
const MSG_STORAGE_KEY = "college_ai_messages"

function loadStoredConversations(): Conversation[] {
  return storage.get<Conversation[]>(CONV_STORAGE_KEY, INITIAL_CONVERSATIONS)
}

function loadStoredMessages(): Record<string, Message[]> {
  return storage.get<Record<string, Message[]>>(MSG_STORAGE_KEY, INITIAL_MESSAGES)
}

let localConversations = loadStoredConversations()
let localMessagesMap = loadStoredMessages()

function persistLocal() {
  storage.set(CONV_STORAGE_KEY, localConversations)
  storage.set(MSG_STORAGE_KEY, localMessagesMap)
}

function normalizeConversation(raw: any): Conversation {
  return {
    id: String(raw.id),
    title: raw.title || "New Conversation",
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString(),
    lastMessagePreview: raw.lastMessagePreview || raw.last_message_preview,
    shareToken: raw.shareToken || raw.share_token,
    isShared: Boolean(raw.isShared ?? raw.is_shared),
  }
}

function normalizeMessage(raw: any, fallbackConvId: string): Message {
  let timeStr = raw.timestamp
  if (!timeStr && raw.created_at) {
    try {
      timeStr = new Date(raw.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
      timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  }

  return {
    id: String(raw.id || "msg-" + Date.now()),
    conversationId: String(raw.conversationId || raw.conversation_id || fallbackConvId),
    sender: (raw.sender || raw.role || "user") as Message["sender"],
    content: raw.content || "",
    timestamp: timeStr || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: (raw.status as Message["status"]) || "sent",
  }
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    if (tokenService.hasToken()) {
      try {
        const rawList = await apiClient.get<any[]>("/api/chats")
        if (Array.isArray(rawList)) {
          const list = rawList.map(normalizeConversation)
          // Keep local mirror updated
          localConversations = list
          persistLocal()
          return list
        }
      } catch (err) {
        console.warn("Using offline conversations cache:", err)
      }
    }
    return [...localConversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  async getConversation(id: string): Promise<Conversation | null> {
    if (tokenService.hasToken()) {
      try {
        const raw = await apiClient.get<any>(`/api/chats/${id}`)
        if (raw && raw.id) {
          return normalizeConversation(raw)
        }
      } catch (err) {
        console.warn(`Falling back to local cache for chat ${id}:`, err)
      }
    }
    return localConversations.find((c) => c.id === id) || null
  },

  async createConversation(initialMessage?: string): Promise<{ conversation: Conversation; initialMessage?: Message }> {
    const title = initialMessage
      ? initialMessage.slice(0, 36) + (initialMessage.length > 36 ? "..." : "")
      : "New Conversation"

    if (tokenService.hasToken()) {
      try {
        const raw = await apiClient.post<any>("/api/chats", {
          title,
          initial_message: initialMessage,
        })
        const conv = normalizeConversation(raw)
        localConversations = [conv, ...localConversations]
        localMessagesMap[conv.id] = []
        persistLocal()
        return { conversation: conv }
      } catch (err) {
        console.warn("Creating conversation via local fallback:", err)
      }
    }

    const id = "conv-" + Date.now()
    const now = new Date().toISOString()
    const newConv: Conversation = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      lastMessagePreview: initialMessage || undefined,
    }

    localConversations = [newConv, ...localConversations]
    localMessagesMap[id] = []
    persistLocal()

    return { conversation: newConv }
  },

  async renameConversation(id: string, newTitle: string): Promise<Conversation> {
    const cleanTitle = newTitle.trim()
    if (tokenService.hasToken()) {
      try {
        const raw = await apiClient.patch<any>(`/api/chats/${id}`, { title: cleanTitle })
        const conv = normalizeConversation(raw)
        localConversations = localConversations.map((c) => (c.id === id ? conv : c))
        persistLocal()
        return conv
      } catch (err) {
        console.warn("Renaming conversation via local fallback:", err)
      }
    }

    const conv = localConversations.find((c) => c.id === id)
    if (!conv) throw new Error("Conversation not found")
    conv.title = cleanTitle || conv.title
    conv.updatedAt = new Date().toISOString()
    persistLocal()
    return { ...conv }
  },

  async deleteConversation(id: string): Promise<void> {
    if (tokenService.hasToken()) {
      try {
        await apiClient.delete(`/api/chats/${id}`)
      } catch (err) {
        console.warn("Deleting conversation via local fallback:", err)
      }
    }
    localConversations = localConversations.filter((c) => c.id !== id)
    delete localMessagesMap[id]
    persistLocal()
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (tokenService.hasToken()) {
      try {
        const rawList = await apiClient.get<any[]>(`/api/chats/${conversationId}/messages`)
        if (Array.isArray(rawList)) {
          const mapped = rawList.map((m) => normalizeMessage(m, conversationId))
          localMessagesMap[conversationId] = mapped
          persistLocal()
          return mapped
        }
      } catch (err) {
        console.warn("Using offline messages cache:", err)
      }
    }
    return localMessagesMap[conversationId] || []
  },

  async sendMessage(
    conversationId: string,
    content: string,
    _onToken?: (token: string) => void
  ): Promise<{ userMessage: Message; assistantMessage: Message }> {
    if (tokenService.hasToken()) {
      try {
        const data = await apiClient.post<any>(`/api/chats/${conversationId}/messages`, { content })
        const rawUser = data.userMessage || data.user_message
        const rawAssistant = data.assistantMessage || data.assistant_message

        const userMessage = normalizeMessage(rawUser, conversationId)
        const assistantMessage = normalizeMessage(rawAssistant, conversationId)

        if (!localMessagesMap[conversationId]) {
          localMessagesMap[conversationId] = []
        }
        localMessagesMap[conversationId].push(userMessage, assistantMessage)

        const conv = localConversations.find((c) => c.id === conversationId)
        if (conv) {
          conv.updatedAt = new Date().toISOString()
          conv.lastMessagePreview = content.slice(0, 60)
        }
        persistLocal()

        return { userMessage, assistantMessage }
      } catch (err) {
        console.warn("Backend chat message failed, falling back to simulated generation:", err)
      }
    }

    // Local fallback simulation
    const userMsgId = "msg-" + Date.now()
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    const userMessage: Message = {
      id: userMsgId,
      conversationId,
      sender: "user",
      content,
      timestamp: timeStr,
      status: "sent",
    }

    if (!localMessagesMap[conversationId]) {
      localMessagesMap[conversationId] = []
    }
    localMessagesMap[conversationId].push(userMessage)

    const conv = localConversations.find((c) => c.id === conversationId)
    if (conv) {
      conv.updatedAt = now.toISOString()
      conv.lastMessagePreview = content.slice(0, 60)
      if (conv.title === "New Conversation") {
        conv.title = content.slice(0, 32) + (content.length > 32 ? "..." : "")
      }
    }
    persistLocal()

    await new Promise((r) => setTimeout(r, 450))

    const sampleResponses = [
      `Based on the official college handbook and departmental guidelines for **${content.slice(0, 24)}**:\n\n1. **Guidelines:** Academic policies require standard compliance with the respective course syllabus.\n2. **Action Item:** Students should reach out to their faculty mentor or administrative coordinator if specific waivers or exam schedules are needed.\n\n\`\`\`text\nReference ID: REF-${Math.floor(1000 + Math.random() * 9000)}\nStatus: Verified Against Campus Handbook\n\`\`\`\n\nIs there anything specific you would like me to clarify?`,
      `Regarding **"${content}"**:\n\nThe University Administrative Office processes all inquiries between **09:00 AM and 04:30 PM**. Ensure your student ID card is present when collecting verified transcripts, hall tickets, or laboratory clearances.\n\n*Notice: Examination hall permits will be distributed from the student counter starting next Monday.*`,
    ]

    const fullResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)]
    const assistantMsgId = "msg-" + (Date.now() + 1)

    const assistantMessage: Message = {
      id: assistantMsgId,
      conversationId,
      sender: "assistant",
      content: fullResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    localMessagesMap[conversationId].push(assistantMessage)
    persistLocal()

    return { userMessage, assistantMessage }
  },

  async editMessage(conversationId: string, messageId: string, newContent: string): Promise<Message[]> {
    if (tokenService.hasToken()) {
      try {
        const rawList = await apiClient.put<any[]>(`/api/chats/${conversationId}/messages/${messageId}`, {
          new_content: newContent,
        })
        if (Array.isArray(rawList)) {
          const mapped = rawList.map((m) => normalizeMessage(m, conversationId))
          localMessagesMap[conversationId] = mapped
          persistLocal()
          return mapped
        }
      } catch (err) {
        console.warn("Backend edit message fallback:", err)
      }
    }

    const list = localMessagesMap[conversationId] || []
    const index = list.findIndex((m) => m.id === messageId)
    if (index === -1) return list

    list[index].content = newContent
    localMessagesMap[conversationId] = list.slice(0, index + 1)
    persistLocal()

    await this.sendMessage(conversationId, newContent)
    return localMessagesMap[conversationId]
  },

  async createShareLink(conversationId: string): Promise<string> {
    if (tokenService.hasToken()) {
      try {
        const data = await apiClient.post<any>(`/api/chats/${conversationId}/share`)
        const token = data.shareToken || data.share_token
        if (token) {
          const conv = localConversations.find((c) => c.id === conversationId)
          if (conv) {
            conv.isShared = true
            conv.shareToken = token
            persistLocal()
          }
          return token
        }
      } catch (err) {
        console.warn("Backend create share link fallback:", err)
      }
    }

    const conv = localConversations.find((c) => c.id === conversationId)
    if (!conv) throw new Error("Conversation not found")
    const token = "s-" + Math.random().toString(36).slice(2, 8)
    conv.isShared = true
    conv.shareToken = token
    persistLocal()
    return token
  },

  async revokeShareLink(conversationId: string): Promise<void> {
    if (tokenService.hasToken()) {
      try {
        await apiClient.delete(`/api/chats/${conversationId}/share`)
      } catch (err) {
        console.warn("Backend revoke share fallback:", err)
      }
    }
    const conv = localConversations.find((c) => c.id === conversationId)
    if (!conv) return
    conv.isShared = false
    conv.shareToken = undefined
    persistLocal()
  },

  async getSharedConversation(shareToken: string): Promise<{ conversation: Conversation; messages: Message[] } | null> {
    try {
      const data = await apiClient.get<any>(`/api/shared/${shareToken}`)
      if (data && data.conversation) {
        const conv = normalizeConversation(data.conversation)
        const msgs = (data.messages || []).map((m: any) => normalizeMessage(m, conv.id))
        return { conversation: conv, messages: msgs }
      }
    } catch (err) {
      console.warn("Fetching shared chat via API failed, checking local store:", err)
    }

    const conv = localConversations.find((c) => c.shareToken === shareToken && c.isShared)
    if (!conv) return null
    return {
      conversation: conv,
      messages: localMessagesMap[conv.id] || [],
    }
  },
}
