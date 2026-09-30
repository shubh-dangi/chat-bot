import { useState, useEffect } from "react"

interface UiState {
  mobileNavOpen: boolean
  sidebarCollapsed: boolean
  searchQuery: string
}

let state: UiState = {
  mobileNavOpen: false,
  sidebarCollapsed: typeof window !== "undefined" ? localStorage.getItem("sidebar_collapsed") === "true" : false,
  searchQuery: "",
}

type Listener = () => void
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l())
}

export const uiStore = {
  getState() {
    return state
  },

  setMobileNavOpen(open: boolean) {
    state.mobileNavOpen = open
    notify()
  },

  toggleMobileNav() {
    state.mobileNavOpen = !state.mobileNavOpen
    notify()
  },

  setSidebarCollapsed(collapsed: boolean) {
    state.sidebarCollapsed = collapsed
    try {
      localStorage.setItem("sidebar_collapsed", String(collapsed))
    } catch {
      // safe fallback
    }
    notify()
  },

  toggleSidebar() {
    this.setSidebarCollapsed(!state.sidebarCollapsed)
  },

  setSearchQuery(q: string) {
    state.searchQuery = q
    notify()
  },

  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function useUiStore() {
  const [uiState, setUiState] = useState<UiState>(uiStore.getState())

  useEffect(() => {
    return uiStore.subscribe(() => {
      setUiState({ ...uiStore.getState() })
    })
  }, [])

  return {
    ...uiState,
    setMobileNavOpen: uiStore.setMobileNavOpen,
    toggleMobileNav: uiStore.toggleMobileNav,
    setSidebarCollapsed: uiStore.setSidebarCollapsed,
    toggleSidebar: uiStore.toggleSidebar.bind(uiStore),
    setSearchQuery: uiStore.setSearchQuery,
  }
}
