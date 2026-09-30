import { useMemo } from "react"
import { ConversationItem } from "./ConversationItem"
import { getRelativeDateGroup } from "@/shared/utils/format"
import type { Conversation, ConversationDateGroup } from "../types/conversation.types"

export interface ConversationListProps {
  conversations: Conversation[]
  activeId: string | null
  onRename: (id: string, newTitle: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
  onOpenShare: (conv: Conversation) => void
}

const ORDERED_GROUPS: ConversationDateGroup[] = [
  "Today",
  "Yesterday",
  "Previous 7 Days",
  "Previous 30 Days",
  "Older",
]

export function ConversationList({
  conversations,
  activeId,
  onRename,
  onDelete,
  onOpenShare,
}: ConversationListProps) {
  const grouped = useMemo(() => {
    const map: Record<string, Conversation[]> = {}
    ORDERED_GROUPS.forEach((g) => (map[g] = []))

    conversations.forEach((conv) => {
      const groupKey = getRelativeDateGroup(conv.updatedAt || conv.createdAt)
      if (!map[groupKey]) map[groupKey] = []
      map[groupKey].push(conv)
    })

    return map
  }, [conversations])

  return (
    <div className="space-y-4 min-w-0">
      {ORDERED_GROUPS.map((group) => {
        const items = grouped[group]
        if (!items || items.length === 0) return null

        return (
          <div key={group} className="space-y-1 min-w-0">
            <div className="px-2.5 py-1 text-[11px] font-semibold tracking-wider text-text-muted uppercase select-none">
              {group}
            </div>
            <div className="space-y-0.5">
              {items.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeId}
                  onRename={onRename}
                  onDelete={onDelete}
                  onOpenShare={onOpenShare}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
