export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T | null
  meta?: Record<string, any> // optional meta info (pagination, etc.)
}

export interface ApiErrorResponse {
  success: false
  message: string
  data: null
  meta?: Record<string, any>
}
