"use client"

import type React from "react"
import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { ExamsPage } from "./pages/ExamsPage"
import { CreateExamPage } from "./pages/CreateExamPage"
import { ProfilePage } from "./pages/ProfilePage"
import { ReportsPage } from "./pages/ReportsPage"
import { StudentsPage } from "./pages/StudentsPage"
import { Sidebar } from "./components/Layout/Sidebar"
import { Header } from "./components/Layout/Header"

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth()
  const [currentRoute, setCurrentRoute] = useState("dashboard")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  // Only allow teachers
  if (user.role !== "teacher") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only teachers can access this system.</p>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentRoute) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentRoute} />
      case "exams":
        return <ExamsPage onNavigate={setCurrentRoute} />
      case "exams/new":
        return <CreateExamPage onNavigate={setCurrentRoute} />
      case "profile":
        return <ProfilePage />
      case "students":
        return <StudentsPage />
      case "reports":
        return <ReportsPage />
      default:
        if (currentRoute.startsWith("exams/") && currentRoute.endsWith("/edit")) {
          return <CreateExamPage onNavigate={setCurrentRoute} />
        }
        return <Dashboard onNavigate={setCurrentRoute} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeRoute={currentRoute} onNavigate={setCurrentRoute} />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
