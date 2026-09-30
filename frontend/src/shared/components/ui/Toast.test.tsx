import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Toast, ToastItem } from "./Toast"

describe("Toast component", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders toast message, title, and role status", () => {
    const toast: ToastItem = {
      id: "toast-1",
      title: "Success Notification",
      message: "Operation completed successfully.",
      type: "success",
    }

    render(<Toast toast={toast} onDismiss={vi.fn()} />)

    expect(screen.getByRole("status")).toBeInTheDocument()
    expect(screen.getByText("Success Notification")).toBeInTheDocument()
    expect(screen.getByText("Operation completed successfully.")).toBeInTheDocument()
  })

  it("calls onDismiss when close button is clicked", async () => {
    vi.useRealTimers()
    const onDismiss = vi.fn()
    const user = userEvent.setup()

    const toast: ToastItem = {
      id: "toast-2",
      message: "Dismiss me manually",
      type: "info",
    }

    render(<Toast toast={toast} onDismiss={onDismiss} />)

    const dismissBtn = screen.getByRole("button", { name: /dismiss notification/i })
    await user.click(dismissBtn)
    expect(onDismiss).toHaveBeenCalledWith("toast-2")
  })

  it("automatically dismisses after custom duration", () => {
    const onDismiss = vi.fn()
    const toast: ToastItem = {
      id: "toast-3",
      message: "Auto dismiss test",
      type: "info",
      duration: 3000,
    }

    render(<Toast toast={toast} onDismiss={onDismiss} />)

    expect(onDismiss).not.toHaveBeenCalled()
    vi.advanceTimersByTime(3000)
    expect(onDismiss).toHaveBeenCalledWith("toast-3")
  })
})
