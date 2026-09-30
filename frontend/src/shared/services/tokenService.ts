import { STORAGE_KEYS } from "@/shared/utils/constants"
import { storage } from "@/shared/utils/storage"

export const tokenService = {
  getToken(): string | null {
    return storage.getString(STORAGE_KEYS.AUTH_TOKEN, "") || null
  },

  setToken(token: string): void {
    storage.setString(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  removeToken(): void {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN)
  },

  hasToken(): boolean {
    return Boolean(this.getToken())
  },
}
