export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage quota exceeded or disabled
    }
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // Safe fallback
    }
  },

  getString(key: string, defaultValue = ""): string {
    try {
      return localStorage.getItem(key) || defaultValue
    } catch {
      return defaultValue
    }
  },

  setString(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Safe fallback
    }
  },
}
