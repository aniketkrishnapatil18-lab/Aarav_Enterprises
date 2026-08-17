// ============================================================
// Middleware: JWT Authentication
// ============================================================

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized — no token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret_in_production');
    req.admin = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized — invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.admin) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden — insufficient permissions' });
    }
    return next();
  };
}

module.exports = { auth, requireRole };
