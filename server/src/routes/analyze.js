const express = require('express');
const multer = require('multer');
const gemmaService = require('../services/gemmaService');

const router = express.Router();

// Memory storage keeps images in RAM buffer only - zero disk persistence for privacy
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB maximum
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format. Please upload a PNG, JPEG, or WEBP image.'));
    }
  }
});

/**
 * POST /api/analyze
 * Receives an image and optional context, returns Gemma 4 structured analysis
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image uploaded. Please attach a challenge screenshot image.'
      });
    }

    const optionalContext = req.body.context || '';

    console.log(`[ANALYZE ROUTE] Received image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB, ${req.file.mimetype})`);

    const result = await gemmaService.analyzeChallenge(
      req.file.buffer,
      req.file.mimetype,
      optionalContext
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error('[ANALYZE ROUTE ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred while analyzing the image.'
    });
  }
});

/**
 * GET /api/analyze/config
 * Returns model and API readiness metadata (never exposing keys)
 */
router.get('/config', (req, res) => {
  res.json({
    configured: gemmaService.isConfigured(),
    model: gemmaService.getModelName(),
    supported_formats: ['image/png', 'image/jpeg', 'image/webp'],
    max_size_mb: 10
  });
});

module.exports = router;
