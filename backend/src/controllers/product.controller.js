// ============================================================
// Controller: Product (Service)
// ============================================================

const productModel = require('../models/product.model');
const path         = require('path');

async function list(req, res, next) {
  try {
    const { category, featured, page = 1, limit = 50 } = req.query;
    const activeOnly = req.query.active === 'true' || !req.admin;
    const products = await productModel.getAll({
      activeOnly,
      categoryId: category || null,
      featured:   featured !== undefined ? featured === 'true' : null,
      page:       parseInt(page),
      limit:      parseInt(limit),
    });
    res.json({ success: true, data: products });
  } catch (err) { next(err); }
}

async function detail(req, res, next) {
  try {
    const product = isNaN(req.params.id)
      ? await productModel.getBySlug(req.params.id)
      : await productModel.getById(parseInt(req.params.id));
    if (!product) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const data = req.body;
    if (!data.name || !data.slug || !data.category_id) {
      return res.status(400).json({ success: false, message: 'Name, slug, and category are required.' });
    }
    if (req.file) {
      data.thumbnail_url = `/uploads/products/${req.file.filename}`;
    }
    const product = await productModel.create(data);
    res.status(201).json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const data = req.body;
    if (req.file) {
      data.thumbnail_url = `/uploads/products/${req.file.filename}`;
    }
    const product = await productModel.update(req.params.id, data);
    if (!product) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function toggle(req, res, next) {
  try {
    const product = await productModel.toggle(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const ok = await productModel.remove(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) { next(err); }
}

module.exports = { list, detail, create, update, toggle, remove };
