export interface ManagedStudent {
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

/**
 * Admin-side roster used by the enrollment console.
 *
 * The user-facing student directory was removed, so this dataset is intentionally
 * local-only: it backs the admin "Place on Leave / Reinstate" workflow and does
 * not talk to any /api/students endpoint.
 */
export const MANAGED_STUDENTS: ManagedStudent[] = [
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
    advisorName: "Dr. Robert Vance",
    joiningYear: 2023,
  },
]
