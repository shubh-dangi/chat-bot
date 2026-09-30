import { Header } from "@/shared/components/layout/Header"
import { PageContainer } from "@/shared/components/layout/PageContainer"
import { ProfileForm } from "@/features/profile/components/ProfileForm"

export default function ProfilePage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      <Header title="Your Profile" subtitle="Manage your institutional personal details" />
      <PageContainer>
        <ProfileForm />
      </PageContainer>
    </div>
  )
}
