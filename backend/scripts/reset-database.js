import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = path.join(__dirname, "..", "exam_management.db")
const uploadsPath = path.join(__dirname, "..", "uploads", "avatars")

console.log("🗑️  Resetting database...\n")

// Delete database file
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath)
  console.log("✅ Database file deleted")
} else {
  console.log("ℹ️  No database file found")
}

// Clear uploads folder
if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath)
  files.forEach((file) => {
    fs.unlinkSync(path.join(uploadsPath, file))
  })
  console.log(`✅ Cleared ${files.length} uploaded files`)
} else {
  console.log("ℹ️  No uploads folder found")
}

console.log("\n✨ Database reset complete!")
console.log("💡 Restart the server to create a fresh database with demo accounts.\n")
