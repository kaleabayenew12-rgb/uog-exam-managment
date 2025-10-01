"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { ExamForm } from "../components/Exams/ExamForm"
import type { Exam } from "../types"
import { examsApiService } from "../services/examsApi"

interface CreateExamPageProps {
  onNavigate: (route: string) => void
}

export const CreateExamPage: React.FC<CreateExamPageProps> = ({ onNavigate }) => {
  const [isSaving, setIsSaving] = useState(false)
  const [createdExamId, setCreatedExamId] = useState<string | null>(null)

  const handleSave = async (examData: Partial<Exam>) => {
    setIsSaving(true)

    try {
      console.log("[v0] Saving exam with data:", examData)
      const response = await examsApiService.createExam(examData)
      console.log("[v0] Exam save response:", response)

      if (response.success && response.data && response.data.id) {
        setCreatedExamId(response.data.id.toString())

        if (examData.status !== "sent") {
          alert("Exam saved successfully!")
          onNavigate("exams")
        }

        return response.data.id.toString()
      } else {
        alert(response.message || "Error saving exam. Please try again.")
        return null
      }
    } catch (error) {
      console.error("Error saving exam:", error)
      alert("Error saving exam. Please try again.")
      return null
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendToDepartment = async (examId: string, departments: string[], message: string) => {
    try {
      const actualExamId = createdExamId || examId

      console.log("[v0] Sending exam to department:", { actualExamId, departments, message })

      const response = await examsApiService.sendExamToDepartment(actualExamId, departments, message)
      console.log("[v0] Send to department response:", response)

      if (response.success) {
        alert("Exam sent to department for approval!")
        onNavigate("exams")
      } else {
        alert(response.message || "Error sending exam. Please try again.")
      }
    } catch (error) {
      console.error("Error sending exam:", error)
      alert("Error sending exam. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate("exams")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Create New Exam</h1>
              <p className="text-sm text-gray-600">Build your exam with questions and settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6">
        <ExamForm onSave={handleSave} onSendToDepartment={handleSendToDepartment} />
      </div>

      {/* Loading Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Saving exam...</span>
          </div>
        </div>
      )}
    </div>
  )
}
