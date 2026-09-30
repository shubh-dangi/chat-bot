import { describe, it, expect, beforeEach } from "vitest"
import { chatService } from "./chatService"

describe("Chat Service — Client-Side Logic & Storage Resilience", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("retrieves list of conversations", async () => {
    const convs = await chatService.getConversations()
    expect(Array.isArray(convs)).toBe(true)
    expect(convs.length).toBeGreaterThan(0)
  })

  it("creates a new conversation", async () => {
    const newConv = await chatService.createConversation("Computer Networks Lab Query")
    expect(newConv).toBeDefined()
    expect(newConv.title).toBe("Computer Networks Lab Query")
    expect(newConv.id).toBeDefined()

    const all = await chatService.getConversations()
    const found = all.find((c) => c.id === newConv.id)
    expect(found).toBeDefined()
  })

  it("renames an existing conversation", async () => {
    const conv = await chatService.createConversation("Original Title")
    const updated = await chatService.renameConversation(conv.id, "Renamed Syllabus Query")
    expect(updated.title).toBe("Renamed Syllabus Query")

    const fetched = await chatService.getConversation(conv.id)
    expect(fetched?.title).toBe("Renamed Syllabus Query")
  })

  it("deletes a conversation and removes its messages", async () => {
    const conv = await chatService.createConversation("To Be Deleted")
    await chatService.sendMessage(conv.id, "Hello")

    await chatService.deleteConversation(conv.id)
    const fetched = await chatService.getConversation(conv.id)
    expect(fetched).toBeNull()

    const msgs = await chatService.getMessages(conv.id)
    expect(msgs.length).toBe(0)
  })

  it("searches conversations by title query case-insensitively", async () => {
    await chatService.createConversation("Physics Midterm Prep")
    await chatService.createConversation("Chemistry Laboratory Guidelines")

    const physicsResults = await chatService.searchConversations("physics")
    expect(physicsResults.some((c) => c.title.includes("Physics"))).toBe(true)
    expect(physicsResults.every((c) => !c.title.includes("Chemistry"))).toBe(true)
  })

  it("generates a share token for read-only snapshot sharing", async () => {
    const conv = await chatService.createConversation("Shareable Discussion")
    const token = await chatService.generateShareToken(conv.id)
    expect(token).toBeDefined()
    expect(typeof token).toBe("string")
    expect(token.length).toBeGreaterThan(5)

    const shared = await chatService.getSharedChat(token)
    expect(shared).toBeDefined()
    expect(shared?.conversation.title).toBe("Shareable Discussion")
  })
})
