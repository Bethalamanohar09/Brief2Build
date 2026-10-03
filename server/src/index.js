const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from project root or server folder
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to server/.env if present

const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');
const analyzeRouter = require('./routes/analyze');
const inspectRouter = require('./routes/inspect');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? false // In production, frontend is served directly from Express
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/health', healthRouter);
app.use('/api/health', healthRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/inspect-url', inspectRouter);

// API route placeholder for Checkpoint 1
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    app: 'Brief2Build AI API',
    checkpoint: 'Checkpoint 1 - Skeleton & UI Ready',
    model_ready: Boolean(process.env.GEMINI_API_KEY && process.env.GEMMA_MODEL)
  });
});

// Serve static frontend in production (Render single-service deployment)
const clientDistPath = path.resolve(__dirname, '../../client/dist');
const fs = require('fs');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Catch-all route for client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: 'error'
  });
});

// Start listening
const server = app.listen(PORT, HOST, () => {
  console.log(`=========================================`);
  console.log(` Brief2Build AI Server running on http://${HOST}:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(`=========================================`);
});

module.exports = { app, server };
