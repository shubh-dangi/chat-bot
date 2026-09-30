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
    <div className="flex flex-col gap-1 p-3 rounded-lg border border-border bg-card/60 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" />
          <span>FastAPI Backend</span>
        </div>
        <button
          onClick={checkConnection}
          title="Refresh health status"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${status === "checking" ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-1">
        {status === "connected" && (
          <span className="flex items-center gap-1 text-emerald-500 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Connected (GET /api/health OK)
          </span>
        )}
        {status === "checking" && (
          <span className="flex items-center gap-1 text-amber-500">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Checking health...
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-rose-500" title={errorMessage}>
            <AlertTriangle className="w-3.5 h-3.5" />
            Backend Offline (Port 8000)
          </span>
        )}
      </div>
      {lastChecked && (
        <span className="text-[10px] text-muted-foreground">
          Checked: {lastChecked}
        </span>
      )}
    </div>
  )
}
