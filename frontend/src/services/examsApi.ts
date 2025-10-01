import { apiService } from "./apiService"
import type { Exam } from "../types"

export interface ExamFilters {
  search?: string
  status?: string
  subject?: string
  department?: string
}

class ExamsApiService {
  /**
   * Get all exams with optional filters
   * @param filters - Search and filter parameters
   * @returns List of exams
   */
  async getExams(filters?: ExamFilters): Promise<{ success: boolean; data?: Exam[]; message?: string }> {
    const params: Record<string, string> = {}

    if (filters?.search) params.search = filters.search
    if (filters?.status && filters.status !== "all") params.status = filters.status
    if (filters?.subject) params.subject = filters.subject
    if (filters?.department) params.department = filters.department

    return apiService.getExams(params)
  }

  /**
   * Get a single exam by ID
   * @param examId - The exam ID
   * @returns Exam details
   */
  async getExam(examId: string): Promise<{ success: boolean; data?: Exam; message?: string }> {
    return apiService.getExam(examId)
  }

  /**
   * Create a new exam
   * @param examData - Exam data to create
   * @returns Created exam
   */
  async createExam(examData: Partial<Exam>): Promise<{ success: boolean; data?: Exam; message?: string }> {
    return apiService.createExam(examData)
  }

  /**
   * Update an existing exam
   * @param examId - The exam ID
   * @param examData - Updated exam data
   * @returns Updated exam
   */
  async updateExam(
    examId: string,
    examData: Partial<Exam>,
  ): Promise<{ success: boolean; data?: Exam; message?: string }> {
    return apiService.updateExam(examId, examData)
  }

  /**
   * Delete an exam
   * @param examId - The exam ID
   * @returns Success status
   */
  async deleteExam(examId: string): Promise<{ success: boolean; message?: string }> {
    return apiService.deleteExam(examId)
  }

  /**
   * Send exam to department for approval
   * @param examId - The exam ID
   * @param departments - Array of department names
   * @param message - Optional message for the department
   * @returns Success status
   */
  async sendExamToDepartment(
    examId: string,
    departments: string[],
    message: string,
  ): Promise<{ success: boolean; message?: string }> {
    return apiService.sendExamToDepartment(examId, departments, message)
  }

  /**
   * Upload an image for exam questions
   * @param file - Image file to upload
   * @returns Uploaded image URL
   */
  async uploadImage(file: File): Promise<{ success: boolean; data?: { url: string }; message?: string }> {
    return apiService.uploadImage(file)
  }

  /**
   * Delete an uploaded image
   * @param filePath - Path to the image file
   * @returns Success status
   */
  async deleteImage(filePath: string): Promise<{ success: boolean; message?: string }> {
    return apiService.deleteImage(filePath)
  }

  /**
   * Get user's department subjects
   * @returns List of subjects
   */
  async getUserSubjects(): Promise<{ success: boolean; data?: string[]; message?: string }> {
    return apiService.getUserSubjects()
  }
}

export const examsApiService = new ExamsApiService()
