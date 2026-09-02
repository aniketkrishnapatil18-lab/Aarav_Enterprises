const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inquiry.controller');
const { auth } = require('../middleware/auth');
const upload  = require('../middleware/upload');

router.get('/',                  auth, ctrl.list);
router.get('/:id',               auth, ctrl.detail);
router.put('/:id',               auth, ctrl.update);
router.put('/:id/status',        auth, ctrl.updateStatus);
router.post('/:id/messages',     auth, ctrl.addNote);
router.post('/',                     ctrl.createPublic);
router.post('/:id/upload-design',auth, (req, _r, next) => { req.uploadFolder = 'portfolio'; next(); }, upload.single('image'), ctrl.uploadDesign);
router.post('/:id/publish',      auth, ctrl.publishToPortfolio);

module.exports = router;
