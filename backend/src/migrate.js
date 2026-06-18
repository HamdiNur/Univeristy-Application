require('dotenv').config()
const fs = require('fs')
const path = require('path')
const pool = require('./db')

const runMigration = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db.sql'), 'utf8')
    await pool.query(sql)
    console.log('✅ All tables created successfully!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Migration failed:', err.message)
    process.exit(1)
  }
}

runMigration()