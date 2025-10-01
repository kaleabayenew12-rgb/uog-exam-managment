import { apiService } from "./apiService"

export interface ProfileData {
  name: string
  phone: string
  bio: string
  avatar?: string
}

export interface ProfileResponse {
  success: boolean
  data?: ProfileData
  message?: string
}

class ProfileApiService {
  async getProfile(): Promise<ProfileResponse> {
    return apiService.request("/profile", { method: "GET" })
  }

  async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileResponse> {
    return apiService.request("/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  async updateProfileWithAvatar(profileData: Partial<ProfileData>, avatarFile?: File): Promise<ProfileResponse> {
    if (avatarFile) {
      const formData = new FormData()

      // Add text fields if provided
      if (profileData.name) formData.append("name", profileData.name)
      if (profileData.phone !== undefined) formData.append("phone", profileData.phone)
      if (profileData.bio !== undefined) formData.append("bio", profileData.bio)

      // Add avatar file
      formData.append("avatar", avatarFile)

      return apiService.request("/profile/avatar", {
        method: "PUT",
        body: formData,
      })
    } else {
      return this.updateProfile(profileData)
    }
  }

  async uploadAvatar(avatarFile: File): Promise<ProfileResponse> {
    const formData = new FormData()
    formData.append("avatar", avatarFile)

    return apiService.request("/profile/avatar", {
      method: "POST",
      body: formData,
    })
  }
}

export const profileApiService = new ProfileApiService()
