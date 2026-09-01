const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const videoUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);

router.get('/', videoController.getVideos);
router.post('/', auth, (req, _res, next) => { req.uploadFolder = 'videos'; next(); }, videoUpload, videoController.createVideo);
router.put('/:id', auth, (req, _res, next) => { req.uploadFolder = 'videos'; next(); }, videoUpload, videoController.updateVideo);
router.delete('/:id', auth, videoController.deleteVideo);

module.exports = router;

