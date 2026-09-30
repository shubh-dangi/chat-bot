import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { MessageComposer } from "./MessageComposer"
import { ToastProvider } from "@/shared/components/feedback/ToastContainer"

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe("Chat — MessageComposer", () => {
  it("renders composer textarea and send button", () => {
    renderWithToast(<MessageComposer onSend={vi.fn()} />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument()
  })

  it("does not trigger onSend for empty or whitespace-only messages", () => {
    const handleSend = vi.fn()
    renderWithToast(<MessageComposer onSend={handleSend} />)
    const textarea = screen.getByRole("textbox")
    const sendBtn = screen.getByRole("button", { name: /send message/i })

    // Try sending empty
    fireEvent.click(sendBtn)
    expect(handleSend).not.toHaveBeenCalled()

    // Try sending spaces only
    fireEvent.change(textarea, { target: { value: "     " } })
    fireEvent.click(sendBtn)
    expect(handleSend).not.toHaveBeenCalled()
  })

  it("sends message and clears textarea when Enter is pressed without Shift", () => {
    const handleSend = vi.fn()
    renderWithToast(<MessageComposer onSend={handleSend} />)
    const textarea = screen.getByRole("textbox")

    fireEvent.change(textarea, { target: { value: "What are the CS Sem 5 courses?" } })
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false })

    expect(handleSend).toHaveBeenCalledWith("What are the CS Sem 5 courses?")
    expect((textarea as HTMLTextAreaElement).value).toBe("")
  })

  it("does not send message on Shift+Enter (allows newline)", () => {
    const handleSend = vi.fn()
    renderWithToast(<MessageComposer onSend={handleSend} />)
    const textarea = screen.getByRole("textbox")

    fireEvent.change(textarea, { target: { value: "Line 1" } })
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true })

    expect(handleSend).not.toHaveBeenCalled()
  })

  it("disables send and textarea when disabled prop is true", () => {
    const handleSend = vi.fn()
    renderWithToast(<MessageComposer onSend={handleSend} disabled={true} />)
    const textarea = screen.getByRole("textbox")
    const sendBtn = screen.getByRole("button", { name: /send message/i })

    expect(textarea).toBeDisabled()
    expect(sendBtn).toBeDisabled()

    fireEvent.change(textarea, { target: { value: "Hello" } })
    fireEvent.click(sendBtn)
    expect(handleSend).not.toHaveBeenCalled()
  })

  it("shows stop generation button when isGenerating is true", () => {
    const handleStop = vi.fn()
    renderWithToast(<MessageComposer onSend={vi.fn()} isGenerating={true} onStop={handleStop} />)
    const stopBtn = screen.getByRole("button", { name: /stop generation/i })
    expect(stopBtn).toBeInTheDocument()

    fireEvent.click(stopBtn)
    expect(handleStop).toHaveBeenCalledTimes(1)
  })

  it("handles long messages, emojis, and unicode safely", () => {
    const handleSend = vi.fn()
    renderWithToast(<MessageComposer onSend={handleSend} />)
    const textarea = screen.getByRole("textbox")
    const sendBtn = screen.getByRole("button", { name: /send message/i })

    const complexPayload = "🎓 Question: What about § 14.2? \n\tSpecial chars: <script>alert(1)</script> & 📚 日本語 / العربية"
    fireEvent.change(textarea, { target: { value: complexPayload } })
    fireEvent.click(sendBtn)

    expect(handleSend).toHaveBeenCalledWith(complexPayload)
  })
})
