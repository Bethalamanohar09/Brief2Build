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
 * Receives either an image upload OR pasted challenge text + optional context
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const hasImage = Boolean(req.file);
    const challengeText = req.body?.challengeText?.trim() || '';
    const optionalContext = req.body?.context?.trim() || '';

    if (!hasImage && !challengeText) {
      return res.status(400).json({
        success: false,
        error: 'No challenge input provided. Please upload a screenshot or paste your challenge requirements text.'
      });
    }

    let result;
    if (hasImage) {
      console.log(`[ANALYZE ROUTE] Received image: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB, ${req.file.mimetype})`);
      result = await gemmaService.analyzeChallenge(
        req.file.buffer,
        req.file.mimetype,
        optionalContext
      );
    } else {
      console.log(`[ANALYZE ROUTE] Received pasted challenge text (${challengeText.length} characters)`);
      result = await gemmaService.analyzeTextChallenge(
        challengeText,
        optionalContext
      );
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('[ANALYZE ROUTE ERROR]', err.message);
    return res.status(500).json({
      success: false,
      error: err.message || 'An unexpected error occurred while analyzing the challenge.'
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
    supported_modes: ['image_upload', 'text_paste'],
    max_size_mb: 10
  });
});

module.exports = router;
