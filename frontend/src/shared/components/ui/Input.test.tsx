import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Input } from "./Input"

describe("UI Component — Input", () => {
  it("renders input field properly", () => {
    render(<Input placeholder="Enter username" />)
    const input = screen.getByPlaceholderText("Enter username")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "text")
  })

  it("handles text input change events", () => {
    const handleChange = vi.fn()
    render(<Input placeholder="Type here" onChange={handleChange} />)
    const input = screen.getByPlaceholderText("Type here")
    fireEvent.change(input, { target: { value: "test query" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect((input as HTMLInputElement).value).toBe("test query")
  })

  it("displays error message and sets aria-invalid when error prop is provided", () => {
    render(<Input placeholder="Email" error="Invalid institutional email" />)
    const input = screen.getByPlaceholderText("Email")
    expect(input).toHaveAttribute("aria-invalid", "true")
    const errorAlert = screen.getByRole("alert")
    expect(errorAlert).toHaveTextContent("Invalid institutional email")
  })

  it("renders disabled state correctly", () => {
    render(<Input placeholder="Disabled" disabled />)
    const input = screen.getByPlaceholderText("Disabled")
    expect(input).toBeDisabled()
  })

  it("renders leftIcon and rightIcon properly", () => {
    render(
      <Input
        placeholder="Search"
        leftIcon={<span data-testid="search-icon">🔍</span>}
        rightIcon={<span data-testid="clear-icon">✖</span>}
      />
    )
    expect(screen.getByTestId("search-icon")).toBeInTheDocument()
    expect(screen.getByTestId("clear-icon")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Search")).toHaveClass("pl-9 pr-9")
  })
})
