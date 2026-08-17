const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/notification.controller');
const { auth } = require('../middleware/auth');

router.get('/',         auth, ctrl.list);
router.put('/:id/read', auth, ctrl.markRead);

module.exports = router;
