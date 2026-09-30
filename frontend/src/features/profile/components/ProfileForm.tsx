import React, { useState } from "react"
import { Camera } from "lucide-react"
import { useAuthStore } from "@/stores/authStore"
import { Avatar } from "@/shared/components/ui/Avatar"
import { Input } from "@/shared/components/ui/Input"
import { Button } from "@/shared/components/ui/Button"
import { useToast } from "@/shared/components/feedback/ToastContainer"

export function ProfileForm() {
  const { user, updateProfile } = useAuthStore()
  const { success } = useToast()

  const [name, setName] = useState(user?.name || "")
  const [department, setDepartment] = useState(user?.department || "")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      updateProfile({ name, department })
      setLoading(false)
      success("Profile updated successfully")
    }, 400)
  }

  return (
    <div className="space-y-fluid-5 max-w-xl mx-auto min-w-0">
      {/* Avatar & Summary Card */}
      <div className="p-4 sm:p-6 rounded-xl border border-border-default bg-bg-elevated flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 shadow-xs min-w-0">
        <div className="relative group shrink-0">
          <Avatar src={user?.avatarUrl} fallback={user?.name} size="xl" />
          <button
            type="button"
            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white
                       opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
                       focus-visible:opacity-100 transition-opacity"
            onClick={() => {
              const url = prompt("Enter an avatar image URL:", user?.avatarUrl || "")
              if (url !== null) updateProfile({ avatarUrl: url })
            }}
            aria-label="Change avatar photo"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-text-primary break-words">{user?.name}</h2>
          <p className="text-xs text-text-secondary break-all">{user?.email}</p>
          <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-brand-surface text-brand-text capitalize border border-brand-border">
            {user?.role || "Student"}
          </div>
        </div>
      </div>

      {/* Editable Profile Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 rounded-xl border border-border-default bg-bg-primary space-y-4 shadow-xs min-w-0">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="prof-name">
            Full Name
          </label>
          <Input
            id="prof-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="prof-email">
            College Email (Read-only)
          </label>
          <Input
            id="prof-email"
            value={user?.email || ""}
            disabled
            className="bg-bg-tertiary text-text-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="prof-dept">
            Department / Program
          </label>
          <Input
            id="prof-dept"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Computer Science"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="prof-role">
            Institutional Role
          </label>
          <Input
            id="prof-role"
            value={user?.role?.toUpperCase() || "STUDENT"}
            disabled
            className="bg-bg-tertiary text-text-muted cursor-not-allowed font-mono text-xs"
          />
        </div>

        <div className="pt-2 flex flex-col-reverse xs:flex-row xs:justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={loading} className="w-full xs:w-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
