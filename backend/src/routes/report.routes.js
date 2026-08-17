const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/report.controller');
const { auth } = require('../middleware/auth');

router.get('/summary',    auth, ctrl.summary);
router.get('/by-service', auth, ctrl.byService);
router.get('/by-language',auth, ctrl.byLanguage);
router.get('/by-status',  auth, ctrl.byStatus);

module.exports = router;
