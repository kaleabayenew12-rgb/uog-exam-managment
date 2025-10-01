import { apiService } from "./apiService"

export interface DashboardStats {
  totalExams: number
  draftExams: number
  publishedExams: number
  sentExams: number
  approvedExams: number
  totalQuestions: number
  monthlyExams: number
  recentActivity: RecentActivity[]
}

export interface RecentActivity {
  id: string
  title: string
  status: string
  timestamp: string
}

class DashboardApiService {
  /**
   * Get dashboard statistics
   * @returns Dashboard stats including exam counts, questions, and recent activity
   */
  async getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; message?: string }> {
    return apiService.getDashboardStats()
  }

  /**
   * Get exams with optional filters
   * @param params - Query parameters for filtering exams
   * @returns List of exams matching the criteria
   */
  async getExams(params?: { status?: string; limit?: number }): Promise<any> {
    return apiService.getExams(params as Record<string, string>)
  }

  /**
   * Get exam counts by status
   * @returns Object with counts for each status
   */
  async getExamCounts(): Promise<any> {
    const response = await apiService.getExams({})
    if (response.success && response.data) {
      const exams = response.data
      return {
        success: true,
        data: {
          draft: exams.filter((e: any) => e.status === "draft").length,
          sent: exams.filter((e: any) => e.status === "sent").length,
          approved: exams.filter((e: any) => e.status === "approved").length,
          published: exams.filter((e: any) => e.status === "published").length,
          total: exams.length,
        },
      }
    }
    return { success: false, message: "Failed to fetch exam counts" }
  }
}

export const dashboardApiService = new DashboardApiService()
