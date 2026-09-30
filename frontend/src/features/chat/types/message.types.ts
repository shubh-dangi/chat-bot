export type MessageSender = "user" | "assistant"

export type MessageStatus = "thinking" | "streaming" | "sent" | "error"

export interface Message {
  id: string
  conversationId: string
  sender: MessageSender
  content: string
  timestamp: string
  status?: MessageStatus
}
