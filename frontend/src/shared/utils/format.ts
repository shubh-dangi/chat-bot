/**
 * Format timestamp into standard readable time (e.g., "10:42 AM")
 */
export function formatTime(dateInput: string | Date | number): string {
  try {
    const d = new Date(dateInput)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } catch {
    return ""
  }
}

/**
 * Format date into friendly group key (Today, Yesterday, Previous 7 Days, etc.)
 */
export function getRelativeDateGroup(dateInput: string | Date | number): string {
  try {
    const date = new Date(dateInput)
    const now = new Date()

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000
    const startOf7Days = startOfToday - 7 * 24 * 60 * 60 * 1000
    const startOf30Days = startOfToday - 30 * 24 * 60 * 60 * 1000

    const time = date.getTime()
    if (time >= startOfToday) return "Today"
    if (time >= startOfYesterday) return "Yesterday"
    if (time >= startOf7Days) return "Previous 7 Days"
    if (time >= startOf30Days) return "Previous 30 Days"
    return "Older"
  } catch {
    return "Older"
  }
}

/**
 * Mask sensitive string revealing only last N characters (e.g., "***-**-1234")
 */
export function maskSensitiveValue(value: string, visibleEndCount = 4): string {
  if (!value) return ""
  if (value.length <= visibleEndCount) return "•".repeat(value.length)
  const maskedLength = value.length - visibleEndCount
  return "•".repeat(maskedLength) + value.slice(-visibleEndCount)
}

/**
 * Truncate long text cleanly
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "..."
}
