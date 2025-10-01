import { apiService } from "./apiService"

export interface Student {
  id: number
  student_id: string
  name: string
  email: string
  department: string
  total_exams_taken: number
  average_score: number
  total_marks_obtained: number
  total_possible_marks: number
}

export interface StudentDetails {
  student: Student
  examResults: any[]
}

export interface StudentFilters {
  search?: string
  department?: string
}

class StudentsApiService {
  /**
   * Get all students with optional filters
   * @param filters - Search and filter parameters
   * @returns List of students
   */
  async getStudents(filters?: StudentFilters): Promise<{ success: boolean; data?: Student[]; message?: string }> {
    const params: Record<string, string> = {}

    if (filters?.search) params.search = filters.search
    if (filters?.department && filters.department !== "all") params.department = filters.department

    return apiService.getStudents(params)
  }

  /**
   * Get detailed information for a specific student
   * @param studentId - The student ID
   * @returns Student details with exam results
   */
  async getStudent(studentId: string): Promise<{ success: boolean; data?: StudentDetails; message?: string }> {
    return apiService.getStudent(studentId)
  }

  /**
   * Update a student's grade for a specific exam result
   * @param studentId - The student ID
   * @param resultId - The exam result ID
   * @param gradeData - New grade and optional score
   * @returns Success status
   */
  async updateStudentGrade(
    studentId: string,
    resultId: string,
    gradeData: { grade: string; score?: number },
  ): Promise<{ success: boolean; message?: string }> {
    return apiService.updateStudentGrade(studentId, resultId, gradeData)
  }

  /**
   * Add a new student
   * @param studentData - Student information
   * @returns Created student
   */
  async addStudent(studentData: any): Promise<{ success: boolean; data?: Student; message?: string }> {
    return apiService.addStudent(studentData)
  }

  /**
   * Export students data as CSV
   * @param filters - Optional filters for export
   * @returns CSV file blob
   */
  async exportStudents(filters?: StudentFilters): Promise<Blob> {
    const params = new URLSearchParams()
    if (filters?.search) params.append("search", filters.search)
    if (filters?.department && filters.department !== "all") params.append("department", filters.department)

    const response = await fetch(`${import.meta.env.VITE_API_URL}/students/export?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    return response.blob()
  }
}

export const studentsApiService = new StudentsApiService()
