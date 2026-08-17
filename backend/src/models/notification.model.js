// ============================================================
// Model: Notifications
// ============================================================

const { getPool } = require('../config/database');

async function create({ admin_id, type, title, body, data }) {
  const [result] = await getPool().execute(
    'INSERT INTO notifications (admin_id, type, title, body, data) VALUES (?, ?, ?, ?, ?)',
    [admin_id || null, type, title, body, data ? JSON.stringify(data) : null]
  );
  return result.insertId;
}

async function getAll({ adminId = null, unreadOnly = false, page = 1, limit = 30 } = {}) {
  const conditions = [];
  const values     = [];
  if (adminId)    { conditions.push('(admin_id = ? OR admin_id IS NULL)'); values.push(adminId); }
  if (unreadOnly) { conditions.push('is_read = 0'); }
  const where  = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;
  const [rows] = await getPool().execute(
    `SELECT * FROM notifications ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    values
  );
  return rows;
}

async function markRead(id) {
  await getPool().execute(
    'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ?',
    [id]
  );
}

async function markAllRead(adminId = null) {
  if (adminId) {
    await getPool().execute(
      'UPDATE notifications SET is_read = 1, read_at = NOW() WHERE (admin_id = ? OR admin_id IS NULL) AND is_read = 0',
      [adminId]
    );
  } else {
    await getPool().execute('UPDATE notifications SET is_read = 1, read_at = NOW() WHERE is_read = 0');
  }
}

async function countUnread() {
  const [[{ total }]] = await getPool().execute(
    'SELECT COUNT(*) AS total FROM notifications WHERE is_read = 0'
  );
  return total;
}

module.exports = { create, getAll, markRead, markAllRead, countUnread };
