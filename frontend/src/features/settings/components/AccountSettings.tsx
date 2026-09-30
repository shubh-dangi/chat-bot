import { useState } from "react"
import { useAuthStore } from "@/stores/authStore"
import { Button } from "@/shared/components/ui/Button"
import { Input } from "@/shared/components/ui/Input"
import { Dialog } from "@/shared/components/ui/Dialog"
import { useToast } from "@/shared/components/feedback/ToastContainer"

export function AccountSettings() {
  const { user, updateProfile, logout } = useAuthStore()
  const { success } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleSave = () => {
    updateProfile({ name })
    success("Account details updated")
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(false)
    logout()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-text-primary">Account Details</h3>
        <p className="text-xs text-text-secondary mt-1">
          Review your institution email address and profile identifiers.
        </p>
      </div>

      <div className="p-5 rounded-xl border border-border-default bg-bg-primary space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Display Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">Official Email</label>
          <Input value={user?.email || ""} disabled className="bg-bg-tertiary cursor-not-allowed text-text-muted" />
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 rounded-xl border border-status-error-border bg-status-error-surface/40 space-y-3">
        <h4 className="text-sm font-semibold text-status-error-text">Danger Zone</h4>
        <p className="text-xs text-text-secondary leading-relaxed">
          Deleting your local account session clears your saved conversations and settings from this browser.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
        >
          Reset Local Account Data
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Reset Account Data"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-text-secondary">
            Are you sure you want to clear your local session? You will be signed out immediately.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
              Confirm Reset
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
