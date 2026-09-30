import { useState, useEffect } from "react"

interface UiState {
  mobileNavOpen: boolean
  sidebarCollapsed: boolean
}

let state: UiState = {
  mobileNavOpen: false,
  sidebarCollapsed: false,
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
  }
}
