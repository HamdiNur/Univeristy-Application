const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, nationality } = req.body

    if (!fullName || !email || !password)
      return res.status(400).json({ error: 'fullName, email and password are required.' })

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' })

    // Check if email exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered.' })

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone, nationality)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, role, created_at`,
      [fullName, email, passwordHash, phone, nationality]
    )

    const user = result.rows[0]
    const token = generateToken(user.id)

    res.status(201).json({ message: 'Account created!', token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error during registration.' })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' })

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user)
      return res.status(401).json({ error: 'Invalid email or password.' })

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password.' })

    const token = generateToken(user.id)

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error during login.' })
  }
}

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, role, phone, nationality, is_verified, created_at FROM users WHERE id = $1',
      [req.user.id]
    )
    res.json({ user: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user.' })
  }
}

module.exports = { register, login, getMe }