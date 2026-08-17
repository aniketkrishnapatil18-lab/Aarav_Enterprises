// ============================================================
// Controller: Settings
// ============================================================

const { getPool } = require('../config/database');

async function getAll(req, res, next) {
  try {
    // Don't expose secrets to frontend
    const [rows] = await getPool().execute(
      "SELECT key_name, value, label, type FROM settings WHERE type != 'secret' ORDER BY key_name"
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function getAllAdmin(req, res, next) {
  try {
    // Admin can see all including secret key names (but not values)
    const [rows] = await getPool().execute(
      "SELECT key_name, label, type, IF(type='secret' AND value != '', '***configured***', value) AS value FROM settings ORDER BY key_name"
    );
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const { settings } = req.body;
    if (!Array.isArray(settings) || !settings.length) {
      return res.status(400).json({ success: false, message: 'settings array is required.' });
    }
    for (const setting of settings) {
      await getPool().execute(
        'INSERT INTO settings (key_name, value, label, type) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value), label = COALESCE(VALUES(label), label)',
        [setting.key_name, setting.value, setting.label || null, setting.type || 'text']
      );
    }
    res.json({ success: true, message: 'Settings updated successfully.' });
  } catch (err) { next(err); }
}

module.exports = { getAll, getAllAdmin, update };
