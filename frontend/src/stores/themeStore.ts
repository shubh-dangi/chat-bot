import { useState, useEffect } from "react"
import type { ThemeMode } from "@/shared/types"
import { STORAGE_KEYS } from "@/shared/utils/constants"
import { storage } from "@/shared/utils/storage"

type Listener = () => void
let currentTheme: ThemeMode = (storage.getString(STORAGE_KEYS.THEME, "system") as ThemeMode) || "system"
const listeners = new Set<Listener>()

function applyThemeToDOM(theme: ThemeMode) {
  const root = document.documentElement
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  if (isDark) {
    root.setAttribute("data-theme", "dark")
    root.classList.add("dark")
  } else {
    root.setAttribute("data-theme", "light")
    root.classList.remove("dark")
  }
}

// Initial application
if (typeof window !== "undefined") {
  applyThemeToDOM(currentTheme)

  // Listen to OS system color-scheme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  mediaQuery.addEventListener("change", () => {
    if (currentTheme === "system") {
      applyThemeToDOM("system")
      listeners.forEach((listener) => listener())
    }
  })
}

export const themeStore = {
  getTheme(): ThemeMode {
    return currentTheme
  },

  setTheme(newTheme: ThemeMode): void {
    currentTheme = newTheme
    storage.setString(STORAGE_KEYS.THEME, newTheme)
    applyThemeToDOM(newTheme)
    listeners.forEach((listener) => listener())
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useThemeStore() {
  const [theme, setThemeState] = useState<ThemeMode>(themeStore.getTheme())

  useEffect(() => {
    return themeStore.subscribe(() => {
      setThemeState(themeStore.getTheme())
    })
  }, [])

  return {
    theme,
    setTheme: themeStore.setTheme,
    isDark:
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  }
}
