import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { ChatHeader } from "./ChatHeader"
import { ToastProvider } from "@/shared/components/feedback/ToastContainer"
import type { Conversation } from "../types/conversation.types"

const mockConversation: Conversation = {
  id: "conv-1",
  title: "Computer Science Assignment",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe("ChatHeader component", () => {
  it("renders the conversation title and the navbar search bar", () => {
    render(
      <ToastProvider>
        <MemoryRouter>
          <ChatHeader conversation={mockConversation} />
        </MemoryRouter>
      </ToastProvider>
    )

    // Title should be displayed
    expect(screen.getByText("Computer Science Assignment")).toBeInTheDocument()

    // Navbar search bar should be present
    expect(screen.getByRole("search")).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
