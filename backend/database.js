import Database from "better-sqlite3"
import bcrypt from "bcryptjs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Database(join(__dirname, "exam_management.db"))

// Enable foreign keys
db.pragma("foreign_keys = ON")

// Initialize database schema
export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
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
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_information (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT,
      teacher_id INTEGER NOT NULL,
      status TEXT DEFAULT 'draft',
      version INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL UNIQUE,
      duration INTEGER NOT NULL,
      total_marks INTEGER NOT NULL,
      pass_mark INTEGER NOT NULL DEFAULT 0,
      randomize_questions BOOLEAN DEFAULT 0,
      allow_multiple_attempts BOOLEAN DEFAULT 0,
      shuffle_options BOOLEAN DEFAULT 0,
      negative_mark BOOLEAN DEFAULT 0,
      start_date DATETIME,
      end_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // True/False Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS true_false_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer BOOLEAN NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Multiple Choice Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS multiple_choice_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT,
      option_d TEXT,
      option_e TEXT,
      correct_answers TEXT NOT NULL,
      marks INTEGER NOT NULL,
      shuffle BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Short Answer Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS short_answer_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      marks INTEGER NOT NULL,
      case_sensitive BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Fill in the Blank Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS fill_blank_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      blanks TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Matching Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS matching_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      pairs TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Essay Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS essay_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      keywords TEXT,
      word_limit INTEGER,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Code Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS code_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      language TEXT NOT NULL,
      test_cases TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Diagram Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagram_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      image_url TEXT NOT NULL,
      answer TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Diagram MCQ Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagram_mcq_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      image_url TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT,
      option_d TEXT,
      correct_answers TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Diagram True/False Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagram_tf_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      image_url TEXT NOT NULL,
      answer BOOLEAN NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Diagram Matching Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS diagram_matching_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      question TEXT NOT NULL,
      image_url TEXT NOT NULL,
      pairs TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Paragraph MCQ Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS paragraph_mcq_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      base_text TEXT NOT NULL,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT,
      option_d TEXT,
      correct_answers TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Paragraph True/False Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS paragraph_tf_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      base_text TEXT NOT NULL,
      question TEXT NOT NULL,
      answer BOOLEAN NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  // Paragraph Matching Questions
  db.exec(`
    CREATE TABLE IF NOT EXISTS paragraph_matching_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      base_text TEXT NOT NULL,
      question TEXT NOT NULL,
      pairs TEXT NOT NULL,
      marks INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      head_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      department_id INTEGER NOT NULL,
      approver_id INTEGER,
      status TEXT DEFAULT 'pending',
      comments TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
      FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `)

  // Students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      grade TEXT NOT NULL,
      department TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      marks_obtained INTEGER NOT NULL,
      percentage REAL NOT NULL,
      grade TEXT,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_information(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `)

  const defaultDepartments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
  ]

  defaultDepartments.forEach((dept) => {
    const existing = db.prepare("SELECT * FROM departments WHERE name = ?").get(dept)
    if (!existing) {
      db.prepare("INSERT INTO departments (name) VALUES (?)").run(dept)
    }
  })

  // Create demo teacher accounts if they don't exist
  const demoTeachers = [
    {
      email: "teacher@example.com",
      password: "password123",
      name: "John Doe",
      department: "Computer Science",
      phone: "+1 (555) 123-4567",
      bio: "Experienced teacher with 10+ years in education.",
    },
    {
      email: "teacher1@university.edu",
      password: "Kale@1513",
      name: "Dr. John Smith",
      department: "Computer Science",
      phone: "+1 (555) 234-5678",
      bio: "Computer Science professor specializing in algorithms and data structures.",
    },
    {
      email: "teacher2@university.edu",
      password: "Kale@1513",
      name: "Prof. Maria Garcia",
      department: "Mathematics",
      phone: "+1 (555) 345-6789",
      bio: "Mathematics professor with expertise in calculus and linear algebra.",
    },
    {
      email: "teacher3@university.edu",
      password: "Kale@1513",
      name: "Dr. Robert Brown",
      department: "Physics",
      phone: "+1 (555) 456-7890",
      bio: "Physics professor focusing on quantum mechanics and thermodynamics.",
    },
  ]

  demoTeachers.forEach((teacher) => {
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(teacher.email)

    if (!existingUser) {
      const hashedPassword = bcrypt.hashSync(teacher.password, 10)
      db.prepare(`
        INSERT INTO users (email, password, name, role, department, phone, bio)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(teacher.email, hashedPassword, teacher.name, "teacher", teacher.department, teacher.phone, teacher.bio)
      console.log(`Demo teacher account created: ${teacher.email} / ${teacher.password}`)
    }
  })

  console.log("Database initialized successfully")
}

export default db
