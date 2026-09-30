import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { authService } from "../services/authService"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import { ROUTES } from "@/shared/config/routes"

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const { success } = useToast()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError("")
    try {
      await authService.resetPassword(password)
      success("Password reset successfully. Redirecting...")
      setTimeout(() => navigate(ROUTES.LOGIN), 1500)
    } catch {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="p-3 rounded-md bg-status-error-surface border border-status-error-border text-xs text-status-error-text">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="new-pass">
          New Password
        </label>
        <Input
          id="new-pass"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="confirm-new-pass">
          Confirm New Password
        </label>
        <Input
          id="confirm-new-pass"
          type="password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full" isLoading={loading}>
        Reset Password
      </Button>

      <div className="text-center pt-3 border-t border-border-default text-xs">
        <Link to={ROUTES.LOGIN} className="text-text-secondary hover:text-text-primary transition-colors">
          Back to login
        </Link>
      </div>
    </form>
  )
}
