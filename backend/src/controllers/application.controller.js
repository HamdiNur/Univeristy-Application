const pool = require('../db')

// POST /api/applications
const createApplication = async (req, res) => {
  try {
    const { programId, coverLetter } = req.body

    if (!programId)
      return res.status(400).json({ error: 'programId is required.' })

    // Check program exists
    const program = await pool.query(
      'SELECT * FROM programs WHERE id = $1 AND is_active = true', [programId]
    )
    if (program.rows.length === 0)
      return res.status(404).json({ error: 'Program not found.' })

    // Check deadline
    const p = program.rows[0]
    if (p.application_deadline && new Date() > new Date(p.application_deadline))
      return res.status(400).json({ error: 'Application deadline has passed.' })

    // Check duplicate
    const existing = await pool.query(
      'SELECT id FROM applications WHERE student_id = $1 AND program_id = $2',
      [req.user.id, programId]
    )
    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'You already applied to this program.' })

    const result = await pool.query(`
      INSERT INTO applications (student_id, program_id, cover_letter, status)
      VALUES ($1, $2, $3, 'DRAFT')
      RETURNING *
    `, [req.user.id, programId, coverLetter])

    res.status(201).json({ message: 'Application created!', application: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create application.' })
  }
}

// PATCH /api/applications/:id/submit
const submitApplication = async (req, res) => {
  try {
    const application = await pool.query(
      'SELECT * FROM applications WHERE id = $1', [req.params.id]
    )

    if (application.rows.length === 0)
      return res.status(404).json({ error: 'Application not found.' })

    const app = application.rows[0]

    if (app.student_id !== req.user.id)
      return res.status(403).json({ error: 'Forbidden.' })

    if (app.status !== 'DRAFT')
      return res.status(400).json({ error: 'Application already submitted.' })

    const result = await pool.query(`
      UPDATE applications
      SET status = 'SUBMITTED', submitted_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `, [req.params.id])

    // Get program name for notification
    const program = await pool.query(
      'SELECT p.name, u.name as university_name FROM programs p JOIN universities u ON u.id = p.university_id WHERE p.id = $1',
      [app.program_id]
    )

    // Create notification
    await pool.query(`
      INSERT INTO notifications (user_id, title, message)
      VALUES ($1, $2, $3)
    `, [
      req.user.id,
      'Application Submitted! 🎉',
      `Your application to ${program.rows[0].name} at ${program.rows[0].university_name} has been submitted successfully.`
    ])

    res.json({ message: 'Application submitted!', application: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit application.' })
  }
}

// GET /api/applications/me
const getMyApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        p.name as program_name,
        p.category,
        p.degree_level,
        p.tuition_fee,
        u.name as university_name,
        u.country as university_country,
        u.logo_url as university_logo
      FROM applications a
      JOIN programs p ON p.id = a.program_id
      JOIN universities u ON u.id = p.university_id
      WHERE a.student_id = $1
      ORDER BY a.created_at DESC
    `, [req.user.id])

    res.json({ applications: result.rows })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications.' })
  }
}

// GET /api/applications  (admin)
const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const values = []
    let conditions = []

    if (status) {
      values.push(status)
      conditions.push(`a.status = $${values.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const result = await pool.query(`
      SELECT
        a.*,
        u_info.full_name as student_name,
        u_info.email as student_email,
        u_info.nationality,
        p.name as program_name,
        p.category,
        p.degree_level,
        u.name as university_name
      FROM applications a
      JOIN users u_info ON u_info.id = a.student_id
      JOIN programs p ON p.id = a.program_id
      JOIN universities u ON u.id = p.university_id
      ${where}
      ORDER BY a.submitted_at DESC NULLS LAST
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `, [...values, parseInt(limit), offset])

    const count = await pool.query(
      `SELECT COUNT(*) FROM applications a ${where}`, values
    )

    res.json({
      applications: result.rows,
      pagination: {
        total: parseInt(count.rows[0].count),
        page: parseInt(page),
        totalPages: Math.ceil(parseInt(count.rows[0].count) / parseInt(limit))
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications.' })
  }
}

// PATCH /api/applications/:id/status  (admin)
const updateStatus = async (req, res) => {
  try {
    const { status, notes } = req.body
    const validStatuses = ['UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WAITLISTED']

    if (!validStatuses.includes(status))
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` })

    const result = await pool.query(`
      UPDATE applications
      SET status=$1, notes=$2, decided_at=NOW(), updated_at=NOW()
      WHERE id=$3
      RETURNING *
    `, [status, notes, req.params.id])

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Application not found.' })

    const app = result.rows[0]

    // Get program info for notification
    const program = await pool.query(
      'SELECT p.name, u.name as university_name FROM programs p JOIN universities u ON u.id = p.university_id WHERE p.id = $1',
      [app.program_id]
    )

    // Notify student
    const statusEmoji = status === 'ACCEPTED' ? '🎉' : status === 'REJECTED' ? '❌' : '⏳'
    await pool.query(`
      INSERT INTO notifications (user_id, title, message)
      VALUES ($1, $2, $3)
    `, [
      app.student_id,
      `Application ${status} ${statusEmoji}`,
      `Your application to ${program.rows[0].name} at ${program.rows[0].university_name} is now: ${status}`
    ])

    res.json({ message: 'Status updated!', application: app })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status.' })
  }
}

module.exports = {
  createApplication, submitApplication,
  getMyApplications, getAllApplications, updateStatus
}