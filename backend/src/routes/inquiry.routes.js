const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inquiry.controller');
const { auth } = require('../middleware/auth');

router.get('/',                  auth, ctrl.list);
router.get('/:id',               auth, ctrl.detail);
router.put('/:id',               auth, ctrl.update);
router.put('/:id/status',        auth, ctrl.updateStatus);
router.post('/:id/messages',     auth, ctrl.addNote);
router.post('/',                     ctrl.createPublic);

module.exports = router;
