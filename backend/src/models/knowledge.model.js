// ============================================================
// Model: AI Knowledge Base
// ============================================================

const { getPool } = require('../config/database');

async function getAll({ activeOnly = true } = {}) {
  let sql = 'SELECT * FROM ai_knowledge_base';
  if (activeOnly) sql += ' WHERE is_active = 1';
  sql += ' ORDER BY category ASC, key_name ASC';
  const [rows] = await getPool().execute(sql);
  return rows;
}

async function getAsMap() {
  const rows = await getAll({ activeOnly: true });
  const map  = {};
  for (const row of rows) map[row.key_name] = row.value;
  return map;
}

async function getByCategory(category) {
  const [rows] = await getPool().execute(
    'SELECT * FROM ai_knowledge_base WHERE category = ? AND is_active = 1 ORDER BY key_name',
    [category]
  );
  return rows;
}

async function upsert(keyName, value, label, category = 'general') {
  await getPool().execute(
    `INSERT INTO ai_knowledge_base (key_name, label, value, category)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE value = VALUES(value), label = VALUES(label), category = VALUES(category)`,
    [keyName, label || keyName, value, category]
  );
}

async function bulkUpdate(items) {
  for (const item of items) {
    await upsert(item.key_name, item.value, item.label, item.category);
  }
}

async function toggle(keyName) {
  await getPool().execute(
    'UPDATE ai_knowledge_base SET is_active = NOT is_active WHERE key_name = ?',
    [keyName]
  );
}

module.exports = { getAll, getAsMap, getByCategory, upsert, bulkUpdate, toggle };
