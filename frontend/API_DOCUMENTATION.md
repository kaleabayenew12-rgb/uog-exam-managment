# Frontend API Documentation

This document provides comprehensive documentation for all API endpoints used in the Teacher Exam Management System frontend.

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Dashboard API](#dashboard-api)
3. [Exams API](#exams-api)
4. [Reports API](#reports-api)
5. [Students API](#students-api)
6. [Profile API](#profile-api)
7. [File Upload API](#file-upload-api)

---

## Authentication API

### Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate a teacher and receive an access token.

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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "teacher@example.com",
    "name": "John Doe",
    "role": "teacher",
    "department": "Computer Science"
  }
}
\`\`\`

**Usage in Frontend:**
\`\`\`typescript
import { apiService } from './services/apiService';

const response = await apiService.login({ 
  email: 'teacher@example.com', 
  password: 'password123' 
});
\`\`\`

---

## Dashboard API

### Get Dashboard Statistics
**Endpoint:** `GET /api/reports/dashboard`

**Description:** Retrieve overall statistics for the teacher's dashboard including exam counts, questions, and recent activity.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "totalExams": 25,
    "draftExams": 5,
    "publishedExams": 15,
    "sentExams": 3,
    "approvedExams": 2,
    "totalQuestions": 250,
    "monthlyExams": 8,
    "recentActivity": [
      {
        "id": "1",
        "title": "Advanced Data Structures Midterm",
        "status": "published",
        "timestamp": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
\`\`\`

**Usage in Frontend:**
\`\`\`typescript
import { dashboardApiService } from './services/dashboardApi';

// Get dashboard stats
const stats = await dashboardApiService.getDashboardStats();

// Get exam counts by status
const counts = await dashboardApiService.getExamCounts();

// Get recent exams
const exams = await dashboardApiService.getExams({ limit: 5 });
\`\`\`

**Page:** `Dashboard.tsx`

---

## Exams API

### Get All Exams
**Endpoint:** `GET /api/exams`

**Description:** Retrieve all exams with optional filtering.

**Query Parameters:**
- `search` (string): Search by title or subject
- `status` (string): Filter by status (draft, sent, approved, rejected, published)
- `subject` (string): Filter by subject
- `department` (string): Filter by department

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Advanced Data Structures Midterm",
      "subject": "Computer Science",
      "description": "Comprehensive midterm covering trees, graphs",
      "duration": 120,
      "totalMarks": 100,
      "passMark": 60,
      "status": "published",
      "questions": [...],
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    }
  ]
}
\`\`\`

### Get Single Exam
**Endpoint:** `GET /api/exams/:id`

**Description:** Retrieve detailed information for a specific exam.

### Create Exam
**Endpoint:** `POST /api/exams`

**Description:** Create a new exam.

**Request Body:**
\`\`\`json
{
  "title": "Database Systems Quiz",
  "subject": "Computer Science",
  "description": "Quick quiz on normalization",
  "duration": 45,
  "totalMarks": 30,
  "passMark": 18,
  "questions": [
    {
      "type": "mcq",
      "text": "What is normalization?",
      "marks": 5,
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correct": [1]
    }
  ],
  "settings": {
    "randomizeQuestions": true,
    "allowMultipleAttempts": false,
    "shuffleOptions": true,
    "negativeMark": false
  }
}
\`\`\`

### Update Exam
**Endpoint:** `PUT /api/exams/:id`

**Description:** Update an existing exam.

### Delete Exam
**Endpoint:** `DELETE /api/exams/:id`

**Description:** Delete an exam.

### Send Exam to Department
**Endpoint:** `POST /api/exams/:id/send-department`

**Description:** Send an exam to the department for approval.

**Usage in Frontend:**
\`\`\`typescript
import { examsApiService } from './services/examsApi';

// Get all exams with filters
const exams = await examsApiService.getExams({ 
  search: 'database', 
  status: 'published' 
});

// Get single exam
const exam = await examsApiService.getExam('1');

// Create exam
const newExam = await examsApiService.createExam({
  title: 'New Exam',
  subject: 'Computer Science',
  // ... other fields
});

// Update exam
const updated = await examsApiService.updateExam('1', { title: 'Updated Title' });

// Delete exam
await examsApiService.deleteExam('1');

// Send to department
await examsApiService.sendExamToDepartment('1');

// Upload image for question
const imageResult = await examsApiService.uploadImage(file);
\`\`\`

**Page:** `ExamsPage.tsx`, `CreateExamPage.tsx`

---

## Reports API

### Get Exam Reports
**Endpoint:** `GET /api/reports/exams`

**Description:** Retrieve statistical reports for all exams.

**Query Parameters:**
- `subject` (string): Filter by subject
- `startDate` (string): Filter by start date (ISO format)
- `endDate` (string): Filter by end date (ISO format)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "exam_id": 1,
      "exam_title": "Advanced Data Structures Midterm",
      "subject": "Computer Science",
      "total_students": 45,
      "average_score": 78.5,
      "pass_rate": 85.5,
      "completion_rate": 95.5,
      "total_marks": 100,
      "highest_score": 98,
      "lowest_score": 45
    }
  ]
}
\`\`\`

### Get Exam Results
**Endpoint:** `GET /api/reports/exams/:id/results`

**Description:** Retrieve detailed student results for a specific exam.

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": "S12345",
      "student_name": "Jane Smith",
      "score": 85,
      "total_marks": 100,
      "percentage": 85,
      "grade": "A",
      "time_spent": 110,
      "submitted_at": "2024-01-20T14:30:00Z",
      "answers": [...]
    }
  ]
}
\`\`\`

### Export Exam Report
**Endpoint:** `GET /api/reports/exams/:id/export`

**Description:** Export exam report as CSV file.

**Usage in Frontend:**
\`\`\`typescript
import { reportsApiService } from './services/reportsApi';

// Get exam reports with filters
const reports = await reportsApiService.getExamReports({
  subject: 'Computer Science',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

// Get results for specific exam
const results = await reportsApiService.getExamResults('1');

// Export report as CSV
const blob = await reportsApiService.exportExamReport('1');
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'exam-report.csv';
a.click();
\`\`\`

**Page:** `ReportsPage.tsx`

---

## Students API

### Get All Students
**Endpoint:** `GET /api/students`

**Description:** Retrieve all students with optional filtering.

**Query Parameters:**
- `search` (string): Search by name or student ID
- `department` (string): Filter by department

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": "S12345",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "department": "Computer Science",
      "total_exams_taken": 12,
      "average_score": 85.5,
      "total_marks_obtained": 1026,
      "total_possible_marks": 1200
    }
  ]
}
\`\`\`

### Get Student Details
**Endpoint:** `GET /api/students/:id`

**Description:** Retrieve detailed information for a specific student including all exam results.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "student": {
      "id": 1,
      "student_id": "S12345",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "department": "Computer Science"
    },
    "examResults": [
      {
        "id": 1,
        "exam_id": 1,
        "exam_title": "Data Structures Midterm",
        "subject": "Computer Science",
        "score": 85,
        "total_marks": 100,
        "grade": "A",
        "time_spent": 110,
        "submitted_at": "2024-01-20T14:30:00Z"
      }
    ]
  }
}
\`\`\`

### Update Student Grade
**Endpoint:** `PATCH /api/students/:studentId/results/:resultId/grade`

**Description:** Update a student's grade for a specific exam result.

**Request Body:**
\`\`\`json
{
  "grade": "A+",
  "score": 95
}
\`\`\`

### Add Student
**Endpoint:** `POST /api/students`

**Description:** Add a new student to the system.

### Export Students
**Endpoint:** `GET /api/students/export`

**Description:** Export students data as CSV file.

**Usage in Frontend:**
\`\`\`typescript
import { studentsApiService } from './services/studentsApi';

// Get all students with filters
const students = await studentsApiService.getStudents({
  search: 'jane',
  department: 'Computer Science'
});

// Get student details
const studentDetails = await studentsApiService.getStudent('S12345');

// Update grade
await studentsApiService.updateStudentGrade('S12345', '1', {
  grade: 'A+',
  score: 95
});

// Add new student
const newStudent = await studentsApiService.addStudent({
  student_id: 'S67890',
  name: 'John Doe',
  email: 'john@example.com',
  department: 'Computer Science'
});

// Export students as CSV
const blob = await studentsApiService.exportStudents({ department: 'Computer Science' });
\`\`\`

**Page:** `StudentsPage.tsx`

---

## Profile API

### Get Profile
**Endpoint:** `GET /api/profile`

**Description:** Retrieve the current user's profile information.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "1",
    "email": "teacher@example.com",
    "name": "John Doe",
    "role": "teacher",
    "department": "Computer Science",
    "phone": "+1 (555) 123-4567",
    "bio": "Experienced computer science teacher",
    "avatar": "/uploads/avatars/teacher1.jpg"
  }
}
\`\`\`

### Update Profile
**Endpoint:** `PUT /api/profile`

**Description:** Update the current user's profile information.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",
  "phone": "+1 (555) 123-4567",
  "bio": "Experienced computer science teacher"
}
\`\`\`

### Update Profile with Avatar
**Endpoint:** `PUT /api/profile/avatar`

**Description:** Update profile information including avatar image.

**Request:** Multipart form data with fields: `name`, `phone`, `bio`, `avatar` (file)

**Usage in Frontend:**
\`\`\`typescript
import { profileApiService } from './services/profileApi';

// Get profile
const profile = await profileApiService.getProfile();

// Update profile without avatar
await profileApiService.updateProfile({
  name: 'John Doe',
  phone: '+1 (555) 123-4567',
  bio: 'Updated bio'
});

// Update profile with avatar
await profileApiService.updateProfileWithAvatar(
  {
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    bio: 'Updated bio'
  },
  avatarFile // File object
);

// Upload only avatar
await profileApiService.uploadAvatar(avatarFile);
\`\`\`

**Page:** `ProfilePage.tsx`

---

## File Upload API

### Upload Image
**Endpoint:** `POST /api/upload/image`

**Description:** Upload an image file for use in exam questions.

**Request:** Multipart form data with `image` field

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "url": "/uploads/images/question-image-123.jpg"
  }
}
\`\`\`

### Delete Image
**Endpoint:** `DELETE /api/upload/image`

**Description:** Delete an uploaded image file.

**Request Body:**
\`\`\`json
{
  "filePath": "/uploads/images/question-image-123.jpg"
}
\`\`\`

**Usage in Frontend:**
\`\`\`typescript
import { apiService } from './services/apiService';

// Upload image
const result = await apiService.uploadImage(imageFile);
const imageUrl = result.data.url;

// Delete image
await apiService.deleteImage('/uploads/images/question-image-123.jpg');
\`\`\`

---

## Error Handling

All API endpoints follow a consistent error response format:

\`\`\`json
{
  "success": false,
  "message": "Error description here"
}
\`\`\`

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

**Frontend Error Handling Example:**
\`\`\`typescript
try {
  const response = await examsApiService.createExam(examData);
  if (response.success) {
    // Handle success
    console.log('Exam created:', response.data);
  } else {
    // Handle API error
    alert(response.message || 'An error occurred');
  }
} catch (error) {
  // Handle network or unexpected errors
  console.error('Error:', error);
  alert('Network error. Please try again.');
}
\`\`\`

---

## Authentication

All API requests (except login) require authentication using a Bearer token in the Authorization header:

\`\`\`
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

The token is automatically managed by the `apiService` class and stored in `localStorage` after successful login.

---

## Environment Variables

The frontend uses the following environment variable:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

This is configured in `frontend/.env` and accessed via `import.meta.env.VITE_API_URL`.

---

## Service Files Summary

| Service File | Purpose | Pages Using It |
|-------------|---------|----------------|
| `apiService.ts` | Core API client with all endpoints | All pages |
| `dashboardApi.ts` | Dashboard-specific operations | Dashboard |
| `examsApi.ts` | Exam CRUD operations | ExamsPage, CreateExamPage |
| `reportsApi.ts` | Reports and statistics | ReportsPage |
| `studentsApi.ts` | Student management | StudentsPage |
| `profileApi.ts` | User profile operations | ProfilePage |

---

## Quick Reference

### Dashboard Page APIs
- `dashboardApiService.getDashboardStats()` - Get overall statistics
- `dashboardApiService.getExams()` - Get recent exams
- `dashboardApiService.getExamCounts()` - Get exam counts by status

### Exams Page APIs
- `examsApiService.getExams(filters)` - List all exams with filters
- `examsApiService.getExam(id)` - Get single exam
- `examsApiService.createExam(data)` - Create new exam
- `examsApiService.updateExam(id, data)` - Update exam
- `examsApiService.deleteExam(id)` - Delete exam
- `examsApiService.sendExamToDepartment(id)` - Send for approval

### Reports Page APIs
- `reportsApiService.getExamReports(filters)` - Get exam statistics
- `reportsApiService.getExamResults(examId)` - Get student results
- `reportsApiService.exportExamReport(examId)` - Export as CSV

### Students Page APIs
- `studentsApiService.getStudents(filters)` - List all students
- `studentsApiService.getStudent(id)` - Get student details
- `studentsApiService.updateStudentGrade(studentId, resultId, data)` - Update grade
- `studentsApiService.exportStudents(filters)` - Export as CSV

### Profile Page APIs
- `profileApiService.getProfile()` - Get current user profile
- `profileApiService.updateProfile(data)` - Update profile
- `profileApiService.updateProfileWithAvatar(data, file)` - Update with avatar
