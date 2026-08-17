const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/settings.controller');
const { auth } = require('../middleware/auth');

router.get('/',        ctrl.getAll);         // Public (non-secret)
router.get('/admin',   auth, ctrl.getAllAdmin);  // Admin view
router.put('/',        auth, ctrl.update);

module.exports = router;
