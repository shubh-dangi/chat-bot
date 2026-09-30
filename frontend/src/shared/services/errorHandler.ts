import type { ApiError } from "@/shared/types/api.types"
import axios from "axios"

export function parseApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data as { message?: string; detail?: string } | undefined
    const message = data?.detail || data?.message || error.message || "An unexpected error occurred"

    return {
      message,
      status,
      code: error.code,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: "A network error or unexpected issue occurred. Please check your connection.",
  }
}
