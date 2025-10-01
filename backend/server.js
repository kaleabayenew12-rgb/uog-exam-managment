import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
import dotenv from "dotenv"
import { initializeDatabase } from "./database.js"
import authRoutes from "./routes/auth.js"
import profileRoutes from "./routes/profile.js"
import examsRoutes from "./routes/exams.js"
import usersRoutes from "./routes/users.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Initialize database
initializeDatabase()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/exams", examsRoutes)
app.use("/api/users", usersRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`API available at http://localhost:${PORT}/api`)
})
