import express from "express"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import fs from "fs"
import db from "../database.js"
import { authenticateToken } from "../middleware/auth.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/avatars")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed (JPEG, PNG, GIF, WebP)"))
    }
  },
})

// Get user profile
router.get("/", authenticateToken, (req, res) => {
  try {
    const user = db
      .prepare(`
      SELECT id, email, name, role, department, phone, bio, avatar, created_at, updated_at
      FROM users WHERE id = ?
    `)
      .get(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
    })
  }
})

// Update user profile
router.put("/", authenticateToken, (req, res) => {
  try {
    const { name, phone, bio } = req.body
    const userId = req.user.id

    // Build update query dynamically based on provided fields
    const updates = []
    const values = []

    if (name !== undefined) {
      updates.push("name = ?")
      values.push(name)
    }
    if (phone !== undefined) {
      updates.push("phone = ?")
      values.push(phone)
    }
    if (bio !== undefined) {
      updates.push("bio = ?")
      values.push(bio)
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      })
    }

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push(userId)

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`
    db.prepare(query).run(...values)

    // Get updated user
    const updatedUser = db
      .prepare(`
      SELECT id, email, name, role, department, phone, bio, avatar, created_at, updated_at
      FROM users WHERE id = ?
    `)
      .get(userId)

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    })
  }
})

// Upload/update avatar
router.post("/avatar", authenticateToken, upload.single("avatar"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    const userId = req.user.id
    const avatarPath = `/uploads/avatars/${req.file.filename}`

    // Get old avatar to delete it
    const oldUser = db.prepare("SELECT avatar FROM users WHERE id = ?").get(userId)

    // Update user avatar
    db.prepare("UPDATE users SET avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(avatarPath, userId)

    // Delete old avatar file if it exists
    if (oldUser.avatar) {
      const oldAvatarPath = path.join(__dirname, "..", oldUser.avatar)
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath)
      }
    }

    // Get updated user
    const updatedUser = db
      .prepare(`
      SELECT id, email, name, role, department, phone, bio, avatar, created_at, updated_at
      FROM users WHERE id = ?
    `)
      .get(userId)

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: updatedUser,
    })
  } catch (error) {
    console.error("Upload avatar error:", error)
    res.status(500).json({
      success: false,
      message: "Error uploading avatar",
    })
  }
})

// Update profile with avatar (combined endpoint)
router.put("/avatar", authenticateToken, upload.single("avatar"), (req, res) => {
  try {
    const { name, phone, bio } = req.body
    const userId = req.user.id

    // Build update query
    const updates = []
    const values = []

    if (name) {
      updates.push("name = ?")
      values.push(name)
    }
    if (phone !== undefined) {
      updates.push("phone = ?")
      values.push(phone)
    }
    if (bio !== undefined) {
      updates.push("bio = ?")
      values.push(bio)
    }

    // Handle avatar upload
    if (req.file) {
      const avatarPath = `/uploads/avatars/${req.file.filename}`
      updates.push("avatar = ?")
      values.push(avatarPath)

      // Get old avatar to delete it
      const oldUser = db.prepare("SELECT avatar FROM users WHERE id = ?").get(userId)
      if (oldUser.avatar) {
        const oldAvatarPath = path.join(__dirname, "..", oldUser.avatar)
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath)
        }
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      })
    }

    updates.push("updated_at = CURRENT_TIMESTAMP")
    values.push(userId)

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`
    db.prepare(query).run(...values)

    // Get updated user
    const updatedUser = db
      .prepare(`
      SELECT id, email, name, role, department, phone, bio, avatar, created_at, updated_at
      FROM users WHERE id = ?
    `)
      .get(userId)

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    })
  } catch (error) {
    console.error("Update profile with avatar error:", error)
    res.status(500).json({
      success: false,
      message: "Error updating profile",
    })
  }
})

export default router
