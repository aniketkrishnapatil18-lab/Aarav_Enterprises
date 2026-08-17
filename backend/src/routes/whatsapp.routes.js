const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/whatsapp.controller');
const { auth } = require('../middleware/auth');

router.get('/webhook',       ctrl.verify);   // WhatsApp verification challenge
router.post('/webhook',      ctrl.receive);  // Incoming messages
router.post('/chat',         ctrl.testMessage); // Public website AI chat
router.post('/test',         ctrl.testMessage); // Dev testing

module.exports = router;
