// ============================================================
// Model: Admin
// ============================================================

const { getPool } = require('../config/database');

async function findByEmail(email) {
  const [rows] = await getPool().execute(
    'SELECT * FROM admins WHERE email = ? AND is_active = 1 LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await getPool().execute(
    'SELECT id, name, email, role, is_active, last_login, created_at FROM admins WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function updateLastLogin(id) {
  await getPool().execute('UPDATE admins SET last_login = NOW() WHERE id = ?', [id]);
}

async function updatePassword(id, hash) {
  await getPool().execute('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, id]);
}

module.exports = { findByEmail, findById, updateLastLogin, updatePassword };
