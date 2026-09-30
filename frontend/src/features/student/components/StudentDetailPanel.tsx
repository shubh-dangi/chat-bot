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

export function StudentDetailPanel({ student }: { student: Student }) {
  const [revealSensitive, setRevealSensitive] = useState(false)

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none">
      {/* Back button */}
      <FadeIn delay={0}>
        <Link
          to={ROUTES.STUDENTS}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to student directory</span>
        </Link>
      </FadeIn>

      {/* Header Profile Card */}
      <FadeIn delay={50}>
        <div className="p-6 rounded-xl border border-border-default bg-bg-elevated shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={student.avatarUrl} fallback={student.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-semibold text-text-primary">
                  {student.name}
                </h1>
                <Badge variant="outline" size="sm" className="font-mono text-[11px]">
                  {student.rollNumber}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
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
          >
            {student.enrollmentStatus}
          </Badge>
        </div>
      </FadeIn>

      {/* Sensitivity Control Bar */}
      <FadeIn delay={100}>
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-border-default bg-bg-secondary text-xs">
          <div className="flex items-center gap-2 text-text-secondary">
            <Lock className="w-4 h-4 text-text-muted shrink-0" />
            <span>Student confidential records are masked by default according to campus FERPA guidelines.</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRevealSensitive((prev) => !prev)}
            className="gap-1.5 shrink-0 text-xs h-8"
          >
            {revealSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{revealSensitive ? "Hide details" : "Reveal details"}</span>
          </Button>
        </div>
      </FadeIn>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact & Enrollment Info */}
        <FadeIn delay={150}>
          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-4 shadow-xs h-full">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <User className="w-3.5 h-3.5" />
              <span>Enrollment & Identity</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  Email
                </span>
                <span className="font-medium text-text-primary select-text">{student.email}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  Contact Phone
                </span>
                <span className="font-mono text-text-primary">
                  {revealSensitive ? student.phone : maskSensitiveValue(student.phone, 4)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary">Academic Standing</span>
                <span className="font-medium text-text-primary">{student.year}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary">Current Semester</span>
                <span className="font-medium text-text-primary">Semester {student.semester}</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-text-muted" />
                  Division / Section
                </span>
                <span className="font-medium text-text-primary">Division A (Morning Batch)</span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Academic Performance */}
        <FadeIn delay={200}>
          <div className="p-5 rounded-xl border border-border-default bg-bg-elevated space-y-4 shadow-xs h-full">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <Award className="w-3.5 h-3.5" />
              <span>Academic Performance</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary">Cumulative GPA</span>
                <span className="font-mono font-semibold text-text-primary">
                  {revealSensitive ? student.gpa.toFixed(2) : "•.•• (Protected)"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary">Degree Program</span>
                <span className="font-medium text-text-primary">{student.course}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-text-muted" />
                  Faculty Mentor
                </span>
                <span className="font-medium text-text-primary">{student.advisorName || "Unassigned"}</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-text-secondary">Matriculation Year</span>
                <span className="font-medium text-text-primary">{student.joiningYear || 2022}</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
