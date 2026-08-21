// ============================================================
// Routes: Admin Access Showcase
// ============================================================

const express = require('express');
const router = express.Router();
const adminAccessController = require('../controllers/adminAccess.controller');

// Public route to showcase connected authorized admins/organizations
router.get('/', adminAccessController.getAdmins);

module.exports = router;
