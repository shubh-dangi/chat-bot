import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { authService } from "../services/authService"
import { ROUTES } from "@/shared/config/routes"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")
    try {
      await authService.requestPasswordReset(email)
      setSent(true)
    } catch {
      setError("Failed to process request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-12 h-12 rounded-full bg-status-success-surface border border-status-success-border flex items-center justify-center text-status-success-text mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">Check your email</h3>
          <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
            We sent a password reset link to <span className="font-semibold text-text-primary">{email}</span>.
          </p>
        </div>
        <div className="pt-2">
          <Link to={ROUTES.LOGIN}>
            <Button variant="secondary" size="sm" className="w-full">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error && (
        <div className="p-3 rounded-md bg-status-error-surface border border-status-error-border text-xs text-status-error-text">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="forgot-email">
          Your College Email
        </label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          disabled={loading}
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full" isLoading={loading}>
        Send Reset Link
      </Button>

      <div className="text-center pt-3 border-t border-border-default text-xs">
        <Link to={ROUTES.LOGIN} className="text-text-secondary hover:text-text-primary transition-colors">
          Return to login
        </Link>
      </div>
    </form>
  )
}
