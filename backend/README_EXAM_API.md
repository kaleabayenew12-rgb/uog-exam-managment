# Exam Management API Documentation

## Overview
This document provides comprehensive documentation for the Exam Creation and Management API. The API supports creating exams with 14 different question types, managing exam lifecycle, and sending exams for department approval.

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
All exam endpoints require authentication using JWT Bearer tokens.

**Header Format:**
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

---

## Endpoints

### 1. Create Exam
Creates a new exam with questions and settings.

**Endpoint:** `POST /exams`

**Request Body:**
\`\`\`json
{
  "title": "Midterm Examination 2025",
  "subject": "Data Structures",
  "description": "This exam covers topics from chapters 1-5",
  "duration": 120,
  "totalMarks": 100,
  "passMark": 50,
  "status": "draft",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "text": "What is the time complexity of binary search?",
      "marks": 5,
      "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
      "correct": [1],
      "metadata": {
        "shuffle": true
      }
    }
  ],
  "settings": {
    "randomizeQuestions": false,
    "allowMultipleAttempts": false,
    "shuffleOptions": true,
    "negativeMark": false,
    "startDate": "2025-01-15T00:00:00Z",
    "endDate": "2025-01-15T02:00:00Z"
  }
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "success": true,
  "message": "Exam created successfully",
  "data": {
    "id": 1,
    "title": "Midterm Examination 2025",
    "subject": "Data Structures",
    "description": "This exam covers topics from chapters 1-5",
    "duration": 120,
    "total_marks": 100,
    "pass_mark": 50,
    "teacher_id": 1,
    "status": "draft",
    "questions": [...],
    "settings": {...},
    "version": 1,
    "created_at": "2025-01-10T10:30:00Z",
    "updated_at": "2025-01-10T10:30:00Z"
  }
}
\`\`\`

---

### 2. Get All Exams
Retrieves all exams created by the authenticated teacher.

**Endpoint:** `GET /exams`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Midterm Examination 2025",
      "subject": "Data Structures",
      "status": "draft",
      "total_marks": 100,
      "teacher_name": "Dr. John Smith",
      "created_at": "2025-01-10T10:30:00Z",
      "questions": [...],
      "settings": {...}
    }
  ]
}
\`\`\`

---

### 3. Get Single Exam
Retrieves a specific exam by ID.

**Endpoint:** `GET /exams/:id`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Midterm Examination 2025",
    "subject": "Data Structures",
    "description": "This exam covers topics from chapters 1-5",
    "duration": 120,
    "total_marks": 100,
    "pass_mark": 50,
    "teacher_id": 1,
    "teacher_name": "Dr. John Smith",
    "status": "draft",
    "questions": [...],
    "settings": {...},
    "version": 1,
    "created_at": "2025-01-10T10:30:00Z",
    "updated_at": "2025-01-10T10:30:00Z"
  }
}
\`\`\`

---

### 4. Update Exam
Updates an existing exam. Cannot update exams with status 'sent' or 'published'.

**Endpoint:** `PUT /exams/:id`

**Request Body:** Same as Create Exam

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Exam updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Midterm Examination 2025",
    ...
  }
}
\`\`\`

**Error Response (403 Forbidden):**
\`\`\`json
{
  "success": false,
  "message": "Cannot edit exam that has been sent for approval or published"
}
\`\`\`

---

### 5. Delete Exam
Deletes an exam.

**Endpoint:** `DELETE /exams/:id`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Exam deleted successfully"
}
\`\`\`

---

### 6. Send Exam to Department
Sends an exam to one or more departments for approval.

**Endpoint:** `POST /exams/:id/send-to-department`

**Request Body:**
\`\`\`json
{
  "departments": ["Computer Science", "Mathematics"],
  "message": "Please review this exam for approval. It covers the midterm syllabus."
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "message": "Exam sent to department for approval"
}
\`\`\`

**Notes:**
- Changes exam status to 'sent'
- Creates approval records for each department
- Exam cannot be edited after sending

---

### 7. Get Departments
Retrieves all available departments.

**Endpoint:** `GET /exams/departments/list`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Computer Science",
      "head_id": null,
      "created_at": "2025-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "name": "Mathematics",
      "head_id": null,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

---

### 8. Get User Subjects
Retrieves subjects available for the user's department.

**Endpoint:** `GET /users/subjects`

**Response (200 OK):**
\`\`\`json
{
  "success": true,
  "data": [
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
    "Web Development",
    "Artificial Intelligence",
    "Machine Learning"
  ]
}
\`\`\`

---

## Question Types

The API supports 14 different question types:

### Basic Question Types

#### 1. Multiple Choice (mcq)
\`\`\`json
{
  "id": "q1",
  "type": "mcq",
  "text": "What is the capital of France?",
  "marks": 2,
  "options": ["London", "Paris", "Berlin", "Madrid"],
  "correct": [1],
  "metadata": {
    "shuffle": true
  }
}
\`\`\`

#### 2. True/False (tf)
\`\`\`json
{
  "id": "q2",
  "type": "tf",
  "text": "The Earth is flat.",
  "marks": 1,
  "options": ["True", "False"],
  "correct": false
}
\`\`\`

#### 3. Short Answer (short)
\`\`\`json
{
  "id": "q3",
  "type": "short",
  "text": "What is the chemical formula for water?",
  "marks": 2,
  "correct": ["H2O", "h2o"],
  "metadata": {
    "caseSensitive": false
  }
}
\`\`\`

#### 4. Fill in the Blanks (fill)
\`\`\`json
{
  "id": "q4",
  "type": "fill",
  "text": "The ____ is the powerhouse of the cell.",
  "marks": 3,
  "metadata": {
    "blanks": [
      {
        "id": "b1",
        "position": 0,
        "acceptedAnswers": ["mitochondria", "Mitochondria"],
        "marks": 3
      }
    ]
  }
}
\`\`\`

#### 5. Matching (matching)
\`\`\`json
{
  "id": "q5",
  "type": "matching",
  "text": "Match the programming languages with their creators:",
  "marks": 5,
  "metadata": {
    "pairs": [
      {
        "id": "p1",
        "prompt": "Python",
        "response": "Guido van Rossum"
      },
      {
        "id": "p2",
        "prompt": "Java",
        "response": "James Gosling"
      }
    ]
  }
}
\`\`\`

#### 6. Essay (essay)
\`\`\`json
{
  "id": "q6",
  "type": "essay",
  "text": "Discuss the impact of artificial intelligence on modern society.",
  "marks": 10,
  "metadata": {
    "wordLimit": 500,
    "keywords": ["AI", "society", "technology", "ethics"]
  }
}
\`\`\`

#### 7. Code (code)
\`\`\`json
{
  "id": "q7",
  "type": "code",
  "text": "Write a function to reverse a string.",
  "marks": 10,
  "metadata": {
    "language": "python",
    "testCases": [
      {
        "input": "hello",
        "expectedOutput": "olleh",
        "isHidden": false
      }
    ]
  }
}
\`\`\`

#### 8. Diagram (diagram)
\`\`\`json
{
  "id": "q8",
  "type": "diagram",
  "text": "Label the parts of the human heart.",
  "marks": 8,
  "metadata": {
    "imageUrl": "/uploads/heart-diagram.png"
  }
}
\`\`\`

### Combined Question Types

#### 9. Diagram + MCQ (diagram-mcq)
\`\`\`json
{
  "id": "q9",
  "type": "diagram-mcq",
  "text": "Based on the diagram, what is structure A?",
  "marks": 3,
  "options": ["Atrium", "Ventricle", "Aorta", "Valve"],
  "correct": [0],
  "metadata": {
    "imageUrl": "/uploads/heart-diagram.png",
    "shuffle": true
  }
}
\`\`\`

#### 10. Diagram + True/False (diagram-tf)
\`\`\`json
{
  "id": "q10",
  "type": "diagram-tf",
  "text": "The diagram shows a series circuit.",
  "marks": 2,
  "options": ["True", "False"],
  "correct": true,
  "metadata": {
    "imageUrl": "/uploads/circuit-diagram.png"
  }
}
\`\`\`

#### 11. Diagram + Matching (diagram-matching)
\`\`\`json
{
  "id": "q11",
  "type": "diagram-matching",
  "text": "Match the labeled parts with their functions:",
  "marks": 6,
  "metadata": {
    "imageUrl": "/uploads/cell-diagram.png",
    "pairs": [
      {
        "id": "p1",
        "prompt": "Part A",
        "response": "Energy production"
      }
    ]
  }
}
\`\`\`

#### 12. Paragraph + MCQ (paragraph-mcq)
\`\`\`json
{
  "id": "q12",
  "type": "paragraph-mcq",
  "text": "According to the passage, what was the main cause?",
  "marks": 3,
  "options": ["Economic factors", "Political unrest", "Natural disaster", "Social change"],
  "correct": [1],
  "metadata": {
    "baseText": "The French Revolution was primarily caused by...",
    "shuffle": true
  }
}
\`\`\`

#### 13. Paragraph + True/False (paragraph-tf)
\`\`\`json
{
  "id": "q13",
  "type": "paragraph-tf",
  "text": "The passage states that photosynthesis occurs in animals.",
  "marks": 1,
  "options": ["True", "False"],
  "correct": false,
  "metadata": {
    "baseText": "Photosynthesis is the process by which plants..."
  }
}
\`\`\`

#### 14. Paragraph + Matching (paragraph-matching)
\`\`\`json
{
  "id": "q14",
  "type": "paragraph-matching",
  "text": "Match the characters with their roles in the story:",
  "marks": 5,
  "metadata": {
    "baseText": "In Shakespeare's Hamlet, the characters play various roles...",
    "pairs": [
      {
        "id": "p1",
        "prompt": "Hamlet",
        "response": "Prince of Denmark"
      }
    ]
  }
}
\`\`\`

---

## Exam Settings

The `settings` object supports the following options:

\`\`\`json
{
  "randomizeQuestions": false,      // Shuffle question order for each student
  "allowMultipleAttempts": false,   // Allow students to retake the exam
  "shuffleOptions": true,           // Shuffle answer options in MCQ/TF
  "negativeMark": false,            // Enable negative marking for wrong answers
  "startDate": "2025-01-15T00:00:00Z",  // Optional: Exam availability start
  "endDate": "2025-01-15T02:00:00Z"     // Optional: Exam availability end
}
\`\`\`

---

## Exam Status Flow

1. **draft** - Initial state, can be edited
2. **sent** - Sent to department for approval, cannot be edited
3. **approved** - Approved by department head
4. **rejected** - Rejected by department head
5. **published** - Published and available to students

---

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "success": false,
  "message": "Missing required fields: title, subject, duration, and at least one question"
}
\`\`\`

### 401 Unauthorized
\`\`\`json
{
  "success": false,
  "message": "No token provided"
}
\`\`\`

### 403 Forbidden
\`\`\`json
{
  "success": false,
  "message": "Cannot edit exam that has been sent for approval or published"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "success": false,
  "message": "Exam not found or you don't have permission to edit it"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "success": false,
  "message": "Error creating exam",
  "error": "Detailed error message"
}
\`\`\`

---

## Database Schema

### exams table
\`\`\`sql
CREATE TABLE exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  pass_mark INTEGER NOT NULL DEFAULT 0,
  teacher_id INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  questions TEXT NOT NULL,  -- JSON string
  settings TEXT NOT NULL,   -- JSON string
  version INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
)
\`\`\`

### exam_approvals table
\`\`\`sql
CREATE TABLE exam_approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id INTEGER NOT NULL,
  department_id INTEGER NOT NULL,
  approver_id INTEGER,
  status TEXT DEFAULT 'pending',
  comments TEXT,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
  FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
)
\`\`\`

---

## Testing the API

### Using cURL

**Create an exam:**
\`\`\`bash
curl -X POST http://localhost:5000/api/exams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Exam",
    "subject": "Computer Science",
    "duration": 60,
    "totalMarks": 50,
    "passMark": 25,
    "questions": [
      {
        "id": "q1",
        "type": "mcq",
        "text": "What is 2+2?",
        "marks": 5,
        "options": ["3", "4", "5", "6"],
        "correct": [1]
      }
    ],
    "settings": {
      "randomizeQuestions": false,
      "shuffleOptions": true
    }
  }'
\`\`\`

**Get all exams:**
\`\`\`bash
curl -X GET http://localhost:5000/api/exams \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

**Send to department:**
\`\`\`bash
curl -X POST http://localhost:5000/api/exams/1/send-to-department \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "departments": ["Computer Science"],
    "message": "Please review this exam"
  }'
\`\`\`

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Questions are stored as JSON strings in the database
- The API validates question structure before saving
- Teachers can only access their own exams
- Exams cannot be edited once sent for approval
- The `version` field tracks exam revisions

---

## Support

For issues or questions, please contact the development team or open an issue in the project repository.
