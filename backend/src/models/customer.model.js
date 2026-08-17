// ============================================================
// Model: Customer
// ============================================================

const { getPool } = require('../config/database');

async function findOrCreate(whatsappNumber, profileName) {
  const pool = getPool();
  let [rows] = await pool.execute(
    'SELECT * FROM customers WHERE whatsapp_number = ? LIMIT 1',
    [whatsappNumber]
  );
  if (rows[0]) {
    await pool.execute(
      'UPDATE customers SET last_contact_at = NOW(), profile_name = COALESCE(?, profile_name) WHERE whatsapp_number = ?',
      [profileName || null, whatsappNumber]
    );
    return { customer: rows[0], created: false };
  }
  const [result] = await pool.execute(
    `INSERT INTO customers (whatsapp_number, phone, profile_name, first_contact_at, last_contact_at)
     VALUES (?, ?, ?, NOW(), NOW())`,
    [whatsappNumber, whatsappNumber, profileName || null]
  );
  [rows] = await pool.execute('SELECT * FROM customers WHERE id = ? LIMIT 1', [result.insertId]);
  return { customer: rows[0], created: true };
}

async function getAll({ search = '', page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  let sql = 'SELECT * FROM customers';
  const values = [];
  if (search) {
    sql += ' WHERE (name LIKE ? OR whatsapp_number LIKE ? OR email LIKE ?)';
    const s = `%${search}%`;
    values.push(s, s, s);
  }
  sql += ` ORDER BY last_contact_at DESC LIMIT ${limit} OFFSET ${offset}`;
  const [rows]  = await getPool().execute(sql, values);
  const [[{ total }]] = await getPool().execute(
    `SELECT COUNT(*) AS total FROM customers${search ? ' WHERE (name LIKE ? OR whatsapp_number LIKE ? OR email LIKE ?)' : ''}`,
    values
  );
  return { customers: rows, total };
}

async function getById(id) {
  const [rows] = await getPool().execute('SELECT * FROM customers WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
}

async function update(id, fields) {
  const allowed = ['name','phone','email','preferred_language','notes'];
  const setClauses = [];
  const values     = [];
  for (const key of allowed) {
    if (key in fields) { setClauses.push(`${key} = ?`); values.push(fields[key]); }
  }
  if (!setClauses.length) return getById(id);
  values.push(id);
  await getPool().execute(`UPDATE customers SET ${setClauses.join(', ')} WHERE id = ?`, values);
  return getById(id);
}

async function updateLanguage(whatsappNumber, language) {
  await getPool().execute(
    'UPDATE customers SET preferred_language = ? WHERE whatsapp_number = ?',
    [language, whatsappNumber]
  );
}

async function incrementInquiries(customerId) {
  await getPool().execute(
    'UPDATE customers SET total_inquiries = total_inquiries + 1 WHERE id = ?',
    [customerId]
  );
}

async function countTotal() {
  const [[{ total }]] = await getPool().execute('SELECT COUNT(*) AS total FROM customers');
  return total;
}

module.exports = { findOrCreate, getAll, getById, update, updateLanguage, incrementInquiries, countTotal };
