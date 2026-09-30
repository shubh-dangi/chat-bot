export interface LegalDoc {
  id: "privacy" | "terms" | "cookies" | "security" | "accessibility" | "about" | "contact" | "data-policy"
  title: string
  subtitle: string
  lastUpdated: string
  sections: {
    heading: string
    content: string | string[]
  }[]
}

export const LEGAL_DOCUMENTS: Record<string, LegalDoc> = {
  privacy: {
    id: "privacy",
    title: "Privacy Policy",
    subtitle: "How College AI protects, handles, and limits the processing of institutional and student data.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. Scope & Institutional Commitment",
        content: [
          "College AI operates as an institutional intelligence and retrieval platform for higher education campuses. We are committed to safeguarding student education records, academic communications, and institutional documents.",
          "This policy outlines how data is ingested, processed, and protected in compliance with institutional policies and applicable education privacy statutes including the Family Educational Rights and Privacy Act (FERPA).",
        ],
      },
      {
        heading: "2. Information We Process",
        content: [
          "Directory Information: Student names, institutional email addresses, enrolled department, academic program, and semester cohort as provided by the university registry.",
          "Restricted Student Records: Cumulative GPAs, internal assessment marks, and advisor notes are strictly classified as confidential records subject to role-based access control and FERPA masking.",
          "Campus Documents: Official course syllabi, examination circulars, fee schedules, hostel regulations, and campus bylaws uploaded by verified faculty or administrators.",
          "Conversational Queries: User queries submitted to the assistant to generate contextual academic answers. Queries are never used to train public foundation models.",
        ],
      },
      {
        heading: "3. Data Isolation & Security Architecture",
        content: [
          "Multi-tenant isolation is enforced at the database layer via PostgreSQL Row-Level Security (RLS). Every query executes in the authenticated context of the requesting user.",
          "Audit Logging: All access to restricted student records, administrative document uploads, and shared discussion tokens are recorded with immutable timestamps and actor IDs.",
        ],
      },
      {
        heading: "4. Data Sharing & Third Parties",
        content: [
          "We do not sell, rent, or monetize student or institutional data.",
          "Shared Conversations: When a user generates a shareable conversation link, only the explicitly selected dialogue messages are rendered in read-only format. Confidential student attributes remain excluded.",
        ],
      },
      {
        heading: "5. Data Retention & Deletion",
        content: [
          "Users may delete personal chat conversations at any time. Deleted conversations are purged permanently from active indexes.",
          "Students may request an audit or deletion of their directory profile in accordance with their university registrar guidelines.",
        ],
      },
    ],
  },
  terms: {
    id: "terms",
    title: "Terms of Service",
    subtitle: "Terms and conditions governing the use of the College AI institutional intelligence platform.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content: [
          "By accessing or using College AI, you agree to be bound by these Terms of Service and all applicable college regulations, codes of conduct, and university policies.",
          "If you are using College AI on behalf of an educational institution, you represent that you have administrative authority to bind that institution to these terms.",
        ],
      },
      {
        heading: "2. Authorized Academic Use",
        content: [
          "College AI is provided exclusively for educational, academic guidance, and legitimate campus administration purposes.",
          "Users agree not to: (a) attempt prompt injection or jailbreak attacks against the intelligence engine; (b) scrape or mass-extract restricted student records; (c) impersonate other students, faculty members, or administrators; (d) upload malicious documents or unauthorized copyrighted materials.",
        ],
      },
      {
        heading: "3. Accuracy of Institutional Grounding",
        content: [
          "College AI generates responses grounded in official university documents. However, AI-assisted summaries should be verified against official university circulars for critical academic deadlines, grade appeals, or legal matters.",
          "In any conflict between an AI summary and an official signed university circular, the official signed circular governs.",
        ],
      },
      {
        heading: "4. Account Security",
        content: [
          "Users are responsible for safeguarding their institutional authentication credentials. Any activity conducted under an authenticated session is the responsibility of the account holder.",
          "Administrators reserve the right to suspend or revoke access for any user violating academic integrity codes or system security protocols.",
        ],
      },
      {
        heading: "5. Limitation of Liability",
        content: [
          "College AI and its developers provide the platform 'as is'. To the extent permitted by law, College AI shall not be liable for indirect, incidental, or consequential damages resulting from service interruptions or data entry discrepancies.",
        ],
      },
    ],
  },
  cookies: {
    id: "cookies",
    title: "Cookie Policy",
    subtitle: "Information about how session tokens and local preferences are maintained.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. Strictly Necessary Storage",
        content: [
          "College AI uses essential session storage and HTTP-only authentication cookies exclusively to maintain your secure authenticated session with Supabase Auth.",
          "These tokens are mandatory for verifying identity, role-based authorization, and preventing Cross-Site Request Forgery (CSRF).",
        ],
      },
      {
        heading: "2. Preference Storage (Local)",
        content: [
          "Theme Settings: We store your selected theme preference ('light', 'dark', or 'system') in browser localStorage so your visual interface persists across page loads.",
          "No Advertising Trackers: We do not use third-party behavioral cookies, tracking pixels, or cross-site advertising technologies.",
        ],
      },
      {
        heading: "3. Managing Your Preferences",
        content: [
          "Because we only utilize strictly necessary authentication tokens and local user interface preferences, disabling these in your browser will prevent successful login and session persistence.",
        ],
      },
    ],
  },
  security: {
    id: "security",
    title: "Security & Governance Overview",
    subtitle: "Comprehensive overview of defensive controls, data protection, and FERPA isolation.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. Defense-in-Depth Architecture",
        content: [
          "College AI implements security across multiple independent layers: TLS 1.3 transit encryption, strict Content Security Policy, rate limiting, token validation middleware, and database-level Row-Level Security.",
          "We adhere to the principle of least privilege: authenticated clients never interact directly with administrative tables or bypass server-side authorization checks.",
        ],
      },
      {
        heading: "2. Role-Based Access Control (RBAC)",
        content: [
          "Student Role: Can view public campus documents, initiate personal chats, manage personal profile, and view own verified student records.",
          "Teacher / Advisor Role: Can access assigned cohort student rosters, view academic progress indicators, and upload departmental coursework documents.",
          "Admin Role: Full governance over document ingestion, student directory provisioning, audit log inspection, and role assignments.",
        ],
      },
      {
        heading: "3. FERPA & PII Protection",
        content: [
          "Confidential student metrics (such as cumulative grade points, residential phone numbers, and emergency contact details) are subject to automated data masking.",
          "Audit logging records every search query and document inspection to protect student privacy and enable accountability.",
        ],
      },
      {
        heading: "4. Vulnerability Disclosure",
        content: [
          "We welcome responsible security research. If you discover a vulnerability, report it immediately to security@collegeai.internal. We commit to prompt triage and remediation without legal retaliation for researchers operating in good faith.",
        ],
      },
    ],
  },
  accessibility: {
    id: "accessibility",
    title: "Accessibility Commitment",
    subtitle: "Our dedication to digital inclusivity following WCAG 2.1 AA standards.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. Universal Inclusivity",
        content: [
          "College AI is engineered to provide equitable access to all university students, educators, and staff members, including those with visual, auditory, motor, or cognitive disabilities.",
          "We aim to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA specifications across all user-facing interfaces.",
        ],
      },
      {
        heading: "2. Concrete Accessibility Features",
        content: [
          "High Contrast Themes: Standardized monochrome and neutral themes tested for a minimum 4.5:1 contrast ratio for body copy and 3:1 for interface controls.",
          "Keyboard Navigability: Every interactive element—including navigation drawers, search bars, conversation lists, and modal dialogs—can be operated fully via keyboard navigation.",
          "Screen Reader Semantics: Meaningful ARIA labels, live region announcements for streaming token delivery, and clear heading hierarchies.",
          "Reduced Motion: All transitions honor user preferences for 'prefers-reduced-motion' by suppressing non-essential decorative animations.",
        ],
      },
      {
        heading: "3. Feedback & Remediation",
        content: [
          "If you encounter an accessibility barrier on College AI, please contact accessibility@collegeai.internal. We actively address accessibility feedback in our continuous release cycle.",
        ],
      },
    ],
  },
  about: {
    id: "about",
    title: "About College AI",
    subtitle: "Modernizing higher education information infrastructure through conversational intelligence.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. The Campus Information Problem",
        content: [
          "Higher education campuses generate thousands of circulars, syllabus updates, exam schedules, and administrative notices every semester. Students often struggle through buried PDFs, outdated forums, and conflicting notice boards.",
          "College AI was created to replace scattered campus documents with a unified, verified conversational intelligence system.",
        ],
      },
      {
        heading: "2. Grounded, Not Hallucinated",
        content: [
          "Unlike generic public chatbots, College AI references verified institutional documents. Answers cite specific circular numbers, bylaws, and syllabus codes so students and faculty can always verify the ground truth.",
        ],
      },
      {
        heading: "3. Built for Educational Privacy",
        content: [
          "Designed from day one around FERPA compliance, strict data isolation, and enterprise-grade security. Student privacy and institutional trust are our highest priorities.",
        ],
      },
    ],
  },
  contact: {
    id: "contact",
    title: "Institutional Contact & Support",
    subtitle: "Get in touch with the College AI platform team, administration, or support engineers.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. Student & Faculty Technical Support",
        content: [
          "For assistance with login credentials, account verification, or platform error reports, reach out to our campus helpdesk: support@collegeai.internal",
          "Standard campus support operating hours: Monday through Friday, 08:00 – 18:00 IST.",
        ],
      },
      {
        heading: "2. Administrative Ingestion & Department Onboarding",
        content: [
          "Department chairs wishing to ingest new curriculum syllabi, examination notifications, or student records should coordinate with the Office of the Registrar or email admin-onboarding@collegeai.internal.",
        ],
      },
      {
        heading: "3. Security & Incident Response",
        content: [
          "To report potential security bugs, account compromise, or privacy anomalies: security@collegeai.internal.",
        ],
      },
    ],
  },
  "data-policy": {
    id: "data-policy",
    title: "Institutional Data Governance Policy",
    subtitle: "Standards for academic data handling, storage isolation, retention schedules, and masking.",
    lastUpdated: "September 2026",
    sections: [
      {
        heading: "1. Data Classification Framework",
        content: [
          "Tier 1 (Public Institutional Data): General college catalog, published departmental syllabi, public academic calendars, and approved circulars.",
          "Tier 2 (Internal Campus Data): Departmental scheduling rosters, lecture notes, campus facility regulations, and non-sensitive operational notices.",
          "Tier 3 (Confidential Education Records): Individual student grade point averages, internal examination scores, advisor case notes, and protected personal contact details.",
        ],
      },
      {
        heading: "2. Zero-Retention AI Grounding",
        content: [
          "User queries and institutional documents processed during search or conversational sessions are never retained by third-party model providers or utilized to train external machine learning foundation models.",
          "Contextual embeddings generated for document retrieval are isolated within university database partitions utilizing PostgreSQL Row-Level Security.",
        ],
      },
      {
        heading: "3. Automated Masking & PII Protection",
        content: [
          "Query results containing student personal telephone numbers, home addresses, or confidential grade point averages are automatically masked before presentation on client interfaces unless accessed by an authorized advisor or registrar.",
          "Audit logging is strictly enforced for every retrieval query touching confidential student records.",
        ],
      },
      {
        heading: "4. Data Retention & Purging Schedules",
        content: [
          "User chat histories: Persisted until explicitly deleted by the authenticated user or upon account deactivation.",
          "Temporary session tokens: Expired automatically after the configured institutional idle timeout.",
          "Administrative audit logs: Retained for a rolling 365-day compliance cycle before archival.",
        ],
      },
      {
        heading: "5. Data Inquiries & Data Protection Contact",
        content: [
          "For formal data access requests or questions concerning campus data governance, contact the Campus Data Protection Officer at privacy-officer@collegeai.internal.",
        ],
      },
    ],
  },
}

