// ============================================================
// Model: Client
// ============================================================

const { getPool } = require('../config/database');

async function getAll({ activeOnly = false } = {}) {
  const query = activeOnly 
    ? 'SELECT * FROM clients WHERE is_active = 1 ORDER BY sort_order ASC, id DESC'
    : 'SELECT * FROM clients ORDER BY sort_order ASC, id DESC';
  const [rows] = await getPool().execute(query);
  return rows;
}

async function getById(id) {
  const [rows] = await getPool().execute('SELECT * FROM clients WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ name, logo_url, service_provided, sort_order = 0 }) {
  const [result] = await getPool().execute(
    'INSERT INTO clients (name, logo_url, service_provided, sort_order) VALUES (?, ?, ?, ?)',
    [name, logo_url || null, service_provided || null, sort_order]
  );
  return getById(result.insertId);
}

async function update(id, fields) {
  const allowed = ['name', 'logo_url', 'service_provided', 'is_active', 'sort_order'];
  const setClauses = [];
  const values = [];
  for (const key of allowed) {
    if (key in fields) {
      setClauses.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (!setClauses.length) return getById(id);
  values.push(id);
  await getPool().execute(`UPDATE clients SET ${setClauses.join(', ')} WHERE id = ?`, values);
  return getById(id);
}

async function toggle(id) {
  await getPool().execute('UPDATE clients SET is_active = NOT is_active WHERE id = ?', [id]);
  return getById(id);
}

async function remove(id) {
  const [result] = await getPool().execute('DELETE FROM clients WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, toggle, remove };
