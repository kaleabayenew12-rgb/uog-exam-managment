# Profile Page API Documentation

Complete API documentation for the Profile Page functionality.

## Overview

The Profile Page allows users to view and update their profile information including:
- Profile picture (avatar)
- Full name
- Phone number
- Bio/description

Users can update all fields at once or update individual fields. The email and department fields are read-only and cannot be changed.

## Authentication

All profile endpoints require authentication. You must include a valid JWT token in the Authorization header:

\`\`\`
Authorization: Bearer your-jwt-token-here
\`\`\`

Get the token from the login response and store it in localStorage or a secure cookie.

## Endpoints

### 1. Get User Profile

Retrieve the current user's profile information.

**Endpoint:** \`GET /api/profile\`

**Headers:**
\`\`\`
Authorization: Bearer your-jwt-token
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "teacher@example.com",
    "name": "John Doe",
    "role": "teacher",
    "department": "Computer Science",
    "phone": "+1 (555) 123-4567",
    "bio": "Experienced teacher with 10+ years in education.",
    "avatar": "/uploads/avatars/avatar-1234567890.jpg",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-15 14:30:00"
  }
}
\`\`\`

**Error Response (401 Unauthorized):**
\`\`\`json
{
  "success": false,
  "message": "Access token required"
}
\`\`\`

**Error Response (404 Not Found):**
\`\`\`json
{
  "success": false,
  "message": "User not found"
}
\`\`\`

---

### 2. Update Profile Information

Update user profile fields (name, phone, bio) without changing the avatar.

**Endpoint:** \`PUT /api/profile\`

**Headers:**
\`\`\`
Authorization: Bearer your-jwt-token
Content-Type: application/json
\`\`\`

**Request Body:**
\`\`\`json
{
  "name": "John Smith",
  "phone": "+1 (555) 987-6543",
  "bio": "Senior teacher specializing in computer science and mathematics."
}
\`\`\`

**Notes:**
- All fields are optional - you can update just one field or all fields
- Email and department cannot be changed through this endpoint
- Empty strings are allowed for phone and bio (to clear them)

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "teacher@example.com",
    "name": "John Smith",
    "role": "teacher",
    "department": "Computer Science",
    "phone": "+1 (555) 987-6543",
    "bio": "Senior teacher specializing in computer science and mathematics.",
    "avatar": "/uploads/avatars/avatar-1234567890.jpg",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-15 15:45:00"
  }
}
\`\`\`

**Error Response (400 Bad Request):**
\`\`\`json
{
  "success": false,
  "message": "No fields to update"
}
\`\`\`

---

### 3. Upload Avatar Only

Upload or update the user's profile picture without changing other fields.

**Endpoint:** \`POST /api/profile/avatar\`

**Headers:**
\`\`\`
Authorization: Bearer your-jwt-token
Content-Type: multipart/form-data
\`\`\`

**Request Body (Form Data):**
- \`avatar\` (file): The image file to upload

**File Requirements:**
- Allowed formats: JPEG, JPG, PNG, GIF, WebP
- Maximum size: 5MB
- The old avatar will be automatically deleted

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "id": 1,
    "email": "teacher@example.com",
    "name": "John Smith",
    "role": "teacher",
    "department": "Computer Science",
    "phone": "+1 (555) 987-6543",
    "bio": "Senior teacher specializing in computer science and mathematics.",
    "avatar": "/uploads/avatars/avatar-9876543210.jpg",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-15 16:00:00"
  }
}
\`\`\`

**Error Response (400 Bad Request):**
\`\`\`json
{
  "success": false,
  "message": "No file uploaded"
}
\`\`\`

**Error Response (400 Bad Request - Invalid File):**
\`\`\`json
{
  "success": false,
  "message": "Only image files are allowed (JPEG, PNG, GIF, WebP)"
}
\`\`\`

---

### 4. Update Profile with Avatar

Update profile information AND avatar in a single request. This is the most efficient way to update everything at once.

**Endpoint:** \`PUT /api/profile/avatar\`

**Headers:**
\`\`\`
Authorization: Bearer your-jwt-token
Content-Type: multipart/form-data
\`\`\`

**Request Body (Form Data):**
- \`avatar\` (file, optional): The image file to upload
- \`name\` (text, optional): User's full name
- \`phone\` (text, optional): Phone number
- \`bio\` (text, optional): User bio/description

**Notes:**
- All fields are optional
- You can update just the avatar, just text fields, or everything together
- If avatar is not provided, only text fields will be updated
- Old avatar is deleted when a new one is uploaded

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "teacher@example.com",
    "name": "John Smith",
    "role": "teacher",
    "department": "Computer Science",
    "phone": "+1 (555) 987-6543",
    "bio": "Senior teacher with expertise in CS and Math.",
    "avatar": "/uploads/avatars/avatar-9876543210.jpg",
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-15 16:30:00"
  }
}
\`\`\`

---

## Frontend Integration

### Using the Profile API Service

The frontend includes a \`profileApi.ts\` service that wraps these endpoints:

\`\`\`typescript
import { profileApiService } from '../services/profileApi';

// Get profile
const response = await profileApiService.getProfile();

// Update profile (without avatar)
const response = await profileApiService.updateProfile({
  name: 'John Smith',
  phone: '+1 (555) 987-6543',
  bio: 'Updated bio'
});

// Update profile with avatar
const response = await profileApiService.updateProfileWithAvatar(
  {
    name: 'John Smith',
    phone: '+1 (555) 987-6543',
    bio: 'Updated bio'
  },
  avatarFile // File object from input
);

// Upload avatar only
const response = await profileApiService.uploadAvatar(avatarFile);
\`\`\`

### Profile Page Component

The \`ProfilePage.tsx\` component provides a complete UI for profile management:

**Features:**
- View mode: Display all profile information
- Edit mode: Update any field
- Avatar upload with preview
- File validation (size, type)
- Loading states
- Error handling
- Success notifications

**User Flow:**
1. User clicks "Edit Profile" button
2. Form fields become editable
3. User can click avatar to upload new image
4. User modifies any fields they want
5. User clicks "Save Changes" to submit
6. All changes are sent in one request
7. Profile is refreshed with updated data

### Avatar Display

Avatars are served from the backend at:
\`\`\`
http://localhost:5000/uploads/avatars/avatar-filename.jpg
\`\`\`

The frontend automatically constructs the full URL:
\`\`\`typescript
const avatarUrl = \`\${import.meta.env.VITE_API_URL}\${user.avatar}\`;
\`\`\`

---

## Testing Examples

### Using cURL

**Get Profile:**
\`\`\`bash
curl -X GET http://localhost:5000/api/profile \\
  -H "Authorization: Bearer your-token-here"
\`\`\`

**Update Profile:**
\`\`\`bash
curl -X PUT http://localhost:5000/api/profile \\
  -H "Authorization: Bearer your-token-here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Smith",
    "phone": "+1 (555) 987-6543",
    "bio": "Updated bio"
  }'
\`\`\`

**Upload Avatar:**
\`\`\`bash
curl -X POST http://localhost:5000/api/profile/avatar \\
  -H "Authorization: Bearer your-token-here" \\
  -F "avatar=@/path/to/image.jpg"
\`\`\`

**Update Profile with Avatar:**
\`\`\`bash
curl -X PUT http://localhost:5000/api/profile/avatar \\
  -H "Authorization: Bearer your-token-here" \\
  -F "avatar=@/path/to/image.jpg" \\
  -F "name=John Smith" \\
  -F "phone=+1 (555) 987-6543" \\
  -F "bio=Updated bio"
\`\`\`

---

## Error Handling

All endpoints follow consistent error response format:

\`\`\`json
{
  "success": false,
  "message": "Error description"
}
\`\`\`

**Common Error Codes:**
- \`400\` - Bad Request (missing fields, invalid data)
- \`401\` - Unauthorized (missing or invalid token)
- \`403\` - Forbidden (expired token)
- \`404\` - Not Found (user doesn't exist)
- \`500\` - Internal Server Error

**Frontend Error Handling:**
The ProfilePage component handles errors gracefully:
- Shows user-friendly error messages
- Maintains form state on error
- Allows retry without losing data
- Validates files before upload

---

## Security Considerations

1. **Authentication Required**: All endpoints require valid JWT token
2. **File Validation**: Server validates file type and size
3. **SQL Injection Protection**: Uses prepared statements
4. **Password Security**: Passwords are never returned in responses
5. **Old File Cleanup**: Old avatars are deleted to prevent storage bloat
6. **Token Expiration**: Tokens expire after 7 days

---

## Database Schema

The profile data is stored in the \`users\` table:

\`\`\`sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,           -- Cannot be changed
  password TEXT NOT NULL,                -- Not exposed in API
  name TEXT NOT NULL,                    -- Can be updated
  role TEXT NOT NULL DEFAULT 'teacher',  -- Cannot be changed
  department TEXT,                       -- Cannot be changed
  phone TEXT,                            -- Can be updated
  bio TEXT,                              -- Can be updated
  avatar TEXT,                           -- Can be updated
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
\`\`\`

---

## Quick Reference

| Action | Method | Endpoint | Body Type |
|--------|--------|----------|-----------|
| Get profile | GET | /api/profile | - |
| Update info | PUT | /api/profile | JSON |
| Upload avatar | POST | /api/profile/avatar | Form Data |
| Update all | PUT | /api/profile/avatar | Form Data |

**All endpoints require:** \`Authorization: Bearer <token>\`
\`\`\`

```ts file="" isHidden
