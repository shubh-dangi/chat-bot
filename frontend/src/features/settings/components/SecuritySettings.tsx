import { useState } from "react"
import { ShieldCheck, KeyRound } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { Switch } from "@/shared/components/ui/Switch"
import { useToast } from "@/shared/components/feedback/ToastContainer"

export function SecuritySettings() {
  const { success } = useToast()
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [twoFactor, setTwoFactor] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCurrentPass("")
      setNewPass("")
      success("Password updated successfully")
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Security & Authentication</h3>
        <p className="text-xs text-text-secondary mt-1">
          Manage your account password and security authentication preferences.
        </p>
      </div>

      <form onSubmit={handleUpdatePassword} className="p-5 rounded-xl border border-border-default bg-bg-primary space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
          <KeyRound className="w-3.5 h-3.5" />
          <span>Change Password</span>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">Current Password</label>
          <Input
            type="password"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">New Password</label>
          <Input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Min. 8 characters"
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="sm" isLoading={loading}>
            Update Password
          </Button>
        </div>
      </form>

      <div className="p-5 rounded-xl border border-border-default bg-bg-primary space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Multi-Factor Authentication</span>
        </div>

        <Switch
          checked={twoFactor}
          onChange={(val) => {
            setTwoFactor(val)
            success(val ? "2FA enabled" : "2FA disabled")
          }}
          label="Two-factor verification (2FA)"
          description="Require one-time email OTP verification on unrecognized devices."
        />
      </div>
    </div>
  )
}
