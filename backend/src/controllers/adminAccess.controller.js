// ============================================================
// Controller: Admin Access Showcase
// ============================================================

const { getPool } = require('../config/database');

exports.getAdmins = async (req, res, next) => {
  try {
    // Only fetch admins that have a logo_url (representing connected organizations)
    // and are active
    const [rows] = await getPool().execute(
      'SELECT id, name, logo_url, is_active FROM admins WHERE is_active = 1 AND logo_url IS NOT NULL ORDER BY id ASC'
    );

    const formatted = rows.map(r => ({
      id: r.id,
      name: r.name,
      logo: r.logo_url,
      hasAccess: !!r.is_active
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};
