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

export const studentService = {
  async getStudents(filters?: StudentFilterParams): Promise<Student[]> {
    await new Promise((r) => setTimeout(r, 120))
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
    await new Promise((r) => setTimeout(r, 80))
    return MOCK_STUDENTS.find((s) => s.id === id) || null
  },
}
