const jwt = require('jsonwebtoken')
const pool = require('../db')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided. Please log in.' })

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const result = await pool.query(
      'SELECT id, full_name, email, role FROM users WHERE id = $1',
      [decoded.id]
    )

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'User no longer exists.' })

    req.user = result.rows[0]
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: `Access denied. Required: ${roles.join(' or ')}` })
    next()
  }
}

module.exports = { protect, restrictTo }