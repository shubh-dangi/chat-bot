import { AuthLayout } from "@/layouts/AuthLayout"
import { LoginForm } from "@/features/auth/components/LoginForm"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your institutional email to access your assistant"
    >
      <LoginForm />
    </AuthLayout>
  )
}
