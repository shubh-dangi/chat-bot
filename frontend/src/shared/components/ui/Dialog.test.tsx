import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Dialog } from "./Dialog"

describe("Dialog component", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <Dialog open={false} onClose={vi.fn()} title="Test Dialog">
        <p>Dialog Body</p>
      </Dialog>
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders modal dialog content and accessibility attributes when open is true", () => {
    render(
      <Dialog open={true} onClose={vi.fn()} title="Test Dialog" description="Test description">
        <p>Dialog Body</p>
      </Dialog>
    )

    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute("aria-modal", "true")
    expect(screen.getByText("Test Dialog")).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
    expect(screen.getByText("Dialog Body")).toBeInTheDocument()
  })

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Dialog open={true} onClose={onClose} title="Closable Dialog">
        <p>Content</p>
      </Dialog>
    )

    const closeBtn = screen.getByRole("button", { name: /close dialog/i })
    await user.click(closeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when pressing Escape key", async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()

    render(
      <Dialog open={true} onClose={onClose} title="Escape Test">
        <p>Press Esc to close</p>
      </Dialog>
    )

    await user.keyboard("{Escape}")
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it("locks and restores document body overflow", () => {
    const { unmount } = render(
      <Dialog open={true} onClose={vi.fn()} title="Scroll Lock Test">
        <p>Testing scroll lock</p>
      </Dialog>
    )

    expect(document.body.style.overflow).toBe("hidden")
    unmount()
    expect(document.body.style.overflow).toBe("")
  })
})
