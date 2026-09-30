export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  status: number
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: Record<string, unknown>
}
