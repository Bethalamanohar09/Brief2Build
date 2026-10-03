const test = require('node:test');
const assert = require('node:assert/strict');
const websiteService = require('../src/services/websiteService');
const { buildAnalysisPrompt } = require('../src/prompts/analyzePrompt');

test('SSRF Protection - validateUrl detects and blocks forbidden IP addresses and localhost', () => {
  // Localhost variants
  assert.throws(() => websiteService.validateUrl('http://localhost:8080'), /blocked for security/i);
  assert.throws(() => websiteService.validateUrl('http://127.0.0.1/admin'), /blocked for security/i);
  assert.throws(() => websiteService.validateUrl('http://0.0.0.0:3000'), /blocked for security/i);
  assert.throws(() => websiteService.validateUrl('http://[::1]:5000'), /blocked for security/i);

  // Cloud metadata services
  assert.throws(() => websiteService.validateUrl('http://169.254.169.254/latest/meta-data/'), /blocked for security/i);
  assert.throws(() => websiteService.validateUrl('http://metadata.google.internal/computeMetadata/v1/'), /blocked for security/i);

  // Private subnets (RFC 1918)
  assert.throws(() => websiteService.validateUrl('http://10.0.0.1/secret'), /blocked for security/i);
  assert.throws(() => websiteService.validateUrl('http://172.16.5.1/api'), /blocked for security/i);
  assert.throws(() => websiteService.validateUrl('http://192.168.1.100/router'), /blocked for security/i);

  // Non-HTTP protocols
  assert.throws(() => websiteService.validateUrl('file:///etc/passwd'), /Only HTTP and HTTPS/i);
  assert.throws(() => websiteService.validateUrl('ftp://example.com/file'), /Only HTTP and HTTPS/i);

  // Legitimate public URLs pass validation
  assert.doesNotThrow(() => websiteService.validateUrl('https://example.com/challenge'));
  assert.doesNotThrow(() => websiteService.validateUrl('https://github.com/google/gemma'));
});

test('Prompt Builder - should include user context and enforce grounding rules', () => {
  const promptNoContext = buildAnalysisPrompt();
  assert.match(promptNoContext, /Analyze the provided challenge image/i);
  assert.match(promptNoContext, /JSON schema/i);

  const promptWithContext = buildAnalysisPrompt('We have 3 hours and want to build a mobile web app in React');
  assert.match(promptWithContext, /USER CONTEXT & TEAM CONSTRAINTS/i);
  assert.match(promptWithContext, /3 hours and want to build a mobile web app in React/i);
});

test('Live Server - Health endpoint returns HTTP 200 and healthy JSON', async () => {
  const res = await fetch('http://localhost:5000/health');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'brief2build-ai-server');
});

test('Live Server - Analyze config returns model info and supported modes', async () => {
  const res = await fetch('http://localhost:5000/api/analyze/config');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.model);
  assert.ok(Array.isArray(body.supported_modes));
  assert.ok(body.supported_modes.includes('image_upload'));
  assert.ok(body.supported_modes.includes('text_paste'));
});

test('Live Server - Validation rejects empty analyze requests with clear 400 error', async () => {
  const res = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /No challenge input provided/i);
});

test('Live Server - Inspect URL rejects private host requests with 400', async () => {
  const res = await fetch('http://localhost:5000/api/inspect-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'http://127.0.0.1:8000' })
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /blocked for security/i);
});
