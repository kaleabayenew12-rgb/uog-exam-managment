import express from "express"
import db from "../database.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Helper function to get question table name based on type
function getQuestionTableName(type) {
  const tableMap = {
    tf: "true_false_questions",
    mcq: "multiple_choice_questions",
    short: "short_answer_questions",
    fill: "fill_blank_questions",
    matching: "matching_questions",
    essay: "essay_questions",
    code: "code_questions",
    diagram: "diagram_questions",
    "diagram-mcq": "diagram_mcq_questions",
    "diagram-tf": "diagram_tf_questions",
    "diagram-matching": "diagram_matching_questions",
    "paragraph-mcq": "paragraph_mcq_questions",
    "paragraph-tf": "paragraph_tf_questions",
    "paragraph-matching": "paragraph_matching_questions",
  }
  return tableMap[type]
}

// Helper function to save question based on type
function saveQuestion(examId, question, questionNumber) {
  const type = question.type
  const marks = question.marks
  const text = question.text

  switch (type) {
    case "tf":
      db.prepare(`
        INSERT INTO true_false_questions (exam_id, question_number, question, answer, marks)
        VALUES (?, ?, ?, ?, ?)
      `).run(examId, questionNumber, text, question.correct ? 1 : 0, marks)
      break

    case "mcq":
      const options = question.options || []
      const correctAnswers = Array.isArray(question.correct) ? question.correct.join(",") : String(question.correct)
      db.prepare(`
        INSERT INTO multiple_choice_questions 
        (exam_id, question_number, question, option_a, option_b, option_c, option_d, option_e, correct_answers, marks, shuffle)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        examId,
        questionNumber,
        text,
        options[0] || "",
        options[1] || "",
        options[2] || null,
        options[3] || null,
        options[4] || null,
        correctAnswers,
        marks,
        question.metadata?.shuffle ? 1 : 0,
      )
      break

    case "short":
      db.prepare(`
        INSERT INTO short_answer_questions (exam_id, question_number, question, answer, marks, case_sensitive)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(examId, questionNumber, text, question.correct || "", marks, question.metadata?.caseSensitive ? 1 : 0)
      break

    case "fill":
      db.prepare(`
        INSERT INTO fill_blank_questions (exam_id, question_number, question, blanks, marks)
        VALUES (?, ?, ?, ?, ?)
      `).run(examId, questionNumber, text, JSON.stringify(question.metadata?.blanks || []), marks)
      break

    case "matching":
      db.prepare(`
        INSERT INTO matching_questions (exam_id, question_number, question, pairs, marks)
        VALUES (?, ?, ?, ?, ?)
      `).run(examId, questionNumber, text, JSON.stringify(question.metadata?.pairs || []), marks)
      break

    case "essay":
      db.prepare(`
        INSERT INTO essay_questions (exam_id, question_number, question, keywords, word_limit, marks)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        examId,
        questionNumber,
        text,
        JSON.stringify(question.metadata?.keywords || []),
        question.metadata?.wordLimit || null,
        marks,
      )
      break

    case "code":
      db.prepare(`
        INSERT INTO code_questions (exam_id, question_number, question, language, test_cases, marks)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        examId,
        questionNumber,
        text,
        question.metadata?.language || "javascript",
        JSON.stringify(question.metadata?.testCases || []),
        marks,
      )
      break

    case "diagram":
      db.prepare(`
        INSERT INTO diagram_questions (exam_id, question_number, question, image_url, answer, marks)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(examId, questionNumber, text, question.metadata?.imageUrl || "", question.correct || "", marks)
      break

    case "diagram-mcq":
      const diagramMcqOptions = question.options || []
      const diagramMcqCorrect = Array.isArray(question.correct) ? question.correct.join(",") : String(question.correct)
      db.prepare(`
        INSERT INTO diagram_mcq_questions 
        (exam_id, question_number, question, image_url, option_a, option_b, option_c, option_d, correct_answers, marks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        examId,
        questionNumber,
        text,
        question.metadata?.imageUrl || "",
        diagramMcqOptions[0] || "",
        diagramMcqOptions[1] || "",
        diagramMcqOptions[2] || null,
        diagramMcqOptions[3] || null,
        diagramMcqCorrect,
        marks,
      )
      break

    case "diagram-tf":
      db.prepare(`
        INSERT INTO diagram_tf_questions (exam_id, question_number, question, image_url, answer, marks)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(examId, questionNumber, text, question.metadata?.imageUrl || "", question.correct ? 1 : 0, marks)
      break

    case "diagram-matching":
      db.prepare(`
        INSERT INTO diagram_matching_questions (exam_id, question_number, question, image_url, pairs, marks)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        examId,
        questionNumber,
        text,
        question.metadata?.imageUrl || "",
        JSON.stringify(question.metadata?.pairs || []),
        marks,
      )
      break

    case "paragraph-mcq":
      const paraMcqOptions = question.options || []
      const paraMcqCorrect = Array.isArray(question.correct) ? question.correct.join(",") : String(question.correct)
      db.prepare(`
        INSERT INTO paragraph_mcq_questions 
        (exam_id, question_number, base_text, question, option_a, option_b, option_c, option_d, correct_answers, marks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        examId,
        questionNumber,
        question.metadata?.baseText || "",
        text,
        paraMcqOptions[0] || "",
        paraMcqOptions[1] || "",
        paraMcqOptions[2] || null,
        paraMcqOptions[3] || null,
        paraMcqCorrect,
        marks,
      )
      break

    case "paragraph-tf":
      db.prepare(`
        INSERT INTO paragraph_tf_questions (exam_id, question_number, base_text, question, answer, marks)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(examId, questionNumber, question.metadata?.baseText || "", text, question.correct ? 1 : 0, marks)
      break

    case "paragraph-matching":
      db.prepare(`
        INSERT INTO paragraph_matching_questions (exam_id, question_number, base_text, question, pairs, marks)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        examId,
        questionNumber,
        question.metadata?.baseText || "",
        text,
        JSON.stringify(question.metadata?.pairs || []),
        marks,
      )
      break

    default:
      console.warn(`[v0] Unknown question type: ${type}`)
  }
}

// Get all exams for the authenticated teacher
router.get("/", authenticateToken, (req, res) => {
  try {
    const exams = db
      .prepare(
        `SELECT 
          e.*,
          u.name as teacher_name
        FROM exam_information e
        LEFT JOIN users u ON e.teacher_id = u.id
        WHERE e.teacher_id = ?
        ORDER BY e.created_at DESC`,
      )
      .all(req.user.id)

    // For each exam, fetch settings and questions
    const parsedExams = exams.map((exam) => {
      const settings = db.prepare("SELECT * FROM exam_settings WHERE exam_id = ?").get(exam.id)

      // Fetch all questions from different tables
      const questions = []
      const questionTypes = [
        "true_false_questions",
        "multiple_choice_questions",
        "short_answer_questions",
        "fill_blank_questions",
        "matching_questions",
        "essay_questions",
        "code_questions",
        "diagram_questions",
        "diagram_mcq_questions",
        "diagram_tf_questions",
        "diagram_matching_questions",
        "paragraph_mcq_questions",
        "paragraph_tf_questions",
        "paragraph_matching_questions",
      ]

      questionTypes.forEach((table) => {
        const tableQuestions = db
          .prepare(`SELECT * FROM ${table} WHERE exam_id = ? ORDER BY question_number`)
          .all(exam.id)
        questions.push(...tableQuestions)
      })

      return {
        ...exam,
        settings: settings || {},
        questions: questions,
      }
    })

    res.json({
      success: true,
      data: parsedExams,
    })
  } catch (error) {
    console.error("Error fetching exams:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching exams",
    })
  }
})

// Get single exam by ID
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const exam = db
      .prepare(
        `SELECT 
          e.*,
          u.name as teacher_name
        FROM exam_information e
        LEFT JOIN users u ON e.teacher_id = u.id
        WHERE e.id = ? AND e.teacher_id = ?`,
      )
      .get(req.params.id, req.user.id)

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      })
    }

    const settings = db.prepare("SELECT * FROM exam_settings WHERE exam_id = ?").get(exam.id)

    // Fetch all questions
    const questions = []
    const questionTypes = [
      "true_false_questions",
      "multiple_choice_questions",
      "short_answer_questions",
      "fill_blank_questions",
      "matching_questions",
      "essay_questions",
      "code_questions",
      "diagram_questions",
      "diagram_mcq_questions",
      "diagram_tf_questions",
      "diagram_matching_questions",
      "paragraph_mcq_questions",
      "paragraph_tf_questions",
      "paragraph_matching_questions",
    ]

    questionTypes.forEach((table) => {
      const tableQuestions = db
        .prepare(`SELECT * FROM ${table} WHERE exam_id = ? ORDER BY question_number`)
        .all(exam.id)
      questions.push(...tableQuestions)
    })

    res.json({
      success: true,
      data: {
        ...exam,
        settings: settings || {},
        questions: questions,
      },
    })
  } catch (error) {
    console.error("Error fetching exam:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching exam",
    })
  }
})

// Create new exam
router.post("/", authenticateToken, (req, res) => {
  try {
    console.log("[v0] Received exam creation request:", JSON.stringify(req.body, null, 2))

    const { title, subject, description, duration, totalMarks, passMark, questions, settings, status } = req.body

    // Validation
    if (!title || !subject || !duration || !questions || questions.length === 0) {
      console.log("[v0] Validation failed - missing required fields")
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, subject, duration, and at least one question",
      })
    }

    // Validate questions structure
    for (const question of questions) {
      if (!question.type || !question.text || question.marks === undefined) {
        console.log("[v0] Question validation failed:", question)
        return res.status(400).json({
          success: false,
          message: "Each question must have type, text, and marks",
        })
      }
    }

    console.log("[v0] Validation passed, inserting exam into database")
    console.log("[v0] Using teacher_id:", req.user.id)

    const examResult = db
      .prepare(
        `INSERT INTO exam_information 
        (title, subject, description, teacher_id, status, version)
        VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(title, subject, description || "", req.user.id, status || "draft", 1)

    const examId = examResult.lastInsertRowid
    console.log("[v0] Exam information inserted with ID:", examId)

    db.prepare(
      `INSERT INTO exam_settings 
      (exam_id, duration, total_marks, pass_mark, randomize_questions, allow_multiple_attempts, shuffle_options, negative_mark, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      examId,
      duration,
      totalMarks || 0,
      passMark || 0,
      settings?.randomizeQuestions ? 1 : 0,
      settings?.allowMultipleAttempts ? 1 : 0,
      settings?.shuffleOptions ? 1 : 0,
      settings?.negativeMark ? 1 : 0,
      settings?.startDate || null,
      settings?.endDate || null,
    )

    console.log("[v0] Exam settings inserted")

    questions.forEach((question, index) => {
      saveQuestion(examId, question, index + 1)
    })

    console.log("[v0] All questions inserted")

    // Fetch the created exam with all related data
    const createdExam = db.prepare("SELECT * FROM exam_information WHERE id = ?").get(examId)
    const createdSettings = db.prepare("SELECT * FROM exam_settings WHERE exam_id = ?").get(examId)

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: {
        ...createdExam,
        settings: createdSettings,
        questions: questions,
      },
    })
  } catch (error) {
    console.error("[v0] Error creating exam:", error)
    console.error("[v0] Error stack:", error.stack)
    res.status(500).json({
      success: false,
      message: "Error creating exam",
      error: error.message,
    })
  }
})

// Update exam
router.put("/:id", authenticateToken, (req, res) => {
  try {
    const { title, subject, description, duration, totalMarks, passMark, questions, settings, status } = req.body

    // Check if exam exists and belongs to user
    const exam = db
      .prepare("SELECT * FROM exam_information WHERE id = ? AND teacher_id = ?")
      .get(req.params.id, req.user.id)

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or you don't have permission to edit it",
      })
    }

    // Don't allow editing if exam is sent for approval or published
    if (exam.status === "sent" || exam.status === "published") {
      return res.status(403).json({
        success: false,
        message: "Cannot edit exam that has been sent for approval or published",
      })
    }

    // Update exam information
    db.prepare(
      `UPDATE exam_information 
       SET title = ?, subject = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    ).run(title, subject, description || "", status || exam.status, req.params.id)

    // Update exam settings
    db.prepare(
      `UPDATE exam_settings 
       SET duration = ?, total_marks = ?, pass_mark = ?, 
           randomize_questions = ?, allow_multiple_attempts = ?, shuffle_options = ?, negative_mark = ?,
           start_date = ?, end_date = ?, updated_at = CURRENT_TIMESTAMP
       WHERE exam_id = ?`,
    ).run(
      duration,
      totalMarks || 0,
      passMark || 0,
      settings?.randomizeQuestions ? 1 : 0,
      settings?.allowMultipleAttempts ? 1 : 0,
      settings?.shuffleOptions ? 1 : 0,
      settings?.negativeMark ? 1 : 0,
      settings?.startDate || null,
      settings?.endDate || null,
      req.params.id,
    )

    // Delete existing questions
    const questionTables = [
      "true_false_questions",
      "multiple_choice_questions",
      "short_answer_questions",
      "fill_blank_questions",
      "matching_questions",
      "essay_questions",
      "code_questions",
      "diagram_questions",
      "diagram_mcq_questions",
      "diagram_tf_questions",
      "diagram_matching_questions",
      "paragraph_mcq_questions",
      "paragraph_tf_questions",
      "paragraph_matching_questions",
    ]

    questionTables.forEach((table) => {
      db.prepare(`DELETE FROM ${table} WHERE exam_id = ?`).run(req.params.id)
    })

    // Insert updated questions
    questions.forEach((question, index) => {
      saveQuestion(req.params.id, question, index + 1)
    })

    // Fetch updated exam
    const updatedExam = db.prepare("SELECT * FROM exam_information WHERE id = ?").get(req.params.id)
    const updatedSettings = db.prepare("SELECT * FROM exam_settings WHERE exam_id = ?").get(req.params.id)

    res.json({
      success: true,
      message: "Exam updated successfully",
      data: {
        ...updatedExam,
        settings: updatedSettings,
        questions: questions,
      },
    })
  } catch (error) {
    console.error("Error updating exam:", error)
    res.status(500).json({
      success: false,
      message: "Error updating exam",
      error: error.message,
    })
  }
})

// Delete exam
router.delete("/:id", authenticateToken, (req, res) => {
  try {
    const exam = db
      .prepare("SELECT * FROM exam_information WHERE id = ? AND teacher_id = ?")
      .get(req.params.id, req.user.id)

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or you don't have permission to delete it",
      })
    }

    db.prepare("DELETE FROM exam_information WHERE id = ?").run(req.params.id)

    res.json({
      success: true,
      message: "Exam deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting exam:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting exam",
    })
  }
})

