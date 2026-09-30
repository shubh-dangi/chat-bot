import axios from "axios"
import type { HealthResponse, DatabaseHealthResponse } from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
})

export const apiService = {
  /**
   * Health check endpoint: GET /api/health
   */
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>("/api/health")
    return response.data
  },

  /**
   * Database check endpoint: GET /api/health/db
   */
  async getDatabaseHealth(): Promise<DatabaseHealthResponse> {
    const response = await apiClient.get<DatabaseHealthResponse>("/api/health/db")
    return response.data
  },
}
