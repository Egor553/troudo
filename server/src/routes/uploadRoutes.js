const express = require('express');
const multer = require('multer');
const router = express.Router();
const UploadService = require('../services/UploadService');
const auth = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

/**
 * @route   POST /api/upload
 * @desc    Upload file to S3/MinIO
 * @access  Private
 */
router.post('/', auth.authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const url = await UploadService.uploadFile(req.file);
        res.json({ url });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
