"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "../services/apiService.ts"

interface User {
  id: string
  email: string
  name: string
  role: "teacher"
  department?: string
  avatar?: string
  phone?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token and validate it
    const initializeAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        apiService.setToken(token)
        try {
          const response = await apiService.getProfile()
          if (response.success && response.data) {
            const userData: User = {
              id: response.data.id.toString(),
              email: response.data.email,
              name: response.data.name,
              role: response.data.role,
              department: response.data.department,
              avatar: response.data.avatar,
              phone: response.data.phone,
              bio: response.data.bio,
            }
            setUser(userData)
          } else {
            // Invalid token or not a teacher, remove it
            apiService.logout()
          }
        } catch (error) {
          // Invalid token, remove it
          apiService.logout()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await apiService.login({ email, password })

      if (response.success && response.user && response.user.role === "teacher") {
        const userData: User = {
          id: response.user.id.toString(),
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          department: response.user.department,
          avatar: response.user.avatar,
          phone: response.user.phone,
          bio: response.user.bio,
        }
        setUser(userData)
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error: any) {
      console.error("Login error:", error)
      setIsLoading(false)
      throw error
    }
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>{children}</AuthContext.Provider>
}
