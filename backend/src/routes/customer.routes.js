const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/customer.controller');
const { auth } = require('../middleware/auth');

router.get('/',       auth, ctrl.list);
router.get('/:id',    auth, ctrl.detail);
router.put('/:id',    auth, ctrl.update);

module.exports = router;
