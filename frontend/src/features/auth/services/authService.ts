import { apiClient } from "@/shared/services/apiClient"
import type { LoginCredentials, RegisterCredentials, AuthResponse } from "../types/auth.types"
import type { User } from "@/shared/types"

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Future backend endpoint: return await apiClient.post<AuthResponse>("/auth/login", credentials)
      await new Promise((r) => setTimeout(r, 600))
      const mockUser: User = {
        id: "usr-" + Date.now(),
        name: credentials.email.split("@")[0].replace(".", " "),
        email: credentials.email,
        role: credentials.email.includes("admin") ? "admin" : "student",
        department: "Computer Science",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80",
        createdAt: new Date().toISOString(),
      }
      return {
        user: mockUser,
        token: "mock-jwt-token-" + Date.now(),
      }
    } catch (err) {
      throw err
    }
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Future backend endpoint: return await apiClient.post<AuthResponse>("/auth/register", credentials)
      await new Promise((r) => setTimeout(r, 700))
      const mockUser: User = {
        id: "usr-" + Date.now(),
        name: credentials.name,
        email: credentials.email,
        role: "student",
        department: credentials.department || "General",
        createdAt: new Date().toISOString(),
      }
      return {
        user: mockUser,
        token: "mock-jwt-token-" + Date.now(),
      }
    } catch (err) {
      throw err
    }
  },

  async requestPasswordReset(email: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 500))
    return true
  },

  async resetPassword(password: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 500))
    return true
  },
}
