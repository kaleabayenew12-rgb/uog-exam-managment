"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { User, Mail, Phone, Camera, Save, X, Check, ImageIcon } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { profileApiService } from "../services/profileApi"

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar: "",
  })

  const [initialData, setInitialData] = useState({
    name: "",
    phone: "",
    bio: "",
    avatar: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const response = await profileApiService.getProfile()

      if (response.success && response.data) {
        const profileData = {
          name: response.data.name || user?.name || "",
          phone: response.data.phone || "",
          bio: response.data.bio || "",
          avatar: response.data.avatar || "",
        }
        setFormData(profileData)
        setInitialData(profileData)
        setAvatarPreview("")
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      alert("Error loading profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await profileApiService.updateProfileWithAvatar(
        {
          name: formData.name !== initialData.name ? formData.name : undefined,
          phone: formData.phone !== initialData.phone ? formData.phone : undefined,
          bio: formData.bio !== initialData.bio ? formData.bio : undefined,
        },
        avatarFile || undefined,
      )

      if (response.success) {
        setIsEditing(false)
        setAvatarFile(null)
        setAvatarPreview("")
        await loadProfile()
        alert("Profile updated successfully!")
      } else {
        alert(response.message || "Error updating profile. Please try again.")
      }
    } catch (error: any) {
      console.error("Error saving profile:", error)
      alert(error.message || "Error updating profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsEditing(false)
    setAvatarFile(null)
    setAvatarPreview("")
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, PNG, GIF, and WebP images are allowed")
        return
      }

      setAvatarFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview
    if (formData.avatar) {
      if (formData.avatar.startsWith("http")) return formData.avatar
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api"
      const baseUrl = apiUrl.replace("/api", "")
      return `${baseUrl}${formData.avatar}`
    }
    return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <img
                src={getAvatarUrl() || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={handleAvatarClick}
                    type="button"
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
                    title="Change avatar"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role?.replace("_", " ")}</p>
              <p className="text-sm text-gray-500 mt-1">{user?.department}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Active
              </span>
            </div>
          </div>

          {/* Avatar Upload Info */}
          {isEditing && avatarFile && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">New avatar selected</p>
                  <p className="text-xs text-blue-700">
                    {avatarFile.name} ({(avatarFile.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {isEditing ? (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-xs text-gray-500">(Cannot be changed)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg">{formData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-xs text-gray-500">(Cannot be changed)</span>
                </label>
                <p className="text-gray-500 bg-gray-50 px-4 py-3 rounded-lg cursor-not-allowed">{user?.department}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg whitespace-pre-wrap">{formData.bio}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}

          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Profile Complete
                </h4>
                <p className="text-sm text-blue-800">
                  Your profile information helps colleagues and students connect with you. Keep it updated for the best
                  experience.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
