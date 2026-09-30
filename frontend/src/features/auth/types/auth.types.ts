import type { User } from "@/shared/types"

export interface LoginCredentials {
  email: string
  password?: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password?: string
  confirmPassword?: string
  department?: string
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
}
