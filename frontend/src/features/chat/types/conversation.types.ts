export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  lastMessagePreview?: string
  shareToken?: string
  isShared?: boolean
}

export type ConversationDateGroup = "Today" | "Yesterday" | "Previous 7 Days" | "Previous 30 Days" | "Older"
