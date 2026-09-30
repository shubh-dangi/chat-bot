import { AuthLayout } from "@/layouts/AuthLayout"
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Choose a secure password for your College AI account"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
