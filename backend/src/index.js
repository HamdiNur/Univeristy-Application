require('dotenv').config()
const db = require('./db')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// Routes
const authRoutes = require('./routes/auth.routes')
const universityRoutes = require('./routes/university.routes')  // 👈 add
const programRoutes = require('./routes/program.routes')  // 👈 add

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// ── Routes ──
app.use('/api/auth', authRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/universities', universityRoutes)  //
app.use('/api/programs', programRoutes)  // 👈 add

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({ status: 'running', message: '🎓 UniApply API is live' })
})

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
})

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})