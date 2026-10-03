const { GoogleGenAI } = require('@google/genai');
const { SYSTEM_INSTRUCTION, buildAnalysisPrompt } = require('../prompts/analyzePrompt');

/**
 * Service to interface with Google GenAI / Gemini API using the configured Gemma 4 model.
 * Supports both Multimodal (Screenshot/Image) and Text-only challenge analysis.
 */
class GemmaService {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    // Official multimodal Gemma 4 model in Gemini API or configured via env
    this.modelName = process.env.GEMMA_MODEL_ID || process.env.GEMMA_MODEL || 'gemma-4-26b-a4b-it';
  }

  isConfigured() {
    if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
      const dotenv = require('dotenv');
      const path = require('path');
      dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: true });
      dotenv.config({ override: true });
    }
    const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || this.apiKey;
    return Boolean(
      key && 
      key.trim().length > 0 && 
      !key.includes('your_google_api_key_here') &&
      !key.includes('your_gemini_api_key_here')
    );
  }

  getApiKey() {
    if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
      const dotenv = require('dotenv');
      const path = require('path');
      dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: true });
      dotenv.config({ override: true });
    }
    return process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || this.apiKey;
  }

  getModelName() {
    return process.env.GEMMA_MODEL_ID || process.env.GEMMA_MODEL || this.modelName;
  }

  /**
   * Cleans model output by stripping markdown fences (```json ... ```)
   */
  cleanJsonResponse(rawText) {
    if (!rawText) return '';
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '');
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  /**
   * Validates and repairs missing schema fields gracefully
   */
  normalizeSchema(data) {
    return {
      title: data.title || 'Untitled Challenge Analysis',
      summary: data.summary || 'No summary provided in model output.',
      target_user: data.target_user || 'Target user not specified in input.',
      problem: data.problem || 'Core problem not explicitly stated in input.',
      detected_urls: Array.isArray(data.detected_urls) 
        ? data.detected_urls.filter(u => typeof u === 'string' && u.trim().length > 0)
        : [],
      screenshot_findings: Array.isArray(data.screenshot_findings)
        ? data.screenshot_findings.map(f => ({
            category: f.category || 'General Requirement',
            detail: f.detail || '',
            visual_location: f.visual_location || 'Screenshot input'
          }))
        : [],
      extracted_requirements: Array.isArray(data.extracted_requirements) 
        ? data.extracted_requirements.map((req, idx) => ({
            requirement: req.requirement || `Requirement ${idx + 1}`,
            evidence: req.evidence || 'Observed in challenge input',
            type: req.type || 'explicit'
          }))
        : [],
      constraints: Array.isArray(data.constraints) ? data.constraints : [],
      deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
      uncertainties: Array.isArray(data.uncertainties) ? data.uncertainties : [],
      conflicts_and_discrepancies: Array.isArray(data.conflicts_and_discrepancies)
        ? data.conflicts_and_discrepancies.map(c => ({
            item: c.item || 'Scope Area',
            issue: c.issue || ''
          }))
        : [],
      mvp: {
        name: data.mvp?.name || 'Proposed MVP',
        description: data.mvp?.description || 'Focused proof-of-concept build plan.',
        features: Array.isArray(data.mvp?.features) ? data.mvp.features : []
      },
      technology_stack: Array.isArray(data.technology_stack)
        ? data.technology_stack.map(item => ({
            technology: item.technology || 'Core Framework',
            reason: item.reason || 'Optimal for speed, reliability, and deployment simplicity'
          }))
        : [],
      implementation_plan: Array.isArray(data.implementation_plan)
        ? data.implementation_plan.map((step, idx) => ({
            step: step.step || idx + 1,
            title: step.title || `Phase ${idx + 1}`,
            description: step.description || '',
            estimated_minutes: Number(step.estimated_minutes) || 45
          }))
        : [],
      tasks: Array.isArray(data.tasks)
        ? data.tasks.map((task, idx) => ({
            id: task.id || `task-${idx + 1}`,
            title: task.title || `Task ${idx + 1}`,
            description: task.description || '',
            status: task.status === 'completed' || task.status === 'in_progress' ? task.status : 'pending'
          }))
        : [],
      demo_flow: Array.isArray(data.demo_flow) ? data.demo_flow : [
        '0-30s: Introduce challenge problem statement',
        '30-75s: Demonstrate functional MVP workflow live',
        '75-105s: Show Gemma 4 multimodal analysis integration',
        '105-120s: Wrap up with impact and roadmap'
      ],
      caveats: Array.isArray(data.caveats) ? data.caveats : []
    };
  }

  /**
   * Generates a grounded build plan even when an API key is not yet configured,
   * satisfying the hackathon brief resilience requirement ("have a fallback sample if the API call fails").
   */
  generateGroundedFallbackAnalysis(optionalContext = '', hint = '') {
    const contextStr = optionalContext ? ` Team constraints: ${optionalContext}.` : '';
    
    return {
      success: true,
      model_used: `${this.getModelName()} (Grounded Fallback Mode)`,
      analyzed_at: new Date().toISOString(),
      is_fallback: true,
      fallback_notice: 'GOOGLE_API_KEY is not configured in .env. Running grounded fallback plan to keep your demonstration working.',
      data: {
        title: 'Best Use of Gemma 4 — Multimodal Challenge Extraction Plan',
        summary: `A high-impact developer tool that parses challenge screenshots and documents, extracts grounded requirements with visual evidence, and generates an actionable build plan.${contextStr}`,
        target_user: 'Hackathon engineers, rapid prototyping teams, and developers needing to quickly validate problem statements without hallucinations.',
        problem: 'Engineering teams waste critical hackathon hours deciphering ambiguous requirements screenshots, risking disqualified entries or misaligned deliverables.',
        detected_urls: [
          'https://ai.google.dev/gemma'
        ],
        screenshot_findings: [
          {
            category: 'Core Objective',
            detail: 'Build a focused experience that turns information in images, screenshots, documents, diagrams, or other inputs into a useful result with Gemma 4.',
            visual_location: 'Main Headline & Subtitle'
          },
          {
            category: 'API Requirement',
            detail: 'Meaningfully use Gemma 4 through the Gemini API. Multimodal capability must add clear value.',
            visual_location: 'Requirements Box (Item 1 & 2)'
          },
          {
            category: 'Demo Constraint',
            detail: 'Show the Gemma-powered result within the first 30 seconds of the demo. Keep total demo under 2 minutes.',
            visual_location: 'Key Focus & Submission Checklist'
          },
          {
            category: 'Reliability Rule',
            detail: 'Test it twice and have a fallback sample or screenshot if the API call fails.',
            visual_location: 'Demo and Submission Checklist'
          }
        ],
        extracted_requirements: [
          {
            requirement: 'Meaningfully use Gemma 4 through the Gemini API',
            evidence: 'Meaningfully use Gemma 4 through the Gemini API',
            type: 'explicit'
          },
          {
            requirement: 'Use multimodal capability where it adds clear value (image + text input)',
            evidence: 'Use multimodal capability where it adds value (text and image are a natural fit)',
            type: 'explicit'
          },
          {
            requirement: 'Provide one clear user story and a working end-to-end prototype',
            evidence: 'Give the experience one clear user story and a working end-to-end prototype',
            type: 'explicit'
          },
          {
            requirement: 'Make the AI result immediately demonstrable within first 30 seconds',
            evidence: 'Make the Gemma-powered result obvious within the first 30 seconds of your demo',
            type: 'explicit'
          },
          {
            requirement: 'Include a resilient fallback so the presentation never fails during live judging',
            evidence: 'Test it twice and have a fallback sample or screenshot if the API call fails',
            type: 'explicit'
          }
        ],
        constraints: [
          'Confirm available model access with organizers before building; do not assume unofficial routes.',
          'Keep demo strictly under 120 seconds.',
          'Zero disk persistence for sensitive challenge screenshots.'
        ],
        deliverables: [
          'Functional web application with screenshot upload and text input.',
          'Real-time visual grounding cards with cited evidence.',
          'Interactive task checklist with completion progress tracking.',
          'One-click GitHub Markdown export for instant team alignment.'
        ],
        uncertainties: [
          'Confirm if external dataset augmentation is scored in the final judging rubric.',
          'Verify judging panel device screen resolution for optimal presentation layout.'
        ],
        conflicts_and_discrepancies: [
          {
            item: 'Demo Timing vs Feature Depth',
            issue: 'The challenge brief limits judging presentations to 2 minutes, requiring strict focus on the core value moment rather than sprawling peripheral settings.'
          }
        ],
        mvp: {
          name: 'Brief2Build AI — From Screenshot to Build-Ready Plan',
          description: 'A focused developer workspace that accepts challenge screenshots, extracts grounded facts with visual text citations, and turns them into an editable MVP roadmap.',
          features: [
            'In-memory image ingestion with zero disk retention',
            'Grounded requirements extraction citing exact visual evidence',
            'SSRF-shielded website reference inspector',
            'Interactive checklist with real-time completion tracking',
            'One-click copyable GitHub Markdown build plan'
          ]
        },
        technology_stack: [
          {
            technology: 'React 18 + Vite',
            reason: 'Instant hot reload, minimal bundle size, and responsive dark-mode developer UI.'
          },
          {
            technology: 'Node.js + Express',
            reason: 'Lightweight single-service architecture serving both API and static frontend.'
          },
          {
            technology: 'Google GenAI SDK (@google/genai)',
            reason: 'Official upstream Google SDK providing direct access to Gemma 4 multimodal models.'
          },
          {
            technology: 'Multer RAM Storage',
            reason: 'In-memory multipart buffer processing with zero disk persistence for user privacy.'
          }
        ],
        implementation_plan: [
          {
            step: 1,
            title: 'Phase 1: Input Ingestion & In-Memory Streaming',
            description: 'Validate image formats, enforce 10MB limits, and prepare RAM buffer parts.',
            estimated_minutes: 20
          },
          {
            step: 2,
            title: 'Phase 2: Gemma 4 Grounding & Schema Enforcement',
            description: 'Format structured prompt with low temperature (0.2) to prevent hallucination.',
            estimated_minutes: 35
          },
          {
            step: 3,
            title: 'Phase 3: Interactive Workspace & Export Engine',
            description: 'Render grounded cards, editable checklist, and copyable Markdown plan.',
            estimated_minutes: 30
          },
          {
            step: 4,
            title: 'Phase 4: Deployment & Health Verification',
            description: 'Deploy single-port Node service with /health monitoring to Render.',
            estimated_minutes: 20
          }
        ],
        tasks: [
          {
            id: 'task-1',
            title: 'Wire image upload and drag-and-drop zone with MIME validation',
            description: 'Support PNG, JPG, and WEBP formats up to 10MB.',
            status: 'completed'
          },
          {
            id: 'task-2',
            title: 'Implement in-memory buffer streaming to Google GenAI SDK',
            description: 'Zero disk persistence for privacy.',
            status: 'completed'
          },
          {
            id: 'task-3',
            title: 'Connect Gemma 4 multimodal model with strict grounding prompt',
            description: 'Extract evidence quotes for each requirement.',
            status: 'completed'
          },
          {
            id: 'task-4',
            title: 'Build SSRF-shielded URL inspector for reference links',
            description: 'Block localhost and private IP subnets.',
            status: 'completed'
          },
          {
            id: 'task-5',
            title: 'Test live demo script within 120-second target window',
            description: 'Practice the 30-second core hook and results reveal.',
            status: 'pending'
          }
        ],
        demo_flow: [
          '00:00–00:20: Show problem statement and upload the challenge screenshot',
          '00:20–00:50: Reveal grounded requirements with exact visual citations (zero hallucinations)',
          '00:50–01:20: Demonstrate editable MVP scope and interactive task checklist',
          '01:20–01:45: Show SSRF-protected reference link inspection',
          '01:45–02:00: Copy GitHub Markdown plan and show live /health endpoint'
        ],
        caveats: [
          'Ensure your team reviews uncertain items with mentors before committing architecture.',
          'Live Gemma 4 API calls require a valid GOOGLE_API_KEY in your .env file.'
        ]
      }
    };
  }

  /**
   * Performs multimodal analysis on an image buffer and optional context string
   */
  async analyzeChallenge(fileBuffer, mimeType, optionalContext = '') {
    if (!this.isConfigured()) {
      console.warn('[GEMMA SERVICE] No API key configured. Utilizing grounded fallback plan.');
      return this.generateGroundedFallbackAnalysis(optionalContext, 'image');
    }

    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    const promptText = buildAnalysisPrompt(optionalContext);

    const imagePart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType
      }
    };

    const activeModel = this.getModelName();

    try {
      console.log(`[GEMMA SERVICE] Sending multimodal request to model: ${activeModel}`);
      
      const response = await ai.models.generateContent({
        model: activeModel,
        contents: [imagePart, promptText],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemma returned an empty response.');
      }

      const cleanedJson = this.cleanJsonResponse(responseText);
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedJson);
      } catch (parseErr) {
        console.error('[GEMMA SERVICE] JSON parse failed on text:', cleanedJson);
        throw new Error('Model produced non-JSON output. Please retry or adjust prompt context.');
      }

      const normalized = this.normalizeSchema(parsedData);

      return {
        success: true,
        model_used: activeModel,
        input_type: 'image',
        analyzed_at: new Date().toISOString(),
        data: normalized
      };
    } catch (err) {
      console.error('[GEMMA SERVICE ERROR]', err);
      throw new Error(err.message || 'Failed to complete Gemma 4 multimodal analysis.');
    }
  }

  /**
   * Performs text-only challenge analysis when user pastes challenge text
   */
  async analyzeTextChallenge(challengeText, optionalContext = '') {
    if (!this.isConfigured()) {
      console.warn('[GEMMA SERVICE] No API key configured. Utilizing grounded fallback plan.');
      return this.generateGroundedFallbackAnalysis(optionalContext, challengeText);
    }

    const ai = new GoogleGenAI({ apiKey: this.getApiKey() });
    let combinedInput = `CHALLENGE STATEMENT / REQUIREMENT SPECIFICATION:\n"""\n${challengeText.trim()}\n"""\n`;
    if (optionalContext && optionalContext.trim().length > 0) {
      combinedInput += `\nUSER CONTEXT & TEAM CONSTRAINTS:\n"""\n${optionalContext.trim()}\n"""\n`;
    }
    const promptText = buildAnalysisPrompt(combinedInput);
    const activeModel = this.getModelName();

    try {
      console.log(`[GEMMA SERVICE] Sending text analysis request to model: ${activeModel}`);
      
      const response = await ai.models.generateContent({
        model: activeModel,
        contents: [promptText],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemma returned an empty response.');
      }

      const cleanedJson = this.cleanJsonResponse(responseText);
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedJson);
      } catch (parseErr) {
        console.error('[GEMMA SERVICE] JSON parse failed on text:', cleanedJson);
        throw new Error('Model produced non-JSON output. Please retry or adjust prompt context.');
      }

      const normalized = this.normalizeSchema(parsedData);

      return {
        success: true,
        model_used: activeModel,
        input_type: 'text',
        analyzed_at: new Date().toISOString(),
        data: normalized
      };
    } catch (err) {
      console.error('[GEMMA SERVICE ERROR]', err);
      throw new Error(err.message || 'Failed to complete Gemma 4 text analysis.');
    }
  }
}

module.exports = new GemmaService();
