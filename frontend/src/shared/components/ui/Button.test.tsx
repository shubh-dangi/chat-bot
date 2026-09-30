import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Button } from "./Button"

describe("UI Component — Button", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click Me</Button>)
    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "false")
  })

  it("handles click events", () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Clickable</Button>)
    const button = screen.getByRole("button", { name: /clickable/i })
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("disables the button when disabled prop is true", () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
    const button = screen.getByRole("button", { name: /disabled button/i })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("shows loading spinner and disables interaction when isLoading is true", () => {
    const handleClick = vi.fn()
    render(<Button isLoading onClick={handleClick}>Submitting</Button>)
    const button = screen.getByRole("button", { name: /submitting/i })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("renders with different variants without throwing", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-brand")

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-bg-elevated")

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-transparent")

    rerender(<Button variant="danger">Danger</Button>)
    expect(screen.getByRole("button")).toHaveClass("bg-bg-secondary")
  })

  it("applies fullWidth style correctly", () => {
    render(<Button fullWidth>Full Width</Button>)
    expect(screen.getByRole("button")).toHaveClass("w-full")
  })
})
