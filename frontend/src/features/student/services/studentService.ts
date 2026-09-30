import { apiClient } from "@/shared/services/apiClient"
import type { Student, StudentFilterParams } from "../types/student.types"

export const MOCK_STUDENTS: Student[] = [
  {
    id: "stu-101",
    name: "Jane Smith",
    rollNumber: "CS-2022-042",
    email: "jane.smith@college.edu",
    phone: "+1 (555) 234-8921",
    department: "Computer Science",
    course: "BCA",
    year: "Junior",
    semester: 5,
    gpa: 3.88,
    enrollmentStatus: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80",
    advisorName: "Dr. Robert Vance",
    joiningYear: 2022,
  },
  {
    id: "stu-102",
    name: "Johnathan Doe",
    rollNumber: "MATH-2021-018",
    email: "john.doe@college.edu",
    phone: "+1 (555) 456-7812",
    department: "Mathematics",
    course: "B.Sc Mathematics",
    year: "Senior",
    semester: 7,
    gpa: 3.65,
    enrollmentStatus: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80",
    advisorName: "Prof. Elena Rostova",
    joiningYear: 2021,
  },
  {
    id: "stu-103",
    name: "Alice Johnson",
    rollNumber: "PHY-2024-009",
    email: "alice.j@college.edu",
    phone: "+1 (555) 678-9034",
    department: "Physics",
    course: "B.Sc Physics",
    year: "Freshman",
    semester: 1,
    gpa: 3.92,
    enrollmentStatus: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&q=80",
    advisorName: "Dr. Marcus Chen",
    joiningYear: 2024,
  },
  {
    id: "stu-104",
    name: "Vikram Malhotra",
    rollNumber: "ENG-2023-088",
    email: "vikram.m@college.edu",
    phone: "+1 (555) 890-1234",
    department: "Computer Science",
    course: "B.Tech CSE",
    year: "Sophomore",
    semester: 3,
    gpa: 3.42,
    enrollmentStatus: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&q=80",
    advisorName: "Prof. Anita Sharma",
    joiningYear: 2023,
  },
  {
    id: "stu-105",
    name: "Sarah Williams",
    rollNumber: "BIO-2021-031",
    email: "s.williams@college.edu",
    phone: "+1 (555) 345-6789",
    department: "Life Sciences",
    course: "B.Sc Biotechnology",
    year: "Senior",
    semester: 8,
    gpa: 3.79,
    enrollmentStatus: "Graduated",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80",
    advisorName: "Dr. Gregory House",
    joiningYear: 2021,
  },
  {
    id: "stu-106",
    name: "Devon Patel",
    rollNumber: "CS-2023-014",
    email: "devon.p@college.edu",
    phone: "+1 (555) 567-8901",
    department: "Computer Science",
    course: "BCA",
    year: "Sophomore",
    semester: 4,
    gpa: 3.51,
    enrollmentStatus: "On Leave",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&q=80",
    advisorName: "Dr. Robert Vance",
    joiningYear: 2023,
  },
]

function normalizeStudent(raw: any): Student {
  return {
    id: String(raw.id),
    name: raw.name || raw.full_name || "Unknown Student",
    rollNumber: raw.rollNumber || raw.roll_number || raw.student_id || "N/A",
    email: raw.email || "student@college.edu",
    phone: raw.phone || "+1 (555) 000-0000",
    department: raw.department || "Computer Science",
    course: raw.course || "BCA",
    year: (raw.year as Student["year"]) || "Junior",
    semester: Number(raw.semester) || 1,
    gpa: Number(raw.gpa) || 3.5,
    enrollmentStatus: (raw.enrollmentStatus || raw.enrollment_status || "Active") as Student["enrollmentStatus"],
    avatarUrl: raw.avatarUrl || raw.avatar_url,
    advisorName: raw.advisorName || raw.advisor_name,
    joiningYear: Number(raw.joiningYear || raw.joining_year || raw.enrollment_year) || 2024,
  }
}

export const studentService = {
  async getStudents(filters?: StudentFilterParams): Promise<Student[]> {
    try {
      const params: Record<string, any> = { raw_list: true }
      if (filters?.searchQuery) params.searchQuery = filters.searchQuery
      if (filters?.department && filters.department !== "all") params.department = filters.department
      if (filters?.year && filters.year !== "all") params.year = filters.year
      if (filters?.status && filters.status !== "all") params.status = filters.status

      const response = await apiClient.get<any[]>("/api/students", { params })
      if (Array.isArray(response) && response.length > 0) {
        return response.map(normalizeStudent)
      }
    } catch (err) {
      console.warn("Backend /api/students query failed, using local mock data:", err)
    }

    // Local filter fallback
    let result = [...MOCK_STUDENTS]
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      )
    }

    if (filters?.department && filters.department !== "all") {
      result = result.filter((s) => s.department === filters.department)
    }

    if (filters?.year && filters.year !== "all") {
      result = result.filter((s) => s.year === filters.year)
    }

    if (filters?.status && filters.status !== "all") {
      result = result.filter((s) => s.enrollmentStatus === filters.status)
    }

    return result
  },

  async getStudentById(id: string): Promise<Student | null> {
    try {
      const response = await apiClient.get<any>(`/api/students/${id}`)
      if (response && (response.id || response.name)) {
        return normalizeStudent(response)
      }
    } catch (err) {
      console.warn(`Backend /api/students/${id} query failed, using local mock data:`, err)
    }

    return MOCK_STUDENTS.find((s) => s.id === id) || null
  },
}
