import { describe, it, expect, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { uiStore } from "@/stores/uiStore"
import { ToastProvider } from "@/shared/components/feedback/ToastContainer"

function renderSidebar() {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={["/chat"]}>
        <Sidebar />
      </MemoryRouter>
    </ToastProvider>
  )
}

describe("Sidebar component", () => {
  beforeEach(() => {
    uiStore.setSidebarCollapsed(false)
    uiStore.setSearchQuery("")
  })

  it("renders cleanly with New Chat button and Recent chats section without Chat Assistant or search bar clutter", () => {
    renderSidebar()

    // Should have brand name
    expect(screen.getByText("College AI")).toBeInTheDocument()
    expect(screen.getByText("Campus Assistant")).toBeInTheDocument()

    // Should have New Chat button
    expect(screen.getByRole("button", { name: /new chat/i })).toBeInTheDocument()

    // Should have Recent section header
    expect(screen.getByText("Recent")).toBeInTheDocument()

    // Should NOT have "Chat Assistant" redundant navigation link
    expect(screen.queryByText("Chat Assistant")).not.toBeInTheDocument()

    // Should NOT have search input inside sidebar
    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument()
  })

  it("handles sidebar collapse and expand cleanly without glitching", () => {
    renderSidebar()

    // Find collapse button
    const collapseBtn = screen.getByRole("button", { name: /collapse sidebar/i })
    expect(collapseBtn).toBeInTheDocument()

    // Click to collapse
    fireEvent.click(collapseBtn)

    // Now it should be collapsed (expand button visible)
    const expandBtn = screen.getByRole("button", { name: /expand sidebar/i })
    expect(expandBtn).toBeInTheDocument()

    // When collapsed, the text "Recent" and "College AI" are hidden from header
    expect(screen.queryByText("College AI")).not.toBeInTheDocument()

    // Click to expand again
    fireEvent.click(expandBtn)
    expect(screen.getByText("College AI")).toBeInTheDocument()
    expect(screen.getByText("Recent")).toBeInTheDocument()
  })
})
