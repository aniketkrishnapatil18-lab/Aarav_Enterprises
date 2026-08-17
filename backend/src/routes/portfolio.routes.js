const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/portfolio.controller');
const { auth } = require('../middleware/auth');
const upload  = require('../middleware/upload');

router.get('/samples/:category', ctrl.samplesByCategory); // Public — used by WhatsApp AI
router.get('/',                  ctrl.list);
router.get('/:id',               ctrl.detail);
router.post('/',                 auth, (req, _r, next) => { req.uploadFolder = 'portfolio'; next(); }, upload.single('image'), ctrl.create);
router.put('/:id',               auth, (req, _r, next) => { req.uploadFolder = 'portfolio'; next(); }, upload.single('image'), ctrl.update);
router.put('/:id/toggle',        auth, ctrl.toggle);
router.put('/:id/wa-toggle',     auth, ctrl.waToggle); // Toggle WhatsApp sample flag
router.delete('/:id',            auth, ctrl.remove);

module.exports = router;
