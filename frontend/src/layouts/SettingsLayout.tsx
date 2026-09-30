import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { Palette, User, ShieldCheck, Sliders } from "lucide-react"
import { Header } from "@/shared/components/layout/Header"
import { PageContainer } from "@/shared/components/layout/PageContainer"
import { Tabs, type TabItem } from "@/shared/components/ui/Tabs"

export interface SettingsLayoutProps {
  children: (activeTab: string) => React.ReactNode
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") || "appearance"

  const tabs: TabItem[] = [
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
    { id: "account", label: "Account", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "preferences", label: "Preferences", icon: <Sliders className="w-4 h-4" /> },
  ]

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId })
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header title="Settings" subtitle="Manage your account preferences and theme settings" />
      <PageContainer className="max-w-3xl">
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        </div>
        <div className="mt-6">{children(activeTab)}</div>
      </PageContainer>
    </div>
  )
}
