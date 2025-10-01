# Exam Management System

A comprehensive exam management platform for educational institutions, built with React, TypeScript, Express.js, and SQLite.

## Features

### For Teachers
- Create and manage exams with multiple question types
- Send exams for departmental approval
- Grade student submissions
- View detailed analytics and reports
- Manage student records

### For Department Heads
- Review and approve/reject exams
- Monitor department-wide exam statistics
- Oversee exam quality

### For Students (Future Enhancement)
- Take online exams
- View results and performance
- Track progress over time

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide Icons** for UI icons
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **SQLite** with better-sqlite3
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Express Validator** for input validation

## Project Structure

```
project-root/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Dashboard/
│   │   │   ├── Exams/
│   │   │   ├── Layout/
│   │   │   └── Questions/
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service files
│   │   └── types/             # TypeScript definitions
│   ├── .env                   # Frontend environment variables
│   └── package.json
│
├── backend/                   # Express backend API
│   ├── config/                # Configuration files
│   ├── database/              # Database setup & seeders
│   ├── middleware/            # Express middleware
│   ├── models/                # Database models
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   ├── routes/                # API routes
│   ├── uploads/               # File uploads directory
│   ├── .env                   # Backend environment variables
│   ├── server.js              # Entry point
│   └── package.json
│
├── API_DOCUMENTATION.md       # Complete API documentation
├── PAGES_DOCUMENTATION.md     # Frontend pages documentation
└── README.md                  # This file
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy .env and update if needed
# Default values work for local development
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Create/update .env file
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Test Credentials

After the backend starts and seeds the database, use these credentials:

### Teacher Account
- **Email:** `teacher@example.com`
- **Password:** `password123`

### Department Head Account
- **Email:** `head@example.com`
- **Password:** `password123`

## API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`

### Key Endpoints:

- **Authentication:** `/api/auth/login`, `/api/auth/register`
- **Profile:** `/api/profile`
- **Exams:** `/api/exams`
- **Students:** `/api/students`
- **Reports:** `/api/reports`
- **Departments:** `/api/departments`
- **Subjects:** `/api/subjects`
- **Uploads:** `/api/upload`

## Frontend Pages Documentation

Detailed frontend pages documentation is available in `PAGES_DOCUMENTATION.md`

### Available Pages:

1. **Dashboard** - Overview and statistics
2. **Profile** - User profile management
3. **Exams** - Exam listing and management
4. **Create Exam** - Create/edit exams with multiple question types
5. **Students** - Student management
6. **Reports** - Analytics and reporting

## Question Types Supported

The system supports 14 different question types:

1. **Multiple Choice (MCQ)** - Single or multiple correct answers
2. **True/False** - Binary choice questions
3. **Short Answer** - Text-based short responses
4. **Fill in the Blanks** - Complete sentences with missing words
5. **Matching** - Match pairs of items
6. **Essay** - Long-form written responses
7. **Code** - Programming questions with test cases
8. **Diagram** - Image-based questions
9. **Diagram + MCQ** - Diagram with multiple choice
10. **Diagram + True/False** - Diagram with true/false
11. **Diagram + Matching** - Diagram with matching
12. **Paragraph + MCQ** - Reading comprehension with MCQ
13. **Paragraph + True/False** - Reading with true/false
14. **Paragraph + Matching** - Reading with matching

## Key Features

### Exam Creation
- Drag-and-drop question ordering
- Question bank integration (future)
- Bulk import questions (future)
- Randomization options
- Time limits and scheduling

### Exam Approval Workflow
1. Teacher creates exam (status: draft)
2. Teacher sends for approval (status: sent)
3. Department head reviews
4. Approve (status: approved) or Reject (status: rejected)
5. Publish exam (status: published)

### Grading System
- Auto-grading for objective questions
- Manual grading for subjective questions
- Partial marking support
- Grade override capability
- Bulk grading tools

### Reports & Analytics
- Exam performance statistics
- Student performance tracking
- Pass/fail rates
- Grade distribution
- Department-wise analytics

### File Upload
- Avatar upload for profiles
- Image upload for questions
- Maximum file size: 5MB
- Supported formats: JPEG, PNG, GIF, WebP

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## Database Schema

### Main Tables:
- `users` - System users (teachers, heads, admins)
- `departments` - Academic departments
- `subjects` - Course subjects
- `exams` - Exam definitions
- `questions` - Exam questions
- `exam_departments` - Exam-department mapping
- `approvals` - Exam approval records
- `students` - Student records
- `exam_results` - Exam attempt results

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
DB_PATH=./database/exam_management.db
UPLOAD_DIR=./uploads
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Response Format

All API responses follow this structure:

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ]
}
```

## Testing

### Manual Testing
Use the test credentials provided above to test different user roles.

### API Testing
Use tools like Postman or cURL to test API endpoints.

Example:
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@example.com","password":"password123"}'

# Get exams (with token)
curl -X GET http://localhost:5000/api/exams \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify all dependencies are installed
- Check database permissions

### Frontend can't connect to backend
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Check CORS configuration

### Database errors
- Delete the .db file and restart backend to reseed
- Check database file permissions
- Verify SQLite is supported on your system

## Future Enhancements

- [ ] Student portal for taking exams
- [ ] Real-time exam monitoring
- [ ] Question bank system
- [ ] Bulk question import (CSV, Excel)
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Exam scheduling system
- [ ] Mobile responsive improvements
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] PDF export for reports
- [ ] Plagiarism detection (for code questions)
- [ ] Video proctoring integration
- [ ] Automated exam scheduling
- [ ] Grade curves and adjustments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions:
- Check the documentation files
- Review API documentation
- Check console logs for errors
- Verify environment variables

## Acknowledgments

- React Team for the amazing framework
- Express.js community
- SQLite for the lightweight database
- All open-source contributors

---

**Built with ❤️ for educational institutions**
