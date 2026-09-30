import { SettingsLayout } from "@/layouts/SettingsLayout"
import { AppearanceSettings } from "@/features/settings/components/AppearanceSettings"
import { AccountSettings } from "@/features/settings/components/AccountSettings"
import { SecuritySettings } from "@/features/settings/components/SecuritySettings"
import { PreferencesSettings } from "@/features/settings/components/PreferencesSettings"

export default function SettingsPage() {
  return (
    <SettingsLayout>
      {(activeTab) => {
        switch (activeTab) {
          case "account":
            return <AccountSettings />
          case "security":
            return <SecuritySettings />
          case "preferences":
            return <PreferencesSettings />
          case "appearance":
          default:
            return <AppearanceSettings />
        }
      }}
    </SettingsLayout>
  )
}
