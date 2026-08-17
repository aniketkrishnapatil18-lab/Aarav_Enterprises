// ============================================================
// Model: Portfolio
// ============================================================

const { getPool } = require('../config/database');

const BASE_SELECT = `
  SELECT p.*, c.name AS category_name, c.slug AS category_slug
  FROM portfolio p
  LEFT JOIN categories c ON c.id = p.category_id
`;

async function getAll({ activeOnly = false, categoryId = null, featured = null, page = 1, limit = 50 } = {}) {
  const conditions = [];
  const values     = [];
  if (activeOnly)      { conditions.push('p.is_active = 1'); }
  if (categoryId)      { conditions.push('p.category_id = ?'); values.push(categoryId); }
  if (featured !== null) { conditions.push('p.is_featured = ?'); values.push(featured ? 1 : 0); }
  const where  = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
  const offset = (page - 1) * limit;
  const [rows] = await getPool().execute(
    `${BASE_SELECT} ${where} ORDER BY p.sort_order ASC, p.id DESC LIMIT ${limit} OFFSET ${offset}`,
    values
  );
  return rows;
}

async function getById(id) {
  const [rows] = await getPool().execute(`${BASE_SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function create({ category_id, title, description, image_url, client_name, is_featured = 0, sort_order = 0 }) {
  const [result] = await getPool().execute(
    'INSERT INTO portfolio (category_id,title,description,image_url,client_name,is_featured,sort_order) VALUES (?,?,?,?,?,?,?)',
    [category_id, title, description || null, image_url, client_name || null, is_featured ? 1 : 0, sort_order]
  );
  return getById(result.insertId);
}

async function update(id, fields) {
  const allowed = ['category_id','title','description','image_url','client_name','is_featured','is_active','sort_order'];
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
  await getPool().execute(`UPDATE portfolio SET ${setClauses.join(', ')} WHERE id = ?`, values);
  return getById(id);
}

async function toggle(id) {
  await getPool().execute('UPDATE portfolio SET is_active = NOT is_active WHERE id = ?', [id]);
  return getById(id);
}

async function remove(id) {
  const [result] = await getPool().execute('DELETE FROM portfolio WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Get WhatsApp-sendable samples for a category slug (featured first, active only)
 * Used by the AI image-sending pipeline
 */
async function getForWhatsApp(categorySlug, limit = 5) {
  const safeLimit = parseInt(limit, 10) || 5;
  const [rows] = await getPool().execute(
    `${BASE_SELECT}
     WHERE c.slug = ?
       AND p.is_active = 1
       AND p.whatsapp_sample = 1
     ORDER BY p.is_featured DESC, p.sort_order ASC
     LIMIT ${safeLimit}`,
    [categorySlug]
  );
  return rows;
}

/**
 * Map a customer's message keyword to a category slug
 */
function mapCategorySlug(message) {
  const lower = message.toLowerCase();

  // Visiting Card
  if (/visiting.?card|business.?card|v\.?card|विजिटिंग.?कार्ड|व्हिजिटिंग|कार्ड/.test(lower))
    return 'visiting-card';

  // Logo Design
  if (/\blogo\b|लोगो/.test(lower))
    return 'logo-design';

  // 3D Logo
  if (/3d.?logo|3d.?design|3d लोगो/.test(lower))
    return '3d-logo-design';

  // Brochure
  if (/brochure|broucher|brocher|brosher|ब्रोशर|पुस्तिका/.test(lower))
    return 'brochure-design';

  // Menu Card
  if (/menu.?card|menu.?design|मेनू/.test(lower))
    return 'menu-card-design';

  // Banner / Flex
  if (/\bbanner\b|flex.?board|flex.?print|होर्डिंग|बॅनर|बैनर/.test(lower))
    return 'banner-design';

  // Flex printing specifically
  if (/\bflex\b|फ्लेक्स/.test(lower))
    return 'flex-printing';

  // Advertisement
  if (/adverti|जाहिरात|विज्ञापन/.test(lower))
    return 'advertisement';

  // Social Media
  if (/social.?media|instagram|facebook|insta.?post|सोशल|सोशल मीडिया/.test(lower))
    return 'social-media-design';

  // Pamphlet / Flyer
  if (/pamphlet|flyer|पत्रक/.test(lower))
    return 'pamphlet-flyer';

  return null; // unknown category
}

module.exports = { getAll, getById, create, update, toggle, remove, getForWhatsApp, mapCategorySlug };