// Send exam to department for approval
router.post("/:id/send-to-department", authenticateToken, (req, res) => {
  try {
    const { departments, message } = req.body

    if (!departments || departments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one department must be selected",
      })
    }

    // Check if exam exists and belongs to user
    const exam = db
      .prepare("SELECT * FROM exam_information WHERE id = ? AND teacher_id = ?")
      .get(req.params.id, req.user.id)

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found or you don't have permission",
      })
    }

    // Update exam status to 'sent'
    db.prepare("UPDATE exam_information SET status = 'sent', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
      req.params.id,
    )

    // Create approval records for each department
    const insertApproval = db.prepare(`
      INSERT INTO exam_approvals (exam_id, department_id, message, status)
      VALUES (?, ?, ?, 'pending')
    `)

    departments.forEach((deptName) => {
      const dept = db.prepare("SELECT id FROM departments WHERE name = ?").get(deptName)
      if (dept) {
        insertApproval.run(req.params.id, dept.id, message || "")
      }
    })

    res.json({
      success: true,
      message: "Exam sent to department for approval",
    })
  } catch (error) {
    console.error("Error sending exam to department:", error)
    res.status(500).json({
      success: false,
      message: "Error sending exam to department",
      error: error.message,
    })
  }
})

// Get departments
router.get("/departments/list", authenticateToken, (req, res) => {
  try {
    const departments = db.prepare("SELECT * FROM departments ORDER BY name").all()

    res.json({
      success: true,
      data: departments,
    })
  } catch (error) {
    console.error("Error fetching departments:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching departments",
    })
  }
})

export default router
