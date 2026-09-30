import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, BookOpen, User, Award, Layers } from "lucide-react"
import { Avatar } from "@/shared/components/ui/Avatar"
import { Badge } from "@/shared/components/ui/Badge"
import { Button } from "@/shared/components/ui/Button"
import { FadeIn } from "@/shared/components/motion/FadeIn"
import { maskSensitiveValue } from "@/shared/utils/format"
import { ROUTES } from "@/shared/config/routes"
import type { Student } from "../types/student.types"

function DetailRow({
  label,
  value,
  icon,
  mono,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-2 border-b border-border-subtle last:border-b-0 min-w-0">
      <span className="text-text-secondary text-xs flex items-center gap-1.5 shrink-0">
        {icon}
        {label}
      </span>
      <span
        className={`text-text-primary font-medium text-xs sm:text-sm break-words min-w-0 flex-1 sm:flex-none sm:text-right ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}

export function StudentDetailPanel({ student }: { student: Student }) {
  const [revealSensitive, setRevealSensitive] = useState(false)

  return (
    <div className="space-y-fluid-4 max-w-3xl mx-auto select-none min-w-0">
      {/* Back button */}
      <FadeIn delay={0}>
        <Link
          to={ROUTES.STUDENTS}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors min-h-[40px] -ml-1 px-1 rounded-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Back to student directory</span>
        </Link>
      </FadeIn>

      {/* Header Profile Card */}
      <FadeIn delay={50}>
        <div className="p-4 sm:p-6 rounded-xl border border-border-default bg-bg-elevated shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Avatar src={student.avatarUrl} fallback={student.name} size="lg" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-semibold text-text-primary break-words">
                  {student.name}
                </h1>
                <Badge variant="outline" size="sm" className="font-mono text-[11px] break-all">
                  {student.rollNumber}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5 break-words">
                {student.course} • {student.department}
              </p>
            </div>
          </div>

          <Badge
            variant={
              student.enrollmentStatus === "Active"
                ? "success"
                : student.enrollmentStatus === "Graduated"
                ? "info"
                : "warning"
            }
            size="md"
            className="shrink-0 self-start sm:self-auto"
          >
            {student.enrollmentStatus}
          </Badge>
        </div>
      </FadeIn>

      {/* Sensitivity Control Bar */}
      <FadeIn delay={100}>
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 p-3.5 rounded-xl border border-border-default bg-bg-secondary text-xs">
          <div className="flex items-start gap-2 text-text-secondary min-w-0">
            <Lock className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
            <span className="break-words">
              Student confidential records are masked by default according to campus FERPA guidelines.
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRevealSensitive((prev) => !prev)}
            className="gap-1.5 shrink-0 text-xs w-full xs:w-auto"
            aria-pressed={revealSensitive}
          >
            {revealSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{revealSensitive ? "Hide details" : "Reveal details"}</span>
          </Button>
        </div>
      </FadeIn>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-3">
        {/* Contact & Enrollment Info */}
        <FadeIn delay={150}>
          <div className="p-4 sm:p-5 rounded-xl border border-border-default bg-bg-elevated space-y-3 shadow-xs h-full min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Enrollment &amp; Identity</span>
            </div>

            <div className="space-y-0 text-xs min-w-0">
              <DetailRow label="Email" value={student.email} icon={<Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />} />
              <DetailRow
                label="Contact Phone"
                value={revealSensitive ? student.phone : maskSensitiveValue(student.phone, 4)}
                icon={<Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />}
                mono
              />
              <DetailRow label="Academic Standing" value={student.year} />
              <DetailRow label="Current Semester" value={`Semester ${student.semester}`} />
              <DetailRow
                label="Division / Section"
                value="Division A (Morning Batch)"
                icon={<Layers className="w-3.5 h-3.5 text-text-muted shrink-0" />}
              />
            </div>
          </div>
        </FadeIn>

        {/* Academic Performance */}
        <FadeIn delay={200}>
          <div className="p-4 sm:p-5 rounded-xl border border-border-default bg-bg-elevated space-y-3 shadow-xs h-full min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Academic Performance</span>
            </div>

            <div className="space-y-0 text-xs min-w-0">
              <DetailRow
                label="Cumulative GPA"
                value={revealSensitive ? student.gpa.toFixed(2) : "•.•• (Protected)"}
                mono
              />
              <DetailRow label="Degree Program" value={student.course} />
              <DetailRow
                label="Faculty Mentor"
                value={student.advisorName || "Unassigned"}
                icon={<BookOpen className="w-3.5 h-3.5 text-text-muted shrink-0" />}
              />
              <DetailRow label="Matriculation Year" value={student.joiningYear || 2022} />
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
