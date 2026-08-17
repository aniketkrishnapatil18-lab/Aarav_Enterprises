const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/knowledge.controller');
const { auth } = require('../middleware/auth');

router.get('/',    auth, ctrl.list);
router.put('/',    auth, ctrl.bulkUpdate);
router.post('/',   auth, ctrl.upsertOne);

module.exports = router;
