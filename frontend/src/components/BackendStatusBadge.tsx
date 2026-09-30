import React, { useEffect, useState } from "react"
import { apiService } from "@/services/api"
import { Activity, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"

export const BackendStatusBadge: React.FC = () => {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [lastChecked, setLastChecked] = useState<string>("")

  const checkConnection = async () => {
    setStatus("checking")
    try {
      const res = await apiService.getHealth()
      if (res.status === "ok") {
        setStatus("connected")
        setErrorMessage("")
      } else {
        setStatus("error")
        setErrorMessage("Unexpected status")
      }
    } catch (err: any) {
      setStatus("error")
      setErrorMessage(err.message || "Failed to connect to backend")
    } finally {
      setLastChecked(new Date().toLocaleTimeString())
    }
  }

  useEffect(() => {
    checkConnection()
    const interval = setInterval(checkConnection, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-border-default bg-bg-surface text-xs shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium text-text-primary">
          <Activity className="w-3.5 h-3.5 text-text-muted" />
          <span>FastAPI Backend</span>
        </div>
        <button
          onClick={checkConnection}
          title="Refresh health status"
          className="text-text-muted hover:text-text-primary transition-colors p-1 rounded hover:bg-bg-subtle"
        >
          <RefreshCw className={`w-3 h-3 ${status === "checking" ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-0.5">
        {status === "connected" && (
          <span className="flex items-center gap-1.5 text-status-success-text font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Connected (GET /api/health OK)
          </span>
        )}
        {status === "checking" && (
          <span className="flex items-center gap-1.5 text-status-warning-text font-medium">
            <span className="w-2 h-2 rounded-full bg-status-warning-text animate-solid-pulse" />
            Checking health...
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1.5 text-status-error-text font-medium" title={errorMessage}>
            <AlertTriangle className="w-3.5 h-3.5" />
            Backend Offline (Port 8000)
          </span>
        )}
      </div>
      {lastChecked && (
        <span className="text-[10px] text-text-muted">
          Checked: {lastChecked}
        </span>
      )}
    </div>
  )
}
