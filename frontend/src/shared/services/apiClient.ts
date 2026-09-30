import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { tokenService } from "./tokenService"
import { parseApiError } from "./errorHandler"

const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || ""

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Attach JWT Token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(parseApiError(error))
)

// Response Interceptor: Parse errors cleanly
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized handling can be connected here
    return Promise.reject(parseApiError(error))
  }
)

export const apiClient = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get<T>(url, config).then((res) => res.data)
  },

  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.post<T>(url, data, config).then((res) => res.data)
  },

  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.put<T>(url, data, config).then((res) => res.data)
  },

  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.patch<T>(url, data, config).then((res) => res.data)
  },

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete<T>(url, config).then((res) => res.data)
  },
}
