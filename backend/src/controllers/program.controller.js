const pool = require('../db')

// GET /api/programs
const getPrograms = async (req, res) => {
  try {
    const { search, category, degreeLevel, universityId, maxFee, page = 1, limit = 10 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const values = []
    let conditions = ['p.is_active = true']

    if (universityId) {
      values.push(universityId)
      conditions.push(`p.university_id = $${values.length}`)
    }
    if (category) {
      values.push(category)
      conditions.push(`p.category = $${values.length}`)
    }
    if (degreeLevel) {
      values.push(degreeLevel)
      conditions.push(`p.degree_level = $${values.length}`)
    }
    if (maxFee) {
      values.push(parseFloat(maxFee))
      conditions.push(`p.tuition_fee <= $${values.length}`)
    }
    if (search) {
      values.push(`%${search}%`)
      conditions.push(`(p.name ILIKE $${values.length} OR p.description ILIKE $${values.length} OR p.career_prospects ILIKE $${values.length})`)
    }

    const where = `WHERE ${conditions.join(' AND ')}`

    const result = await pool.query(`
      SELECT 
        p.*,
        u.name as university_name,
        u.country as university_country,
        u.city as university_city,
        u.logo_url as university_logo,
        u.ranking as university_ranking
      FROM programs p
      JOIN universities u ON u.id = p.university_id
      ${where}
      ORDER BY p.created_at DESC
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `, [...values, parseInt(limit), offset])

    const count = await pool.query(
      `SELECT COUNT(*) FROM programs p ${where}`, values
    )

    res.json({
      programs: result.rows,
      pagination: {
        total: parseInt(count.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(count.rows[0].count) / parseInt(limit))
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch programs.' })
  }
}

// GET /api/programs/categories
const getCategories = async (req, res) => {
  const categories = [
    'MEDICINE', 'INFORMATION_TECHNOLOGY', 'ENGINEERING',
    'BUSINESS', 'LAW', 'ARTS', 'SCIENCE',
    'EDUCATION', 'ARCHITECTURE', 'OTHER'
  ]
  res.json({ categories })
}

// GET /api/programs/:id
const getProgram = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        u.name as university_name,
        u.country as university_country,
        u.city as university_city,
        u.logo_url as university_logo,
        u.ranking as university_ranking,
        u.description as university_description,
        u.website as university_website
      FROM programs p
      JOIN universities u ON u.id = p.university_id
      WHERE p.id = $1
    `, [req.params.id])

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Program not found.' })

    res.json({ program: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch program.' })
  }
}

// POST /api/programs
const createProgram = async (req, res) => {
  try {
    const {
      universityId, name, category, degreeLevel,
      description, durationYears, tuitionFee, language,
      availableSeats, applicationDeadline, minGPA,
      courseOutline, careerProspects, requiredDocuments
    } = req.body

    if (!universityId || !name || !category || !degreeLevel || !durationYears)
      return res.status(400).json({ error: 'universityId, name, category, degreeLevel, durationYears are required.' })

    const result = await pool.query(`
      INSERT INTO programs (
        university_id, name, category, degree_level, description,
        duration_years, tuition_fee, language, available_seats,
        application_deadline, min_gpa, course_outline,
        career_prospects, required_documents
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [
      universityId, name, category, degreeLevel, description,
      durationYears, tuitionFee, language || 'English', availableSeats,
      applicationDeadline || null, minGPA, courseOutline,
      careerProspects, requiredDocuments || []
    ])

    res.status(201).json({ message: 'Program created!', program: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create program.' })
  }
}

// PUT /api/programs/:id
const updateProgram = async (req, res) => {
  try {
    const {
      name, category, degreeLevel, description,
      durationYears, tuitionFee, language, availableSeats,
      applicationDeadline, minGPA, courseOutline, careerProspects
    } = req.body

    const result = await pool.query(`
      UPDATE programs SET
        name=$1, category=$2, degree_level=$3, description=$4,
        duration_years=$5, tuition_fee=$6, language=$7,
        available_seats=$8, application_deadline=$9, min_gpa=$10,
        course_outline=$11, career_prospects=$12, updated_at=NOW()
      WHERE id=$13
      RETURNING *
    `, [
      name, category, degreeLevel, description,
      durationYears, tuitionFee, language, availableSeats,
      applicationDeadline, minGPA, courseOutline, careerProspects,
      req.params.id
    ])

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Program not found.' })

    res.json({ message: 'Program updated!', program: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update program.' })
  }
}

// DELETE /api/programs/:id
const deleteProgram = async (req, res) => {
  try {
    await pool.query('UPDATE programs SET is_active=false WHERE id=$1', [req.params.id])
    res.json({ message: 'Program deactivated.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete program.' })
  }
}

module.exports = { getPrograms, getProgram, getCategories, createProgram, updateProgram, deleteProgram }