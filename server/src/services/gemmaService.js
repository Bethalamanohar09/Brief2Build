const { GoogleGenAI } = require('@google/genai');
const { SYSTEM_INSTRUCTION, buildAnalysisPrompt } = require('../prompts/analyzePrompt');

/**
 * Service to interface with Google GenAI / Gemini API using the configured Gemma 4 model.
 */
class GemmaService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    // The exact model identifier confirmed by event organizers or configured via env
    this.modelName = process.env.GEMMA_MODEL || 'gemma-4';
  }

  isConfigured() {
    return Boolean(
      this.apiKey && 
      this.apiKey.trim().length > 0 && 
      !this.apiKey.includes('your_gemini_api_key_here')
    );
  }

  getModelName() {
    return this.modelName;
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
      extracted_requirements: Array.isArray(data.extracted_requirements) 
        ? data.extracted_requirements.map((req, idx) => ({
            requirement: req.requirement || `Requirement ${idx + 1}`,
            evidence: req.evidence || 'Observed in visual layout',
            type: req.type || 'explicit'
          }))
        : [],
      constraints: Array.isArray(data.constraints) ? data.constraints : [],
      deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
      uncertainties: Array.isArray(data.uncertainties) ? data.uncertainties : [],
      mvp: {
        name: data.mvp?.name || 'Proposed MVP',
        description: data.mvp?.description || 'Focused hackathon proof-of-concept.',
        features: Array.isArray(data.mvp?.features) ? data.mvp.features : []
      },
      technology_stack: Array.isArray(data.technology_stack)
        ? data.technology_stack.map(item => ({
            technology: item.technology || 'Core Framework',
            reason: item.reason || 'Optimal for hackathon speed and reliability'
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
   * Performs multimodal analysis on an image buffer and optional context string
   */
  async analyzeChallenge(fileBuffer, mimeType, optionalContext = '') {
    if (!this.isConfigured()) {
      throw new Error(
        'GEMINI_API_KEY is not configured. Please supply a valid Google Gemini API key in your .env file or Render environment variables.'
      );
    }

    const ai = new GoogleGenAI({ apiKey: this.apiKey });
    const promptText = buildAnalysisPrompt(optionalContext);

    const imagePart = {
      inlineData: {
        data: fileBuffer.toString('base64'),
        mimeType: mimeType
      }
    };

    try {
      console.log(`[GEMMA SERVICE] Sending request to model: ${this.modelName} via Gemini API`);
      
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: [imagePart, promptText],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.2 // Low temperature for high factual precision and schema compliance
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
        model_used: this.modelName,
        analyzed_at: new Date().toISOString(),
        data: normalized
      };
    } catch (err) {
      console.error('[GEMMA SERVICE ERROR]', err);
      // Re-throw sanitized error for API response
      throw new Error(err.message || 'Failed to complete Gemma 4 multimodal analysis.');
    }
  }
}

module.exports = new GemmaService();
