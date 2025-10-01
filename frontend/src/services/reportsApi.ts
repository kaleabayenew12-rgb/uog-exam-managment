import { apiService } from "./apiService"

export interface ExamReport {
  exam_id: number
  exam_title: string
  subject: string
  total_students: number
  average_score: number
  pass_rate: number
  completion_rate: number
  total_marks: number
  highest_score: number
  lowest_score: number
}

export interface ExamResult {
  id: number
  student_id: string
  student_name: string
  score: number
  total_marks: number
  percentage: number
  grade: string
  time_spent: number
  submitted_at: string
  answers: any[]
}

export interface ReportFilters {
  subject?: string
  startDate?: string
  endDate?: string
}

class ReportsApiService {
  /**
   * Get exam reports with optional filters
   * @param filters - Filter parameters for reports
   * @returns List of exam reports with statistics
   */
  async getExamReports(filters?: ReportFilters): Promise<{ success: boolean; data?: ExamReport[]; message?: string }> {
    const params: Record<string, string> = {}

    if (filters?.subject) params.subject = filters.subject
    if (filters?.startDate) params.startDate = filters.startDate
    if (filters?.endDate) params.endDate = filters.endDate

    return apiService.getExamReports(params)
  }

  /**
   * Get detailed results for a specific exam
   * @param examId - The exam ID
   * @returns List of student results for the exam
   */
  async getExamResults(examId: string): Promise<{ success: boolean; data?: ExamResult[]; message?: string }> {
    return apiService.getExamResults(examId)
  }

  /**
   * Get dashboard statistics for reports
   * @returns Overall statistics for the dashboard
   */
  async getDashboardStats(): Promise<any> {
    return apiService.getDashboardStats()
  }

  /**
   * Export exam report as CSV
   * @param examId - The exam ID
   * @returns CSV file blob
   */
  async exportExamReport(examId: string): Promise<Blob> {
    // This would need to be implemented on the backend
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/exams/${examId}/export`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    return response.blob()
  }
}

export const reportsApiService = new ReportsApiService()
