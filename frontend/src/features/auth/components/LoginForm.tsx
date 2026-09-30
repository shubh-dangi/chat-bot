import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { authService } from "../services/authService"
import { useAuthStore } from "@/stores/authStore"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import { ROUTES } from "@/shared/config/routes"

export function LoginForm() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { success, error: toastError } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!email.trim()) {
      errs.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address"
    }

    if (!password) {
      errs.password = "Password is required"
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters"
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const res = await authService.login({ email, password })
      setUser(res.user, res.token)
      success(`Welcome back, ${res.user.name}`)
      navigate(ROUTES.CHAT)
    } catch {
      const msg = "Invalid email or password. Please try again."
      setErrors({ general: msg })
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 min-w-0" noValidate>
      {errors.general && (
        <div className="p-3 rounded-md bg-status-error-surface border border-status-error-border text-xs text-status-error-text break-words" role="alert">
          {errors.general}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="login-email">
          College Email
        </label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-text-secondary" htmlFor="login-password">
            Password
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs text-text-muted hover:text-text-primary transition-colors inline-flex items-center min-h-[36px] -my-1.5 px-1 -ml-1 rounded"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={loading}>
        Sign In
      </Button>

      <div className="text-center pt-3 border-t border-border-default text-xs text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link to={ROUTES.REGISTER} className="font-medium text-text-primary underline hover:text-text-secondary inline-flex items-center min-h-[32px]">
          Register now
        </Link>
      </div>
    </form>
  )
}
