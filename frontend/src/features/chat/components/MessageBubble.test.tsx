import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MessageBubble } from "./MessageBubble"
import type { Message } from "../types/message.types"

describe("Chat — MessageBubble", () => {
  const userMessage: Message = {
    id: "msg-1",
    conversationId: "conv-1",
    sender: "user",
    content: "What is the fee submission deadline?",
    timestamp: "10:30 AM",
    status: "sent",
  }

  const assistantMessage: Message = {
    id: "msg-2",
    conversationId: "conv-1",
    sender: "assistant",
    content: "According to University Notice #402, fees are due on **November 15, 2026**.",
    timestamp: "10:31 AM",
    status: "sent",
  }

  it("renders user message with text content and timestamp", () => {
    render(<MessageBubble message={userMessage} />)
    expect(screen.getByText("What is the fee submission deadline?")).toBeInTheDocument()
    expect(screen.getByText("10:30 AM")).toBeInTheDocument()
  })

  it("renders assistant message with formatted markdown bold tag", () => {
    render(<MessageBubble message={assistantMessage} />)
    expect(screen.getByText("November 15, 2026")).toBeInTheDocument()
    expect(screen.getByText("November 15, 2026").tagName).toBe("STRONG")
  })

  it("renders typing indicator when assistant message has status 'sending' and empty content", () => {
    const streamingMessage: Message = {
      ...assistantMessage,
      content: "",
      status: "sending",
    }
    render(<MessageBubble message={streamingMessage} />)
    expect(screen.getByRole("status")).toBeInTheDocument()
  })

  it("renders code blocks within markdown content safely", () => {
    const codeMessage: Message = {
      ...assistantMessage,
      content: "Here is your code:\n```python\nprint('Hello College')\n```",
    }
    render(<MessageBubble message={codeMessage} />)
    expect(screen.getByText(/print\('Hello College'\)/)).toBeInTheDocument()
  })

  it("allows editing user messages and calls onEdit", async () => {
    const handleEdit = vi.fn().mockResolvedValue(true)
    render(<MessageBubble message={userMessage} onEdit={handleEdit} />)

    // Click edit button
    const editBtn = screen.getByRole("button", { name: /edit message/i })
    fireEvent.click(editBtn)

    // Edit textarea appears
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveValue("What is the fee submission deadline?")

    fireEvent.change(textarea, { target: { value: "Updated fee query" } })
    const saveBtn = screen.getByRole("button", { name: /save/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(handleEdit).toHaveBeenCalledWith("Updated fee query")
    })
  })

  it("cancels edit mode without calling onEdit", () => {
    const handleEdit = vi.fn()
    render(<MessageBubble message={userMessage} onEdit={handleEdit} />)

    fireEvent.click(screen.getByRole("button", { name: /edit message/i }))
    const cancelBtn = screen.getByRole("button", { name: /cancel/i })
    fireEvent.click(cancelBtn)

    expect(handleEdit).not.toHaveBeenCalled()
    expect(screen.queryByRole("textbox")).toBeNull()
  })
})
