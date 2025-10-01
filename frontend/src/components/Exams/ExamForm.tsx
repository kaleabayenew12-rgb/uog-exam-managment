"use client"

import React, { useState } from "react"
import { Save, Send, Eye, Settings, Camera as Omega } from "lucide-react"
import type { Exam, Question } from "../../types"
import { QuestionTypeSelector } from "../Questions/QuestionTypeSelector"
import { QuestionEditor } from "../Questions/QuestionEditor"
import { SymbolPicker } from "../SymbolPicker"

interface ExamFormProps {
  exam?: Exam
  onSave: (exam: Partial<Exam>) => Promise<string | null> | void
  onSendToDepartment?: (examId: string, departments: string[], message: string) => void
}

export const ExamForm: React.FC<ExamFormProps> = ({ exam, onSave, onSendToDepartment }) => {
  const [formData, setFormData] = useState<Partial<Exam>>({
    title: exam?.title || "",
    subject: exam?.subject || "",
    description: exam?.description || "",
    duration: exam?.duration || 60,
    totalMarks: exam?.totalMarks || 0,
    passMark: exam?.passMark || 0,
    questions: exam?.questions || [],
    settings: exam?.settings || {
      randomizeQuestions: false,
      allowMultipleAttempts: false,
      shuffleOptions: true,
      negativeMark: false,
    },
  })

  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question> | null>(null)
  const [showQuestionEditor, setShowQuestionEditor] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showSymbolPicker, setShowSymbolPicker] = useState(false)
  const [activeTextArea, setActiveTextArea] = useState<HTMLTextAreaElement | null>(null)
  const [customSubject, setCustomSubject] = useState("")
  const [showCustomSubject, setShowCustomSubject] = useState(false)
  const [departmentSubjects, setDepartmentSubjects] = useState<string[]>([])

  // Fetch department subjects on component mount
  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/users/subjects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        })
        const data = await response.json()
        if (data.success) {
          setDepartmentSubjects(data.data)
        }
      } catch (error) {
        console.error("Error fetching subjects:", error)
      }
    }

    fetchSubjects()
  }, [])

  const handleFormChange = (field: keyof Exam, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubjectChange = (value: string) => {
    if (value === "custom") {
      setShowCustomSubject(true)
      setFormData((prev) => ({ ...prev, subject: customSubject }))
    } else {
      setShowCustomSubject(false)
      setFormData((prev) => ({ ...prev, subject: value }))
    }
  }

  const handleSettingsChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings!,
        [field]: value,
      },
    }))
  }

  const handleQuestionTypeSelect = (type: string) => {
    const newQuestion: Partial<Question> = {
      id: Date.now().toString(),
      type: type as Question["type"],
      text: "",
      marks: 1,
    }

    setCurrentQuestion(newQuestion)
    setShowQuestionEditor(true)
    setEditingIndex(null)
  }

  const handleQuestionSave = (question: Partial<Question>) => {
    if (!question.text?.trim()) return

    const newQuestions = [...(formData.questions || [])]

    if (editingIndex !== null) {
      newQuestions[editingIndex] = question as Question
    } else {
      newQuestions.push(question as Question)
    }

    // Update total marks
    const totalMarks = newQuestions.reduce((sum, q) => sum + (q.marks || 0), 0)

    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
      totalMarks,
    }))

    setShowQuestionEditor(false)
    setCurrentQuestion(null)
    setEditingIndex(null)
  }

  const handleQuestionEdit = (index: number) => {
    const question = formData.questions?.[index]
    if (question) {
      setCurrentQuestion(question)
      setShowQuestionEditor(true)
      setEditingIndex(index)
    }
  }

  const handleQuestionDelete = (index: number) => {
    const newQuestions = formData.questions?.filter((_, i) => i !== index) || []
    const totalMarks = newQuestions.reduce((sum, q) => sum + (q.marks || 0), 0)

    setFormData((prev) => ({
      ...prev,
      questions: newQuestions,
      totalMarks,
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleSendToDepartment = async () => {
    if (!formData.title || !formData.subject || !formData.questions || formData.questions.length === 0) {
      alert("Please complete the exam details and add at least one question before sending to department.")
      return
    }

    const confirmSend = window.confirm(
      "Are you sure you want to send this exam to the department for approval? You won't be able to edit it after sending.",
    )
    if (confirmSend && onSendToDepartment) {
      const examWithSentStatus = {
        ...formData,
        status: "sent" as const,
      }

      const examId = await onSave(examWithSentStatus)

      if (examId) {
        onSendToDepartment(examId, [formData.subject || ""], "Please review this exam for approval.")
      }
    }
  }

  const handleSymbolInsert = (symbol: string) => {
    if (activeTextArea) {
      const start = activeTextArea.selectionStart
      const end = activeTextArea.selectionEnd
      const text = activeTextArea.value
      const newText = text.substring(0, start) + symbol + text.substring(end)

      // Update the textarea value
      activeTextArea.value = newText

      // Set cursor position after symbol
      setTimeout(() => {
        activeTextArea.setSelectionRange(start + symbol.length, start + symbol.length)
        activeTextArea.focus()
      }, 0)
    }
  }

  const getQuestionTypeIcon = (type: Question["type"]) => {
    const iconMap = {
      mcq: "⚪",
      tf: "✓",
      short: "📝",
      fill: "📄",
      matching: "🔗",
      essay: "📋",
      code: "💻",
      diagram: "🖼️",
      "diagram-mcq": "🖼️⚪",
      "diagram-tf": "🖼️✓",
      "diagram-matching": "🖼️🔗",
      "paragraph-mcq": "📄⚪",
      "paragraph-tf": "📄✓",
      "paragraph-matching": "📄🔗",
    }
    return iconMap[type] || "❓"
  }

  const getQuestionTypeName = (type: Question["type"]) => {
    const nameMap = {
      mcq: "Multiple Choice",
      tf: "True/False",
      short: "Short Answer",
      fill: "Fill in the Blanks",
      matching: "Matching",
      essay: "Essay",
      code: "Coding",
      diagram: "Diagram",
      "diagram-mcq": "Diagram + Multiple Choice",
      "diagram-tf": "Diagram + True/False",
      "diagram-matching": "Diagram + Matching",
      "paragraph-mcq": "Paragraph + Multiple Choice",
      "paragraph-tf": "Paragraph + True/False",
      "paragraph-matching": "Paragraph + Matching",
    }
    return nameMap[type] || "Unknown"
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {!showQuestionEditor ? (
        <>
          {/* Exam Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Exam Information</h2>
              <button
                onClick={() => setShowSymbolPicker(true)}
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                title="Insert Mathematical Symbols"
              >
                <Omega className="h-4 w-4" />
                <span>Symbols</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  onFocus={(e) => setActiveTextArea(e.target as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Midterm Examination 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                {!showCustomSubject ? (
                  <select
                    value={formData.subject || ""}
                    onChange={(e) => handleSubjectChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a subject...</option>
                    {departmentSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                    <option value="custom">Other (Custom)</option>
                  </select>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => {
                        setCustomSubject(e.target.value)
                        handleFormChange("subject", e.target.value)
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter custom subject"
                    />
                    <button
                      onClick={() => {
                        setShowCustomSubject(false)
                        setCustomSubject("")
                        handleFormChange("subject", "")
                      }}
                      className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description/Instructions</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  onFocus={(e) => setActiveTextArea(e.target as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Provide instructions and guidelines for students..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 60 : Number.parseInt(e.target.value)
                    handleFormChange("duration", value)
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pass Mark</label>
                <input
                  type="number"
                  min="0"
                  max={formData.totalMarks}
                  value={formData.passMark || ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number.parseInt(e.target.value)
                    handleFormChange("passMark", value)
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Exam Settings */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Exam Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings?.randomizeQuestions}
                    onChange={(e) => handleSettingsChange("randomizeQuestions", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Randomize question order</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings?.shuffleOptions}
                    onChange={(e) => handleSettingsChange("shuffleOptions", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Shuffle answer options</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings?.allowMultipleAttempts}
                    onChange={(e) => handleSettingsChange("allowMultipleAttempts", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Allow multiple attempts</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings?.negativeMark}
                    onChange={(e) => handleSettingsChange("negativeMark", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">Enable negative marking</span>
                </label>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Questions ({formData.questions?.length || 0})</h2>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Total: <span className="font-semibold">{formData.totalMarks} marks</span>
                </span>
              </div>
            </div>

            {/* Existing Questions */}
            {formData.questions && formData.questions.length > 0 && (
              <div className="space-y-4 mb-6">
                {formData.questions.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getQuestionTypeIcon(question.type)}</span>
                          <span className="text-sm font-medium text-blue-600">
                            {getQuestionTypeName(question.type)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {question.marks} {question.marks === 1 ? "mark" : "marks"}
                          </span>
                        </div>
                        <p className="text-gray-900 line-clamp-2">{question.text || "No question text"}</p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleQuestionEdit(index)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleQuestionDelete(index)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Question */}
            <div>
              <QuestionTypeSelector onSelect={handleQuestionTypeSelect} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {formData.questions?.length || 0} questions • {formData.totalMarks} total marks
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Draft</span>
              </button>

              <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>

              <button
                onClick={handleSendToDepartment}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Send to Department</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Question Editor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-gray-900">{editingIndex !== null ? "Edit" : "Add"} Question</h2>
                <button
                  onClick={() => setShowSymbolPicker(true)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Insert Mathematical Symbols"
                >
                  <Omega className="h-4 w-4" />
                  <span>Symbols</span>
                </button>
              </div>
              <button
                onClick={() => {
                  setShowQuestionEditor(false)
                  setCurrentQuestion(null)
                  setEditingIndex(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {currentQuestion && <QuestionEditor question={currentQuestion} onChange={setCurrentQuestion} />}

            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowQuestionEditor(false)
                  setCurrentQuestion(null)
                  setEditingIndex(null)
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => handleQuestionSave(currentQuestion!)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingIndex !== null ? "Update" : "Add"} Question
              </button>
            </div>
          </div>
        </>
      )}

      {/* Symbol Picker Modal */}
      {showSymbolPicker && <SymbolPicker onSelect={handleSymbolInsert} onClose={() => setShowSymbolPicker(false)} />}
    </div>
  )
}
