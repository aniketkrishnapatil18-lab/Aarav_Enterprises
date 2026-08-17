// ============================================================
// Model: WhatsApp Conversation + Messages
// ============================================================

const { getPool } = require('../config/database');

// ── Conversation ────────────────────────────────────────────

async function findActiveConversation(phone) {
  const [rows] = await getPool().execute(
    `SELECT * FROM whatsapp_conversations WHERE phone = ? AND status = 'active' ORDER BY started_at DESC LIMIT 1`,
    [phone]
  );
  return rows[0] || null;
}

async function createConversation({ customer_id, phone, language = 'en', service_context = null }) {
  const [result] = await getPool().execute(
    `INSERT INTO whatsapp_conversations (customer_id, phone, language, service_context, started_at, last_message_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [customer_id, phone, language, service_context]
  );
  return getConversationById(result.insertId);
}

async function getConversationById(id) {
  const [rows] = await getPool().execute(
    `SELECT cv.*, c.name AS customer_name, c.whatsapp_number
     FROM whatsapp_conversations cv
     LEFT JOIN customers c ON c.id = cv.customer_id
     WHERE cv.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function updateConversation(id, fields) {
  const allowed = ['language','status','service_context','inquiry_id','ai_context','last_message_at'];
  const setClauses = [];
  const values     = [];
  for (const key of allowed) {
    if (key in fields) {
      setClauses.push(`${key} = ?`);
      if (key === 'ai_context') {
        values.push(typeof fields[key] === 'string' ? fields[key] : JSON.stringify(fields[key]));
      } else {
        values.push(fields[key]);
      }
    }
  }
  if (!setClauses.length) return;
  values.push(id);
  await getPool().execute(`UPDATE whatsapp_conversations SET ${setClauses.join(', ')} WHERE id = ?`, values);
}

async function incrementMessageCount(id) {
  await getPool().execute(
    'UPDATE whatsapp_conversations SET message_count = message_count + 1, last_message_at = NOW() WHERE id = ?',
    [id]
  );
}

async function closeConversation(id) {
  await getPool().execute(
    `UPDATE whatsapp_conversations SET status = 'closed', closed_at = NOW() WHERE id = ?`,
    [id]
  );
}

async function markHumanHandoff(id) {
  await getPool().execute(
    `UPDATE whatsapp_conversations SET status = 'human_handoff' WHERE id = ?`,
    [id]
  );
}

async function getAllConversations({ page = 1, limit = 20, status = null, customerId = null } = {}) {
  const conditions = [];
  const values     = [];
  if (status)     { conditions.push('cv.status = ?'); values.push(status); }
  if (customerId) { conditions.push('cv.customer_id = ?'); values.push(customerId); }
  const where  = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;
  const [rows] = await getPool().execute(
    `SELECT cv.*, c.name AS customer_name, c.whatsapp_number
     FROM whatsapp_conversations cv
     LEFT JOIN customers c ON c.id = cv.customer_id
     ${where} ORDER BY cv.last_message_at DESC LIMIT ${limit} OFFSET ${offset}`,
    values
  );
  const [[{ total }]] = await getPool().execute(
    `SELECT COUNT(*) AS total FROM whatsapp_conversations cv ${where}`,
    values
  );
  return { conversations: rows, total };
}

// ── Messages ────────────────────────────────────────────────

async function addMessage({ conversation_id, wa_message_id, sender, message_type = 'text',
  content, media_url, media_id, language, is_ai_generated = false, sent_at }) {
  const [result] = await getPool().execute(
    `INSERT INTO whatsapp_messages
      (conversation_id, wa_message_id, sender, message_type, content, media_url, media_id, language, is_ai_generated, sent_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [conversation_id, wa_message_id || null, sender, message_type,
     content || null, media_url || null, media_id || null,
     language || null, is_ai_generated ? 1 : 0, sent_at || new Date()]
  );
  return result.insertId;
}

async function getMessages(conversationId, limit = 100) {
  const [rows] = await getPool().execute(
    `SELECT * FROM whatsapp_messages WHERE conversation_id = ? ORDER BY sent_at ASC LIMIT ${limit}`,
    [conversationId]
  );
  return rows;
}

async function getRecentMessages(conversationId, limit = 20) {
  const [rows] = await getPool().execute(
    `SELECT * FROM whatsapp_messages WHERE conversation_id = ? ORDER BY sent_at DESC LIMIT ${limit}`,
    [conversationId]
  );
  return rows.reverse();
}

async function countConversations() {
  const [[{ total }]] = await getPool().execute('SELECT COUNT(*) AS total FROM whatsapp_conversations');
  return total;
}

module.exports = {
  findActiveConversation, createConversation, getConversationById, updateConversation,
  incrementMessageCount, closeConversation, markHumanHandoff, getAllConversations,
  addMessage, getMessages, getRecentMessages, countConversations,
};
