export interface Message {
  id: string
  sender: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  title: string
  createdAt: string
}

export interface HealthResponse {
  status: string
}

export interface DatabaseHealthResponse {
  status: string
  database_connected: boolean
  database_message: string
  project_name: string
  environment: string
}
