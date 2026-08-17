// ============================================================
// Controller: Knowledge Base
// ============================================================

const knowledgeModel = require('../models/knowledge.model');

async function list(req, res, next) {
  try {
    const items = await knowledgeModel.getAll({ activeOnly: false });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

async function bulkUpdate(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: 'items array is required.' });
    }
    await knowledgeModel.bulkUpdate(items);
    const updated = await knowledgeModel.getAll({ activeOnly: false });
    res.json({ success: true, data: updated, message: 'Knowledge base updated successfully.' });
  } catch (err) { next(err); }
}

async function upsertOne(req, res, next) {
  try {
    const { key_name, value, label, category } = req.body;
    if (!key_name || value === undefined) {
      return res.status(400).json({ success: false, message: 'key_name and value are required.' });
    }
    await knowledgeModel.upsert(key_name, value, label, category);
    const items = await knowledgeModel.getAll({ activeOnly: false });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

module.exports = { list, bulkUpdate, upsertOne };
