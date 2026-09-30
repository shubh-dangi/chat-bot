import "@testing-library/jest-dom"
import { afterEach } from "vitest"
import { cleanup } from "@testing-library/react"

// Automatically clean up rendered DOM after each test
afterEach(() => {
  cleanup()
  localStorage.clear()
})

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
})
