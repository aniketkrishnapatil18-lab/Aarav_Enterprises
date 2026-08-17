const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/category.controller');
const { auth } = require('../middleware/auth');

router.get('/',      ctrl.list);
router.post('/',     auth, ctrl.create);
router.put('/:id',   auth, ctrl.update);
router.delete('/:id',auth, ctrl.remove);

module.exports = router;
