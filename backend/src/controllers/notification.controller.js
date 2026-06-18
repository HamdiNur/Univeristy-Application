const pool = require('../db')

// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [req.user.id])

    const unreadCount = result.rows.filter(n => !n.is_read).length

    res.json({ notifications: result.rows, unreadCount })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications.' })
  }
}

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    )
    res.json({ message: 'Marked as read.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification.' })
  }
}

// PATCH /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    )
    res.json({ message: 'All notifications marked as read.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notifications.' })
  }
}

module.exports = { getNotifications, markAsRead, markAllAsRead }