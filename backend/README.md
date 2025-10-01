# Exam Management System - Backend API

A complete backend API for the Exam Management System built with Express.js and SQLite.

## Features

- User authentication (register, login) with JWT
- Profile management with avatar upload
- SQLite database for data persistence
- Secure password hashing with bcrypt
- File upload support for profile pictures
- RESTful API design

## Installation

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:
   - Copy `.env` and update the values
   - Change `JWT_SECRET` to a secure random string

4. Start the server:
\`\`\`bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
\`\`\`

The server will start on http://localhost:5000

## Demo Accounts

The following demo teacher accounts are created automatically on first run:

| Name | Email | Password | Department |
|------|-------|----------|------------|
| John Doe | teacher@example.com | password123 | Computer Science |
| Dr. John Smith | teacher1@university.edu | Kale@1513 | Computer Science |
| Prof. Maria Garcia | teacher2@university.edu | Kale@1513 | Mathematics |
| Dr. Robert Brown | teacher3@university.edu | Kale@1513 | Physics |

**Note:** These accounts match the demo credentials shown in the frontend login page.

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "department": "Computer Science",
  "phone": "+1 (555) 123-4567",
  "bio": "Experienced teacher"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "teacher",
    "department": "Computer Science",
    "phone": "+1 (555) 123-4567",
    "bio": "Experienced teacher",
    "avatar": null
  }
}
\`\`\`

#### POST /api/auth/login
Login with email and password.

**Request Body:**
\`\`\`json
{
  "email": "teacher@example.com",
  "password": "password123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "teacher@example.com",
    "name": "John Doe",
    "role": "teacher",
    "department": "Computer Science",
    "phone": "+1 (555) 123-4567",
    "bio": "Experienced teacher with 10+ years in education.",
    "avatar": null
  }
}
\`\`\`

### Profile Management

All profile endpoints require authentication. Include the JWT token in the Authorization header:
\`\`\`
Authorization: Bearer your-jwt-token-here
\`\`\`

#### GET /api/profile
Get the current user's profile.

**Response:**
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
    "updated_at": "2024-01-01 10:00:00"
  }
}
\`\`\`

#### PUT /api/profile
Update profile information (name, phone, bio).

**Request Body:**
\`\`\`json
{
  "name": "John Smith",
  "phone": "+1 (555) 987-6543",
  "bio": "Updated bio text"
}
\`\`\`

**Response:**
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
    "bio": "Updated bio text",
    "avatar": "/uploads/avatars/avatar-1234567890.jpg"
  }
}
\`\`\`

#### POST /api/profile/avatar
Upload a new profile avatar (image only).

**Request:**
- Content-Type: multipart/form-data
- Field name: \`avatar\`
- Allowed formats: JPEG, PNG, GIF, WebP
- Max size: 5MB

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "id": 1,
    "email": "teacher@example.com",
    "name": "John Doe",
    "avatar": "/uploads/avatars/avatar-1234567890.jpg"
  }
}
\`\`\`

#### PUT /api/profile/avatar
Update profile information AND avatar in one request.

**Request:**
- Content-Type: multipart/form-data
- Fields:
  - \`avatar\` (file, optional)
  - \`name\` (text, optional)
  - \`phone\` (text, optional)
  - \`bio\` (text, optional)

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "teacher@example.com",
    "name": "John Smith",
    "phone": "+1 (555) 987-6543",
    "bio": "Updated bio",
    "avatar": "/uploads/avatars/avatar-1234567890.jpg"
  }
}
\`\`\`

## Database Schema

### Users Table
\`\`\`sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher',
  department TEXT,
  phone TEXT,
  bio TEXT,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
\`\`\`

## Error Handling

All endpoints return errors in this format:
\`\`\`json
{
  "success": false,
  "message": "Error description here"
}
\`\`\`

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Token expiration (7 days)
- File upload validation
- SQL injection protection with prepared statements
- CORS enabled for frontend integration

## File Uploads

- Avatar images are stored in \`backend/uploads/avatars/\`
- Old avatars are automatically deleted when uploading new ones
- Files are served statically at \`/uploads/avatars/filename\`
- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, GIF, WebP

## Development

The backend uses:
- **Express.js** - Web framework
- **better-sqlite3** - SQLite database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing

## Testing the API

You can test the API using:
- Postman
- cURL
- Thunder Client (VS Code extension)
- Your frontend application

Example cURL request:
\`\`\`bash
# Login
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"teacher@example.com","password":"password123"}'

# Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/profile \\
  -H "Authorization: Bearer TOKEN"
