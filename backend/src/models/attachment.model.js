// ============================================================
// Model: Attachment (stub for webhook.service.js reference)
// ============================================================

const { getPool } = require('../config/database');

async function getByInquiry(inquiryId) {
  const [rows] = await getPool().execute(
    'SELECT * FROM attachments WHERE inquiry_id = ? ORDER BY created_at ASC',
    [inquiryId]
  );
  return rows;
}

async function getByConversation(conversationId) {
  const [rows] = await getPool().execute(
    'SELECT * FROM attachments WHERE conversation_id = ? ORDER BY created_at ASC',
    [conversationId]
  );
  return rows;
}

async function create({ inquiry_id, conversation_id, message_id, original_name, file_name, file_path, file_url, mime_type, file_size, source }) {
  const [result] = await getPool().execute(
    `INSERT INTO attachments (inquiry_id,conversation_id,message_id,original_name,file_name,file_path,file_url,mime_type,file_size,source)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [inquiry_id || null, conversation_id || null, message_id || null,
     original_name, file_name, file_path, file_url || null,
     mime_type || null, file_size || null, source || 'admin_upload']
  );
  return result.insertId;
}

module.exports = { getByInquiry, getByConversation, create };
