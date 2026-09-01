// ============================================================
// Model: Inquiry
// ============================================================

const { getPool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

function generateInquiryNumber() {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AE-${ts}-${rand}`;
}

const BASE_SELECT = `
  SELECT i.*,
         c.name AS customer_name, c.whatsapp_number, c.phone AS customer_phone, c.email AS customer_email,
         c.preferred_language AS customer_language,
         p.name AS product_name,
         a.name AS assigned_to_name
  FROM inquiries i
  LEFT JOIN customers c ON c.id = i.customer_id
  LEFT JOIN products  p ON p.id = i.product_id
  LEFT JOIN admins    a ON a.id = i.assigned_to
`;

async function create({ customer_id, product_id, service_name, language, business_name, requirements,
  budget, deadline, preferred_colors, quantity, ai_summary, collected_data }) {
  const inqNum = generateInquiryNumber();
  const [result] = await getPool().execute(
    `INSERT INTO inquiries (inquiry_number,customer_id,product_id,service_name,language,
      business_name,requirements,budget,deadline,preferred_colors,quantity,ai_summary,collected_data)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [inqNum, customer_id, product_id || null, service_name || null, language || 'en',
     business_name || null, requirements || null, budget || null, deadline || null,
     preferred_colors || null, quantity || null, ai_summary || null,
     collected_data ? JSON.stringify(collected_data) : null]
  );
  return getById(result.insertId);
}

async function getAll({ status = null, search = '', page = 1, limit = 20, language = null, productId = null } = {}) {
  const conditions = [];
  const values     = [];
  if (status)    { conditions.push('i.status = ?'); values.push(status); }
  if (language)  { conditions.push('i.language = ?'); values.push(language); }
  if (productId) { conditions.push('i.product_id = ?'); values.push(productId); }
  if (search)    {
    conditions.push('(c.name LIKE ? OR c.whatsapp_number LIKE ? OR i.inquiry_number LIKE ? OR i.business_name LIKE ?)');
    const s = `%${search}%`;
    values.push(s, s, s, s);
  }
  const where  = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;
  const [rows] = await getPool().execute(
    `${BASE_SELECT} ${where} ORDER BY i.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
    values
  );
  const [[{ total }]] = await getPool().execute(
    `SELECT COUNT(*) AS total FROM inquiries i LEFT JOIN customers c ON c.id = i.customer_id ${where}`,
    values
  );
  return { inquiries: rows, total };
}

async function getById(id) {
  const [rows] = await getPool().execute(`${BASE_SELECT} WHERE i.id = ? LIMIT 1`, [id]);
  if (!rows[0]) return null;
  const inquiry = rows[0];
  // Fetch messages
  const [messages] = await getPool().execute(
    `SELECT m.*, a.name AS admin_name FROM inquiry_messages m
     LEFT JOIN admins a ON a.id = m.admin_id
     WHERE m.inquiry_id = ? ORDER BY m.created_at ASC`,
    [id]
  );
  inquiry.messages = messages;
  return inquiry;
}

async function updateStatus(id, status, adminId = null, note = null) {
  await getPool().execute('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
  if (note) {
    await getPool().execute(
      'INSERT INTO inquiry_messages (inquiry_id, sender, message, admin_id) VALUES (?, ?, ?, ?)',
      [id, 'system', note, adminId || null]
    );
  }
  return getById(id);
}

async function update(id, fields) {
  const allowed = ['status','assigned_to','priority','notes','ai_summary','collected_data',
    'business_name','requirements','budget','deadline','preferred_colors','quantity','human_handoff', 'final_design_url', 'is_published'];
  const setClauses = [];
  const values     = [];
  for (const key of allowed) {
    if (key in fields) {
      setClauses.push(`${key} = ?`);
      values.push(key === 'collected_data' ? JSON.stringify(fields[key]) : fields[key]);
    }
  }
  if (!setClauses.length) return getById(id);
  values.push(id);
  await getPool().execute(`UPDATE inquiries SET ${setClauses.join(', ')} WHERE id = ?`, values);
  return getById(id);
}

async function addMessage(inquiryId, { sender, message, admin_id = null }) {
  const [result] = await getPool().execute(
    'INSERT INTO inquiry_messages (inquiry_id, sender, message, admin_id) VALUES (?, ?, ?, ?)',
    [inquiryId, sender, message, admin_id || null]
  );
  return result.insertId;
}

async function getByCustomer(customerId) {
  const [rows] = await getPool().execute(
    `${BASE_SELECT} WHERE i.customer_id = ? ORDER BY i.created_at DESC`,
    [customerId]
  );
  return rows;
}

async function countByStatus() {
  const [rows] = await getPool().execute(
    'SELECT status, COUNT(*) AS count FROM inquiries GROUP BY status'
  );
  return rows;
}

async function countNew() {
  const [[{ total }]] = await getPool().execute(
    "SELECT COUNT(*) AS total FROM inquiries WHERE status = 'NEW'"
  );
  return total;
}

module.exports = { create, getAll, getById, updateStatus, update, addMessage, getByCustomer, countByStatus, countNew };
