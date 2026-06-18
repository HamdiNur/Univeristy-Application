const pool = require('../db')

// GET /api/universities
const getUniversities = async (req, res) => {
  try {
    const { search, country, city, page = 1, limit = 10 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const values = []
    let conditions = ['u.is_active = true']

    if (search) {
      values.push(`%${search}%`)
      conditions.push(`(u.name ILIKE $${values.length} OR u.description ILIKE $${values.length} OR u.city ILIKE $${values.length})`)
    }
    if (country) {
      values.push(country)
      conditions.push(`u.country ILIKE $${values.length}`)
    }
    if (city) {
      values.push(city)
      conditions.push(`u.city ILIKE $${values.length}`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const universitiesQuery = `
      SELECT 
        u.*,
        COUNT(DISTINCT p.id) as total_programs,
        json_agg(DISTINCT jsonb_build_object('id', f.id, 'name', f.name, 'description', f.description)) 
          FILTER (WHERE f.id IS NOT NULL) as facilities
      FROM universities u
      LEFT JOIN programs p ON p.university_id = u.id AND p.is_active = true
      LEFT JOIN facilities f ON f.university_id = u.id
      ${where}
      GROUP BY u.id
      ORDER BY u.ranking ASC NULLS LAST
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `

    const countQuery = `SELECT COUNT(*) FROM universities u ${where}`

    const [universities, count] = await Promise.all([
      pool.query(universitiesQuery, [...values, parseInt(limit), offset]),
      pool.query(countQuery, values)
    ])

    res.json({
      universities: universities.rows,
      pagination: {
        total: parseInt(count.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(count.rows[0].count) / parseInt(limit))
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch universities.' })
  }
}

// GET /api/universities/:id
const getUniversity = async (req, res) => {
  try {
    const { id } = req.params

    const uniResult = await pool.query(`
      SELECT u.*,
        json_agg(DISTINCT jsonb_build_object('id', f.id, 'name', f.name, 'description', f.description))
          FILTER (WHERE f.id IS NOT NULL) as facilities
      FROM universities u
      LEFT JOIN facilities f ON f.university_id = u.id
      WHERE u.id = $1
      GROUP BY u.id
    `, [id])

    if (uniResult.rows.length === 0)
      return res.status(404).json({ error: 'University not found.' })

    const programsResult = await pool.query(`
      SELECT * FROM programs
      WHERE university_id = $1 AND is_active = true
      ORDER BY category ASC
    `, [id])

    res.json({
      university: {
        ...uniResult.rows[0],
        programs: programsResult.rows
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch university.' })
  }
}

// POST /api/universities
const createUniversity = async (req, res) => {
  try {
    const { name, country, city, website, email, description, ranking, foundedYear } = req.body

    if (!name || !country || !city)
      return res.status(400).json({ error: 'name, country and city are required.' })

    const result = await pool.query(`
      INSERT INTO universities (name, country, city, website, email, description, ranking, founded_year)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, country, city, website, email, description, ranking, foundedYear])

    res.status(201).json({ message: 'University created!', university: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to create university.' })
  }
}

// PUT /api/universities/:id
const updateUniversity = async (req, res) => {
  try {
    const { name, country, city, website, email, description, ranking, foundedYear } = req.body
    const { id } = req.params

    const result = await pool.query(`
      UPDATE universities
      SET name=$1, country=$2, city=$3, website=$4, email=$5,
          description=$6, ranking=$7, founded_year=$8, updated_at=NOW()
      WHERE id=$9
      RETURNING *
    `, [name, country, city, website, email, description, ranking, foundedYear, id])

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'University not found.' })

    res.json({ message: 'University updated!', university: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update university.' })
  }
}

// DELETE /api/universities/:id
const deleteUniversity = async (req, res) => {
  try {
    await pool.query('UPDATE universities SET is_active=false WHERE id=$1', [req.params.id])
    res.json({ message: 'University deactivated.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete university.' })
  }
}

module.exports = { getUniversities, getUniversity, createUniversity, updateUniversity, deleteUniversity }