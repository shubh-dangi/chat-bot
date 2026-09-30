import { describe, it, expect, beforeEach, vi } from "vitest"
import { authService } from "./authService"
import { tokenService } from "@/shared/services/tokenService"
import { apiClient } from "@/shared/services/apiClient"

describe("Auth Service — Authentication Client Logic", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it("successfully logs in with valid backend response and stores JWT token", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      user: {
        id: "usr-42",
        name: "Test Student",
        email: "student@college.edu",
        role: "student",
        department: "Computer Science",
      },
      access_token: "mock-jwt-token-xyz",
      token_type: "bearer",
    })

    const res = await authService.login({
      email: "student@college.edu",
      password: "password123",
    })

    expect(res.user.email).toBe("student@college.edu")
    expect(res.token).toBe("mock-jwt-token-xyz")
    expect(tokenService.getToken()).toBe("mock-jwt-token-xyz")
  })

  it("successfully registers new user and stores auth token", async () => {
    vi.spyOn(apiClient, "post").mockResolvedValueOnce({
      user: {
        id: "usr-100",
        name: "New Student",
        email: "new.student@college.edu",
        role: "student",
        department: "Physics",
      },
      access_token: "new-token-abc",
      token_type: "bearer",
    })

    const res = await authService.register({
      name: "New Student",
      email: "new.student@college.edu",
      password: "SecurePassword123!",
      department: "Physics",
    })

    expect(res.user.name).toBe("New Student")
    expect(res.token).toBe("new-token-abc")
    expect(tokenService.getToken()).toBe("new-token-abc")
  })

  it("removes token on logout", async () => {
    tokenService.setToken("active-token")
    expect(tokenService.hasToken()).toBe(true)

    await authService.logout()
    expect(tokenService.hasToken()).toBe(false)
    expect(tokenService.getToken()).toBeNull()
  })
})
