export type MessageSender = "user" | "assistant"

export type MessageStatus = "sent" | "streaming" | "error"

export interface Message {
  id: string
  conversationId: string
  sender: MessageSender
  content: string
  timestamp: string
  status?: MessageStatus
}
