import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { LegalDocumentModal } from "./LegalDocumentModal"

describe("Legal & Compliance — LegalDocumentModal", () => {
  it("renders nothing when docId is null", () => {
    const { container } = render(
      <LegalDocumentModal docId={null} onClose={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders privacy policy modal when docId is 'privacy'", () => {
    render(<LegalDocumentModal docId="privacy" onClose={vi.fn()} />)
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument()
    expect(screen.getByText(/Institutional Commitment/i)).toBeInTheDocument()
  })

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn()
    render(<LegalDocumentModal docId="terms" onClose={handleClose} />)
    const closeBtn = screen.getByRole("button", { name: /close modal/i })
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it("calls onClose when Escape key is pressed", () => {
    const handleClose = vi.fn()
    render(<LegalDocumentModal docId="privacy" onClose={handleClose} />)
    fireEvent.keyDown(document, { key: "Escape" })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it("calls onSelectDoc when a document tab is clicked", () => {
    const handleSelectDoc = vi.fn()
    render(
      <LegalDocumentModal
        docId="privacy"
        onClose={vi.fn()}
        onSelectDoc={handleSelectDoc}
      />
    )
    const termsTab = screen.getByRole("button", { name: /terms of service/i })
    fireEvent.click(termsTab)
    expect(handleSelectDoc).toHaveBeenCalledWith("terms")
  })

  it("renders data-policy when docId is 'data-policy'", () => {
    render(<LegalDocumentModal docId="data-policy" onClose={vi.fn()} />)
    expect(screen.getByRole("heading", { name: /Institutional Data Governance Policy/i })).toBeInTheDocument()
    expect(screen.getByText(/Data Classification Framework/i)).toBeInTheDocument()
  })
})
