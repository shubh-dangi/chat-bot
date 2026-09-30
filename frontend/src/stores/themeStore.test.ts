import { describe, it, expect, beforeEach, vi } from "vitest"
import { themeStore } from "./themeStore"
import { STORAGE_KEYS } from "@/shared/utils/constants"

describe("Store — themeStore", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute("data-theme")
    document.documentElement.classList.remove("dark")
  })

  it("defaults to system or stored theme", () => {
    const current = themeStore.getTheme()
    expect(["light", "dark", "system"]).toContain(current)
  })

  it("updates theme to dark and sets data-theme attribute on documentElement", () => {
    themeStore.setTheme("dark")
    expect(themeStore.getTheme()).toBe("dark")
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe("dark")
  })

  it("updates theme to light and removes dark class", () => {
    themeStore.setTheme("light")
    expect(themeStore.getTheme()).toBe("light")
    expect(document.documentElement.getAttribute("data-theme")).toBe("light")
    expect(document.documentElement.classList.contains("dark")).toBe(false)
    expect(localStorage.getItem(STORAGE_KEYS.THEME)).toBe("light")
  })

  it("notifies subscribers when theme changes", () => {
    const listener = vi.fn()
    const unsubscribe = themeStore.subscribe(listener)

    themeStore.setTheme("dark")
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    themeStore.setTheme("light")
    expect(listener).toHaveBeenCalledTimes(1) // Not called again after unsubscribe
  })
})
