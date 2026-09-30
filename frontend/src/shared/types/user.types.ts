export type UserRole = "student" | "faculty" | "admin" | "staff"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  avatarUrl?: string
  createdAt?: string
}

export interface UserSession {
  user: User
  token: string
  expiresAt: number
}
