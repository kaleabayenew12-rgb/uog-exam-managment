import express from "express"
import db from "../database.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

// Get subjects for the user's department
router.get("/subjects", authenticateToken, (req, res) => {
  try {
    const user = db.prepare("SELECT department FROM users WHERE id = ?").get(req.user.userId)

    if (!user || !user.department) {
      return res.json({
        success: true,
        data: [],
      })
    }

    // Get common subjects based on department
    const subjectsByDepartment = {
      "Computer Science": [
        "Data Structures",
        "Algorithms",
        "Database Systems",
        "Operating Systems",
        "Computer Networks",
        "Software Engineering",
        "Web Development",
        "Artificial Intelligence",
        "Machine Learning",
      ],
      Mathematics: [
        "Calculus I",
        "Calculus II",
        "Linear Algebra",
        "Differential Equations",
        "Probability & Statistics",
        "Discrete Mathematics",
        "Number Theory",
      ],
      Physics: [
        "Classical Mechanics",
        "Electromagnetism",
        "Quantum Mechanics",
        "Thermodynamics",
        "Optics",
        "Modern Physics",
      ],
      Chemistry: [
        "Organic Chemistry",
        "Inorganic Chemistry",
        "Physical Chemistry",
        "Analytical Chemistry",
        "Biochemistry",
      ],
      Biology: ["Cell Biology", "Genetics", "Ecology", "Microbiology", "Anatomy", "Physiology"],
      English: [
        "English Literature",
        "Creative Writing",
        "Grammar & Composition",
        "American Literature",
        "British Literature",
      ],
      History: ["World History", "American History", "European History", "Ancient Civilizations", "Modern History"],
    }

    const subjects = subjectsByDepartment[user.department] || []

    res.json({
      success: true,
      data: subjects,
    })
  } catch (error) {
    console.error("Error fetching subjects:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching subjects",
    })
  }
})

export default router
