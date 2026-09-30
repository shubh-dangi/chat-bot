import { describe, it, expect, beforeEach } from "vitest"
import { tokenService } from "./tokenService"

describe("Auth — tokenService", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("returns null when no token is stored", () => {
    expect(tokenService.getToken()).toBeNull()
    expect(tokenService.hasToken()).toBe(false)
  })

  it("stores and retrieves auth token correctly", () => {
    tokenService.setToken("sample-jwt-token-123")
    expect(tokenService.getToken()).toBe("sample-jwt-token-123")
    expect(tokenService.hasToken()).toBe(true)
  })

  it("removes token upon logout", () => {
    tokenService.setToken("token-to-delete")
    tokenService.removeToken()
    expect(tokenService.getToken()).toBeNull()
    expect(tokenService.hasToken()).toBe(false)
  })
})
