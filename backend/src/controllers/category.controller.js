// ============================================================
// Controller: Category
// ============================================================

const categoryModel = require('../models/category.model');

async function list(req, res, next) {
  try {
    const activeOnly = req.query.active === 'true' || !req.admin;
    const categories = await categoryModel.getAll({ activeOnly });
    res.json({ success: true, data: categories });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, slug, description, icon, sort_order } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, message: 'Name and slug are required.' });
    const category = await categoryModel.create({ name, slug, description, icon, sort_order });
    res.status(201).json({ success: true, data: category });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const category = await categoryModel.update(req.params.id, req.body);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, data: category });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const ok = await categoryModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category deleted.' });
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
