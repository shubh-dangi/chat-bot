import { Header } from "@/shared/components/layout/Header"
import { PageContainer } from "@/shared/components/layout/PageContainer"
import { PageTransition } from "@/shared/components/motion/PageTransition"
import { ProfileForm } from "@/features/profile/components/ProfileForm"

export default function ProfilePage() {
  return (
    <PageTransition>
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header title="Your Profile" subtitle="Manage your institutional personal details" />
        <PageContainer>
          <ProfileForm />
        </PageContainer>
      </div>
    </PageTransition>
  )
}
