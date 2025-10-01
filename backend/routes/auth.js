import express from "express"
import bcrypt from "bcryptjs"
import db from "../database.js"
import { generateToken } from "../middleware/auth.js"

const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, department, phone, bio } = req.body

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and name are required",
      })
    }

    // Check if user already exists
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const result = db
      .prepare(`
      INSERT INTO users (email, password, name, role, department, phone, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
      .run(email, hashedPassword, name, "teacher", department || null, phone || null, bio || null)

    // Get the created user
    const newUser = db
      .prepare("SELECT id, email, name, role, department, phone, bio, avatar FROM users WHERE id = ?")
      .get(result.lastInsertRowid)

    // Generate token
    const token = generateToken(newUser)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser,
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      success: false,
      message: "Error registering user",
    })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Find user
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate token
    const token = generateToken(user)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Error logging in",
    })
  }
})

export default router
