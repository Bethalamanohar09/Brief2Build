const express = require('express');
const websiteService = require('../services/websiteService');

const router = express.Router();

/**
 * POST /api/inspect-url
 * Explicitly approved by user to fetch and inspect a detected website link.
 * Separates website findings from screenshot findings and flags conflicts.
 */
router.post('/', async (req, res) => {
  try {
    const { url, currentPlan } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid URL to inspect.'
      });
    }

    console.log(`[INSPECT ROUTE] User explicitly approved inspecting URL: ${url}`);

    const result = await websiteService.inspectAndCompare(url, currentPlan || {});
    return res.status(200).json(result);
  } catch (err) {
    console.error('[INSPECT ROUTE ERROR]', err.message);
    const isClientError = /blocked for security|Only HTTP and HTTPS|Malformed URL|Invalid URL/i.test(err.message);
    return res.status(isClientError ? 400 : 500).json({
      success: false,
      error: err.message || 'Failed to inspect website.'
    });
  }
});

module.exports = router;
