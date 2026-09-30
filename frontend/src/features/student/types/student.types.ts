export interface Student {
  id: string
  name: string
  rollNumber: string
  email: string
  phone: string
  department: string
  course: string
  year: "Freshman" | "Sophomore" | "Junior" | "Senior"
  semester: number
  gpa: number
  enrollmentStatus: "Active" | "Graduated" | "On Leave" | "Suspended"
  avatarUrl?: string
  advisorName?: string
  joiningYear?: number
}

export interface StudentFilterParams {
  searchQuery: string
  department?: string
  year?: string
  status?: string
}
