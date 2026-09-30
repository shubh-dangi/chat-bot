import { AuthLayout } from "@/layouts/AuthLayout"
import { RegisterForm } from "@/features/auth/components/RegisterForm"

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register with your university email address"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
