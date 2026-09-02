const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/product.controller');
const { auth, optionalAuth } = require('../middleware/auth');
const upload  = require('../middleware/upload');

router.get('/',             optionalAuth, ctrl.list);
router.get('/:id',          ctrl.detail);
router.post('/',            auth, (req, _res, next) => { req.uploadFolder = 'products'; next(); }, upload.single('thumbnail'), ctrl.create);
router.put('/:id',          auth, (req, _res, next) => { req.uploadFolder = 'products'; next(); }, upload.single('thumbnail'), ctrl.update);
router.put('/:id/toggle',   auth, ctrl.toggle);
router.delete('/:id',       auth, ctrl.remove);

module.exports = router;
