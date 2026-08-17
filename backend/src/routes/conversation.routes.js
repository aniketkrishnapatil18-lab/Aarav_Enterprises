const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/conversation.controller');
const { auth } = require('../middleware/auth');

router.get('/',          auth, ctrl.list);
router.get('/:id',       auth, ctrl.detail);
router.post('/:id/messages', auth, ctrl.sendMessage);
router.put('/:id/status',   auth, ctrl.updateStatus);
router.put('/:id/close',    auth, ctrl.closeConversation);

module.exports = router;
