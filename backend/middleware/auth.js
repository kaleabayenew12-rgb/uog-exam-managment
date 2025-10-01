import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" })
  }

  try {
    const user = jwt.verify(token, JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" })
  }
}

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}
