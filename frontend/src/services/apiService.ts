const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

interface LoginCredentials {
  email: string
  password: string
}

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  token?: string
  user?: any
}

class ApiService {
  private baseURL: string
  private token: string | null

  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem("auth_token")
  }

  setToken(token: string | null): void {
    this.token = token
    if (token) {
      localStorage.setItem("auth_token", token)
    } else {
      localStorage.removeItem("auth_token")
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {}

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {}

    // Add authorization header if token exists
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    // Only add Content-Type for JSON, let browser handle FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...((options.headers as Record<string, string>) || {}),
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API request error:", error)
      throw error
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    if (response.success && response.token) {
      this.setToken(response.token)
    }

    return response
  }

  logout(): void {
    this.setToken(null)
  }

  // User Profile
  async getProfile(): Promise<ApiResponse> {
    return this.request("/profile")
  }

  async updateProfile(profileData: any): Promise<ApiResponse> {
    return this.request("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  // File Upload
  async uploadImage(file: File): Promise<ApiResponse> {
    const formData = new FormData()
    formData.append("image", file)

    return this.request("/upload/image", {
      method: "POST",
      body: formData,
    })
  }

  async deleteImage(filePath: string): Promise<ApiResponse> {
    return this.request("/upload/image", {
      method: "DELETE",
      body: JSON.stringify({ filePath }),
    })
  }

  // Departments and Subjects
  async getDepartments(): Promise<ApiResponse> {
    return this.request("/departments")
  }

  async getSubjects(): Promise<ApiResponse> {
    return this.request("/subjects")
  }

  // Exams
  async getExams(params: Record<string, string> = {}): Promise<ApiResponse> {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/exams${queryString ? `?${queryString}` : ""}`)
  }

  async getExam(examId: string): Promise<ApiResponse> {
    return this.request(`/exams/${examId}`)
  }

  async createExam(examData: any): Promise<ApiResponse> {
    return this.request("/exams", {
      method: "POST",
      body: JSON.stringify(examData),
    })
  }

  async updateExam(examId: string, examData: any): Promise<ApiResponse> {
    return this.request(`/exams/${examId}`, {
      method: "PUT",
      body: JSON.stringify(examData),
    })
  }

  async deleteExam(examId: string): Promise<ApiResponse> {
    return this.request(`/exams/${examId}`, {
      method: "DELETE",
    })
  }

  async sendExamToDepartment(examId: string, departments: string[], message: string): Promise<ApiResponse> {
    return this.request(`/exams/${examId}/send-to-department`, {
      method: "POST",
      body: JSON.stringify({ departments, message }),
    })
  }

  // Reports
  async getExamReports(params: Record<string, string> = {}): Promise<ApiResponse> {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/reports/exams${queryString ? `?${queryString}` : ""}`)
  }

  async getExamResults(examId: string): Promise<ApiResponse> {
    return this.request(`/reports/exams/${examId}/results`)
  }

  async getDashboardStats(): Promise<ApiResponse> {
    return this.request("/reports/dashboard")
  }

  // Students
  async getStudents(params: Record<string, string> = {}): Promise<ApiResponse> {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/students${queryString ? `?${queryString}` : ""}`)
  }

  async getStudent(studentId: string): Promise<ApiResponse> {
    return this.request(`/students/${studentId}`)
  }

  async updateStudentGrade(studentId: string, resultId: string, gradeData: any): Promise<ApiResponse> {
    return this.request(`/students/${studentId}/results/${resultId}/grade`, {
      method: "PATCH",
      body: JSON.stringify(gradeData),
    })
  }

  async addStudent(studentData: any): Promise<ApiResponse> {
    return this.request("/students", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  }

  async getUserSubjects(): Promise<ApiResponse> {
    return this.request("/users/subjects")
  }
}

export const apiService = new ApiService()
