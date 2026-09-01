const Video = require('../models/video.model');

// List Videos
exports.getVideos = async (req, res) => {
    try {
        const filters = req.query;
        const videos = await Video.findAll(filters);
        res.json({ success: true, data: videos });
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create Video
exports.createVideo = async (req, res) => {
    try {
        const data = { ...req.body };
        if (req.files) {
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                data.thumbnail_url = `/uploads/videos/${req.files.thumbnail[0].filename}`;
            }
            if (req.files.video && req.files.video[0]) {
                data.video_url = `/uploads/videos/${req.files.video[0].filename}`;
            }
        }
        const id = await Video.create(data);
        res.status(201).json({ success: true, message: 'Video created successfully', id });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update Video
exports.updateVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        if (req.files) {
            if (req.files.thumbnail && req.files.thumbnail[0]) {
                data.thumbnail_url = `/uploads/videos/${req.files.thumbnail[0].filename}`;
            }
            if (req.files.video && req.files.video[0]) {
                data.video_url = `/uploads/videos/${req.files.video[0].filename}`;
            }
        }
        const affected = await Video.update(id, data);
        if (affected === 0) return res.status(404).json({ success: false, message: 'Video not found' });
        res.json({ success: true, message: 'Video updated successfully' });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete Video
exports.deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const affected = await Video.delete(id);
        if (affected === 0) return res.status(404).json({ success: false, message: 'Video not found' });
        res.json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
