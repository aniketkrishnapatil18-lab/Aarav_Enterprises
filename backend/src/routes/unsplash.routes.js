const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/unsplash.controller');
const { auth } = require('../middleware/auth'); // assuming it requires auth

// Require authentication for using this endpoint to protect the API key from public abuse
router.get('/search', auth, ctrl.searchImages);

module.exports = router;
