// ============================================================
// Routes: Clients
// ============================================================

const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClient);

// Protected (Admin)
router.post('/', auth, (req, _r, next) => { req.uploadFolder = 'clients'; next(); }, upload.single('logo'), clientController.createClient);
router.put('/:id', auth, (req, _r, next) => { req.uploadFolder = 'clients'; next(); }, upload.single('logo'), clientController.updateClient);
router.put('/:id/toggle', auth, clientController.toggleClient);
router.delete('/:id', auth, clientController.deleteClient);

module.exports = router;
