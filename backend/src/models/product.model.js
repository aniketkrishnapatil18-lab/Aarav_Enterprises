// ============================================================
// Model: Product (Service)
// ============================================================

const { getPool } = require('../config/database');

const BASE_SELECT = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

async function getAll({ activeOnly = false, categoryId = null, featured = null, page = 1, limit = 50 } = {}) {
  const conditions = [];
  const values     = [];
  if (activeOnly)  { conditions.push('p.is_active = 1'); }
  if (categoryId)  { conditions.push('p.category_id = ?'); values.push(categoryId); }
  if (featured !== null) { conditions.push('p.is_featured = ?'); values.push(featured ? 1 : 0); }
  const where  = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;
  const [rows] = await getPool().execute(
    `${BASE_SELECT} ${where} ORDER BY p.sort_order ASC, p.name ASC LIMIT ${limit} OFFSET ${offset}`,
    values
  );
  return rows;
}

async function getById(id) {
  const [rows] = await getPool().execute(`${BASE_SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function getBySlug(slug) {
  const [rows] = await getPool().execute(`${BASE_SELECT} WHERE p.slug = ? LIMIT 1`, [slug]);
  return rows[0] || null;
}

async function create(data) {
  const {
    category_id, name, slug, short_desc, description,
    starting_price, max_price, price_label, currency,
    delivery_days, revisions, file_formats, thumbnail_url,
    is_featured = 0, is_active = 1, sort_order = 0,
  } = data;
  const [result] = await getPool().execute(
    `INSERT INTO products (category_id,name,slug,short_desc,description,starting_price,max_price,
      price_label,currency,delivery_days,revisions,file_formats,thumbnail_url,is_featured,is_active,sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [category_id,name,slug,short_desc||null,description||null,
     starting_price,max_price||null,price_label||'onwards',currency||'INR',
     delivery_days||null,revisions||null,file_formats||null,thumbnail_url||null,
     is_featured?1:0,is_active?1:0,sort_order]
  );
  return getById(result.insertId);
}

async function update(id, fields) {
  const allowed = ['category_id','name','slug','short_desc','description','starting_price','max_price',
    'price_label','currency','delivery_days','revisions','file_formats','thumbnail_url',
    'is_featured','is_active','sort_order'];
  const setClauses = [];
  const values     = [];
  for (const key of allowed) {
    if (key in fields) {
      setClauses.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }
  if (!setClauses.length) return getById(id);
  values.push(id);
  await getPool().execute(`UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`, values);
  return getById(id);
}

async function toggle(id) {
  await getPool().execute('UPDATE products SET is_active = NOT is_active WHERE id = ?', [id]);
  return getById(id);
}

async function remove(id) {
  const [result] = await getPool().execute('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function count() {
  const [rows] = await getPool().execute('SELECT COUNT(*) AS total FROM products WHERE is_active = 1');
  return rows[0].total;
}

module.exports = { getAll, getById, getBySlug, create, update, toggle, remove, count };
