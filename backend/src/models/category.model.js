// ============================================================
// Model: Category
// ============================================================

const { getPool } = require('../config/database');

async function getAll({ activeOnly = false } = {}) {
  let sql = 'SELECT * FROM categories';
  if (activeOnly) sql += ' WHERE is_active = 1';
  sql += ' ORDER BY sort_order ASC, name ASC';
  const [rows] = await getPool().execute(sql);
  return rows;
}

async function getById(id) {
  const [rows] = await getPool().execute('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function create({ name, slug, description, icon, sort_order = 0 }) {
  const [result] = await getPool().execute(
    'INSERT INTO categories (name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?)',
    [name, slug, description || null, icon || null, sort_order]
  );
  return getById(result.insertId);
}

async function update(id, fields) {
  const allowed = ['name', 'slug', 'description', 'icon', 'sort_order', 'is_active'];
  const setClauses = [];
  const values     = [];
  for (const key of allowed) {
    if (key in fields) {
      setClauses.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (!setClauses.length) return getById(id);
  values.push(id);
  await getPool().execute(`UPDATE categories SET ${setClauses.join(', ')} WHERE id = ?`, values);
  return getById(id);
}

async function remove(id) {
  const [result] = await getPool().execute('DELETE FROM categories WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { getAll, getById, create, update, remove };
