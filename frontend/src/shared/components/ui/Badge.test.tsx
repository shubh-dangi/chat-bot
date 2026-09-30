import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Badge } from "./Badge"

describe("UI Component — Badge", () => {
  it("renders with default props", () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText("Default Badge")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("bg-bg-secondary")
  })

  it("renders different variants properly", () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
    expect(screen.getByText("Secondary")).toHaveClass("bg-bg-tertiary")

    rerender(<Badge variant="outline">Outline</Badge>)
    expect(screen.getByText("Outline")).toHaveClass("bg-transparent")

    rerender(<Badge variant="success">Success</Badge>)
    expect(screen.getByText("Success")).toHaveClass("border-border-strong")
  })

  it("applies sizing classes correctly", () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText("Small")).toHaveClass("text-[11px]")

    rerender(<Badge size="md">Medium</Badge>)
    expect(screen.getByText("Medium")).toHaveClass("text-xs")
  })
})
