// ============================================================
// Controller: Portfolio
// ============================================================

const portfolioModel = require('../models/portfolio.model');

async function list(req, res, next) {
  try {
    const { category, featured, page = 1, limit = 50 } = req.query;
    const activeOnly = !req.admin;
    const items = await portfolioModel.getAll({
      activeOnly,
      categoryId: category || null,
      featured:   featured !== undefined ? featured === 'true' : null,
      page:       parseInt(page),
      limit:      parseInt(limit),
    });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const item = await portfolioModel.getById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = req.body;
    if (!data.category_id || !data.title) {
      return res.status(400).json({ success: false, message: 'Category and title are required.' });
    }
    if (req.file) {
      data.image_url = `/uploads/portfolio/${req.file.filename}`;
    }
    if (!data.image_url) {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }
    const item = await portfolioModel.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = req.body;
    if (req.file) {
      data.image_url = `/uploads/portfolio/${req.file.filename}`;
    }
    const item = await portfolioModel.update(req.params.id, data);
    if (!item) return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function toggle(req, res, next) {
  try {
    const item = await portfolioModel.toggle(req.params.id);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const ok = await portfolioModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Portfolio item not found.' });
    res.json({ success: true, message: 'Portfolio item deleted.' });
  } catch (err) { next(err); }
}

// GET /api/portfolio/samples/:category — public endpoint for WhatsApp AI
async function samplesByCategory(req, res, next) {
  try {
    const { category } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 5, 10);
    const items = await portfolioModel.getForWhatsApp(category, limit);
    res.json({ success: true, data: items, count: items.length });
  } catch (err) { next(err); }
}

// PUT /api/portfolio/:id/wa-toggle — toggle whatsapp_sample flag
async function waToggle(req, res, next) {
  try {
    const { getPool } = require('../config/database');
    await getPool().execute(
      'UPDATE portfolio SET whatsapp_sample = NOT whatsapp_sample WHERE id = ?',
      [req.params.id]
    );
    const item = await portfolioModel.getById(req.params.id);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
}

module.exports = { list, detail, create, update, toggle, remove, samplesByCategory, waToggle };
