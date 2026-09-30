import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import LandingPage from "./LandingPage"

describe("LandingPage Component", () => {
  it("renders page headline, CTAs, and updates document title", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
    )

    expect(document.title).toContain("College AI")
    // Verify hero text
    expect(screen.getByText(/College intelligence,/i)).toBeInTheDocument()
    // Verify CTA buttons exist
    const getStartedBtns = screen.getAllByRole("link", { name: /get started/i })
    expect(getStartedBtns.length).toBeGreaterThan(0)
  })

  it("renders all key architectural sections with anchor identifiers", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
    )

    expect(container.querySelector("#features")).toBeInTheDocument()
    expect(container.querySelector("#how-it-works")).toBeInTheDocument()
    expect(container.querySelector("#security")).toBeInTheDocument()
    expect(container.querySelector("#faq")).toBeInTheDocument()
  })

  it("opens legal document modal when deep-linked with ?legal=privacy", () => {
    render(
      <MemoryRouter initialEntries={["/?legal=privacy"]}>
        <LandingPage />
      </MemoryRouter>
    )

    // Verify modal is open and shows Privacy Policy heading
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: /privacy policy/i })).toBeInTheDocument()
  })

  it("closes legal modal and removes query parameter when close button is clicked", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/?legal=terms"]}>
        <LandingPage />
      </MemoryRouter>
    )

    const closeBtn = screen.getByRole("button", { name: /close modal/i })
    expect(closeBtn).toBeInTheDocument()
    await user.click(closeBtn)

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
})
