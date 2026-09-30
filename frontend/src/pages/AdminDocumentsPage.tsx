import { DocumentManager } from "@/features/admin/components/DocumentManager"
import { PageTransition } from "@/shared/components/motion/PageTransition"

export default function AdminDocumentsPage() {
  return (
    <PageTransition>
      <DocumentManager />
    </PageTransition>
  )
}
