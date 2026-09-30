import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { authService } from "../services/authService"
import { useAuthStore } from "@/stores/authStore"
import { useToast } from "@/shared/components/feedback/ToastContainer"
import { ROUTES } from "@/shared/config/routes"

export function RegisterForm() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const { success, error: toastError } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!name.trim()) errs.name = "Full name is required"
    if (!email.trim()) {
      errs.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Please enter a valid email address"
    }
    if (!password) {
      errs.password = "Password is required"
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters"
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match"
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
      const res = await authService.register({ name, email, password, department })
      setUser(res.user, res.token)
      success("Account created successfully")
      navigate(ROUTES.CHAT)
    } catch {
      const msg = "Unable to create account. Please try again."
      setErrors({ general: msg })
      toastError(msg)
    } finally {
      setLoading(false)
    }
  }

  // Password strength estimate
  const getPasswordStrength = () => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strength = getPasswordStrength()

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 min-w-0" noValidate>
      {errors.general && (
        <div className="p-3 rounded-md bg-status-error-surface border border-status-error-border text-xs text-status-error-text break-words" role="alert">
          {errors.general}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="reg-name">
          Full Name
        </label>
        <Input
          id="reg-name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="reg-email">
          College Email
        </label>
        <Input
          id="reg-email"
          type="email"
          placeholder="you@college.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="reg-dept">
          Department / Course
        </label>
        <Input
          id="reg-dept"
          placeholder="e.g. Computer Science, BCA, B.Tech"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="reg-pass">
          Password
        </label>
        <Input
          id="reg-pass"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={loading}
        />
        {password && (
          <div className="mt-1.5 flex items-center gap-1.5">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  strength >= level
                    ? strength >= 3
                      ? "bg-status-success-text"
                      : "bg-status-warning-text"
                    : "bg-bg-tertiary"
                }`}
              />
            ))}
            <span className="text-[10px] text-text-muted ml-1 shrink-0">
              {strength <= 1 ? "Weak" : strength <= 3 ? "Good" : "Strong"}
            </span>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-text-secondary mb-1" htmlFor="reg-confirm">
          Confirm Password
        </label>
        <Input
          id="reg-confirm"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={loading}
        />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full mt-2" isLoading={loading}>
        Create Account
      </Button>

      <div className="text-center pt-3 border-t border-border-default text-xs text-text-secondary">
        Already have an account?{" "}
        <Link to={ROUTES.LOGIN} className="font-medium text-text-primary underline hover:text-text-secondary inline-flex items-center min-h-[32px]">
          Log in
        </Link>
      </div>
    </form>
  )
}
