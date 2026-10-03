const express = require('express');
const router = express.Router();

/**
 * GET /health
 * Basic health check endpoint for monitoring & Render deployment checks
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'brief2build-ai-server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    model_configured: Boolean(process.env.GEMMA_MODEL)
  });
});

module.exports = router;
