// ============================================================
// Controller: Auth
// ============================================================

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const adminModel = require('../models/admin.model');

const JWT_SECRET  = process.env.JWT_SECRET || 'change_this_secret_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const admin = await adminModel.findByEmail(email.trim().toLowerCase());
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    await adminModel.updateLastLogin(admin.id);

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res) {
  return res.json({ success: true, admin: req.admin });
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters.' });
    }

    const admin = await adminModel.findByEmail(req.admin.email);
    const valid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await adminModel.updatePassword(req.admin.id, hash);
    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    return next(err);
  }
}

module.exports = { login, me, changePassword };
