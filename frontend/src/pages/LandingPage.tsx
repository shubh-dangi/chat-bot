import * as React from "react"
import { useSearchParams } from "react-router-dom"
import { LandingNavbar } from "./landing/LandingNavbar"
import { HeroSection } from "./landing/HeroSection"
import { ProductPreview } from "./landing/ProductPreview"
import { CoreFeaturesSection } from "./landing/CoreFeaturesSection"
import { HowItWorksSection } from "./landing/HowItWorksSection"
import { CollegeIntelligenceSection } from "./landing/CollegeIntelligenceSection"
import { StudentInfoSection } from "./landing/StudentInfoSection"
import { AIChatExperienceSection } from "./landing/AIChatExperienceSection"
import { SecurityPrivacySection } from "./landing/SecurityPrivacySection"
import { RoleBasedAccessSection } from "./landing/RoleBasedAccessSection"
import { WhyCollegeAISection } from "./landing/WhyCollegeAISection"
import { UseCasesSection } from "./landing/UseCasesSection"
import { FAQSection } from "./landing/FAQSection"
import { FinalCTASection } from "./landing/FinalCTASection"
import { LandingFooter } from "./landing/LandingFooter"
import { LegalDocumentModal } from "@/shared/components/legal/LegalDocumentModal"

/**
 * College AI — Production SaaS Marketing & Landing Page Experience.
 * Strict adherence to institutional typography, neutral solid surfaces,
 * zero gradients, zero unnecessary visual noise, and full keyboard/screen-reader accessibility.
 */
export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const legalParam = searchParams.get("legal")

  // Sync document title
  React.useEffect(() => {
    document.title = "College AI — Intelligent College Information & Conversation Platform"
  }, [])

  // Deep-link handlers for legal/informational modals (?legal=privacy, ?legal=terms, etc.)
  const handleOpenLegal = (docId: string) => {
    setSearchParams({ legal: docId }, { replace: true })
  }

  const handleCloseLegal = () => {
    // Clean up query param while preserving hash or other clean state
    const newParams = new URLSearchParams(searchParams)
    newParams.delete("legal")
    setSearchParams(newParams, { replace: true })
  }

  const handleSelectDoc = (docId: string) => {
    setSearchParams({ legal: docId }, { replace: true })
  }

  return (
    <div className="min-h-screen-dvh bg-bg-primary text-text-primary flex flex-col selection:bg-brand selection:text-brand-contrast">
      {/* 1. Responsive Navbar */}
      <LandingNavbar onOpenLegal={handleOpenLegal} />

      {/* Main Page Flow */}
      <main id="main-content" className="flex-1 w-full">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Product Preview */}
        <ProductPreview />

        {/* 4. Core Features */}
        <CoreFeaturesSection />

        {/* 5. How It Works */}
        <HowItWorksSection />

        {/* 6. College Intelligence */}
        <CollegeIntelligenceSection />

        {/* 7. Student Information */}
        <StudentInfoSection />

        {/* 8. AI Chat Experience */}
        <AIChatExperienceSection />

        {/* 9. Security & Privacy */}
        <SecurityPrivacySection />

        {/* 10. Role-Based Access */}
        <RoleBasedAccessSection />

        {/* 11. Why College AI */}
        <WhyCollegeAISection />

        {/* 12. Use Cases */}
        <UseCasesSection />

        {/* 13. FAQ */}
        <FAQSection />

        {/* 14. Final CTA */}
        <FinalCTASection />
      </main>

      {/* 15. Detailed Footer */}
      <LandingFooter onOpenLegal={handleOpenLegal} />

      {/* Legal & Informational Document Modal (Deep-linkable via ?legal=...) */}
      <LegalDocumentModal
        docId={legalParam}
        onClose={handleCloseLegal}
        onSelectDoc={handleSelectDoc}
      />
    </div>
  )
}
