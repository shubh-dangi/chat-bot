import { useState, useEffect } from "react"
import type { User } from "@/shared/types"
import { STORAGE_KEYS } from "@/shared/utils/constants"
import { storage } from "@/shared/utils/storage"
import { tokenService } from "@/shared/services/tokenService"

export const DEFAULT_DEMO_USER: User = {
  id: "user-1",
  name: "Jane Smith",
  email: "jane.smith@college.edu",
  role: "student",
  department: "Computer Science",
  avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80",
  createdAt: "2024-08-15T09:00:00Z",
}

type Listener = () => void
let currentUser: User | null = storage.get<User | null>(STORAGE_KEYS.USER, DEFAULT_DEMO_USER)
const listeners = new Set<Listener>()

export const authStore = {
  getUser(): User | null {
    return currentUser
  },

  isAuthenticated(): boolean {
    return currentUser !== null
  },

  setUser(user: User | null, token?: string): void {
    currentUser = user
    if (user) {
      storage.set(STORAGE_KEYS.USER, user)
      if (token) tokenService.setToken(token)
    } else {
      storage.remove(STORAGE_KEYS.USER)
      tokenService.removeToken()
    }
    listeners.forEach((l) => l())
  },

  updateProfile(partial: Partial<User>): void {
    if (!currentUser) return
    currentUser = { ...currentUser, ...partial }
    storage.set(STORAGE_KEYS.USER, currentUser)
    listeners.forEach((l) => l())
  },

  logout(): void {
    this.setUser(null)
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useAuthStore() {
  const [user, setUser] = useState<User | null>(authStore.getUser())

  useEffect(() => {
    return authStore.subscribe(() => {
      setUser(authStore.getUser())
    })
  }, [])

  return {
    user,
    isAuthenticated: user !== null,
    setUser: authStore.setUser,
    updateProfile: authStore.updateProfile,
    logout: authStore.logout,
  }
}
