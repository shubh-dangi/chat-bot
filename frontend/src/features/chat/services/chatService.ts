import type { Conversation } from "../types/conversation.types"
import type { Message } from "../types/message.types"
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from "./mockChatData"
import { storage } from "@/shared/utils/storage"

const CONV_STORAGE_KEY = "college_ai_conversations"
const MSG_STORAGE_KEY = "college_ai_messages"

function loadStoredConversations(): Conversation[] {
  return storage.get<Conversation[]>(CONV_STORAGE_KEY, INITIAL_CONVERSATIONS)
}

function loadStoredMessages(): Record<string, Message[]> {
  return storage.get<Record<string, Message[]>>(MSG_STORAGE_KEY, INITIAL_MESSAGES)
}

let conversations = loadStoredConversations()
let messagesMap = loadStoredMessages()

function persist() {
  storage.set(CONV_STORAGE_KEY, conversations)
  storage.set(MSG_STORAGE_KEY, messagesMap)
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    await new Promise((r) => setTimeout(r, 100))
    return [...conversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  async getConversation(id: string): Promise<Conversation | null> {
    return conversations.find((c) => c.id === id) || null
  },

  async createConversation(initialMessage?: string): Promise<{ conversation: Conversation; initialMessage?: Message }> {
    const id = "conv-" + Date.now()
    const now = new Date().toISOString()
    const title = initialMessage ? initialMessage.slice(0, 36) + (initialMessage.length > 36 ? "..." : "") : "New Conversation"

    const newConv: Conversation = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      lastMessagePreview: initialMessage || undefined,
    }

    conversations = [newConv, ...conversations]
    messagesMap[id] = []
    persist()

    return { conversation: newConv }
  },

  async renameConversation(id: string, newTitle: string): Promise<Conversation> {
    const conv = conversations.find((c) => c.id === id)
    if (!conv) throw new Error("Conversation not found")
    conv.title = newTitle.trim() || conv.title
    conv.updatedAt = new Date().toISOString()
    persist()
    return { ...conv }
  },

  async deleteConversation(id: string): Promise<void> {
    conversations = conversations.filter((c) => c.id !== id)
    delete messagesMap[id]
    persist()
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    await new Promise((r) => setTimeout(r, 80))
    return messagesMap[conversationId] || []
  },

  async sendMessage(
    conversationId: string,
    content: string,
    _onToken?: (token: string) => void
  ): Promise<{ userMessage: Message; assistantMessage: Message }> {
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

    if (!messagesMap[conversationId]) {
      messagesMap[conversationId] = []
    }
    messagesMap[conversationId].push(userMessage)

    // Update conversation recency & title if it's the first message
    const conv = conversations.find((c) => c.id === conversationId)
    if (conv) {
      conv.updatedAt = now.toISOString()
      conv.lastMessagePreview = content.slice(0, 60)
      if (conv.title === "New Conversation") {
        conv.title = content.slice(0, 32) + (content.length > 32 ? "..." : "")
      }
    }
    persist()

    // Generate responsive simulated reply
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

    messagesMap[conversationId].push(assistantMessage)
    persist()

    return { userMessage, assistantMessage }
  },

  async editMessage(conversationId: string, messageId: string, newContent: string): Promise<Message[]> {
    const list = messagesMap[conversationId] || []
    const index = list.findIndex((m) => m.id === messageId)
    if (index === -1) return list

    // Update the message content
    list[index].content = newContent

    // Truncate following messages to simulate re-branching from this edit
    messagesMap[conversationId] = list.slice(0, index + 1)
    persist()

    // Trigger fresh assistant response
    await this.sendMessage(conversationId, newContent)
    return messagesMap[conversationId]
  },

  async createShareLink(conversationId: string): Promise<string> {
    const conv = conversations.find((c) => c.id === conversationId)
    if (!conv) throw new Error("Conversation not found")
    const token = "s-" + Math.random().toString(36).slice(2, 8)
    conv.isShared = true
    conv.shareToken = token
    persist()
    return token
  },

  async revokeShareLink(conversationId: string): Promise<void> {
    const conv = conversations.find((c) => c.id === conversationId)
    if (!conv) return
    conv.isShared = false
    conv.shareToken = undefined
    persist()
  },

  async getSharedConversation(shareToken: string): Promise<{ conversation: Conversation; messages: Message[] } | null> {
    const conv = conversations.find((c) => c.shareToken === shareToken && c.isShared)
    if (!conv) return null
    return {
      conversation: conv,
      messages: messagesMap[conv.id] || [],
    }
  },
}
