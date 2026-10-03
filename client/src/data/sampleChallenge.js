/**
 * Sample Challenge Brief for instant demonstration during judging and testing.
 * Modelled directly on the official Hacktoberfest Hack Day 2026 "Best Use of Gemma 4" challenge.
 */

// Base64 encoded high-contrast sample challenge graphic for quick demonstration
export const SAMPLE_CHALLENGE_TITLE = "Hack Day 2026 — Gemma 4 Multimodal Challenge";

export const SAMPLE_CHALLENGE_CONTEXT = 
  "Team size: 3 engineers (1 Frontend, 1 Fullstack, 1 AI/ML). Time remaining: 24 hours. Primary judging criteria: Real Gemma multimodal integration, working functional prototype, and clear UI separation of extracted facts vs suggestions.";

export const SAMPLE_DEMO_RESULT = {
  success: true,
  model_used: "gemma-4 (via Gemini API)",
  analyzed_at: new Date().toISOString(),
  data: {
    title: "Brief2Build AI — Gemma 4 Challenge Execution Plan",
    summary: "Build a focused web application that ingests visual screenshots of hackathon challenge briefs, extracts explicit requirements with visual citations, and synthesizes an editable MVP build plan using Gemma 4.",
    target_user: "Hackathon participants and student engineering teams struggling to decipher complex visual requirements under tight deadlines.",
    problem: "Hackathon teams waste hours debating ambiguous challenge screenshots and manual task division instead of executing their MVP build.",
    extracted_requirements: [
      {
        requirement: "Meaningfully use Gemma 4 through the Gemini API with multimodal input (images/screenshots).",
        evidence: "Official Challenge: Meaningfully use Gemma 4 through the Gemini API. Use multimodal input, especially images and screenshots.",
        type: "explicit"
      },
      {
        requirement: "Build one focused experience with one clear user story; no generic chatbots or multi-agent bloat.",
        evidence: "Build one focused experience with one clear user story. Do not expand into a generic chatbot or multi-agent system.",
        type: "explicit"
      },
      {
        requirement: "Provide a functional end-to-end working prototype with Gemma result obvious in first 30 seconds of demo.",
        evidence: "Provide a functional, end-to-end working prototype. Make the Gemma-powered result obvious within first 30 seconds.",
        type: "explicit"
      },
      {
        requirement: "Deploy a working version to Render Web Service and provide public live URL.",
        evidence: "Deploy a working version to Render... Express should serve the built Vite frontend and handle /api routes.",
        type: "explicit"
      },
      {
        requirement: "Publish public GitHub repo with MIT License and thorough README; zero exposed secrets.",
        evidence: "Publish source code in a public GitHub repository. Include an open-source license, such as MIT. Never expose API keys.",
        type: "explicit"
      }
    ],
    constraints: [
      "No model training — use official supported existing Gemma model/API",
      "No database or complex auth bloat unless core workflow is complete",
      "Render single web service architecture (Express serving built Vite frontend)",
      "Strict data privacy: server-side memory processing; never store user images permanently"
    ],
    deliverables: [
      "Public GitHub repository with clean commit history",
      "Live deployed URL on Render",
      "2-minute judge video demonstration",
      "Comprehensive README with architecture & prompt documentation"
    ],
    uncertainties: [
      "Exact Gemma 4 model string identifier from event organizers (placeholder configured)",
      "Specific rate limits or token allowances on the provided hackathon API key"
    ],
    mvp: {
      name: "Brief2Build AI Core Workflow",
      description: "An image upload and analysis engine that ingests challenge screenshots, invokes Gemma 4 with grounding constraints, and renders an editable markdown roadmap and team task checklist.",
      features: [
        "In-memory drag-and-drop screenshot upload with client & server validation",
        "Gemma 4 multimodal extraction separating ground truth from AI recommendations",
        "Editable MVP proposal and reasoned tech stack cards",
        "Interactive team task checklist with real-time completion tracking",
        "One-click GitHub-ready Markdown and JSON export"
      ]
    },
    technology_stack: [
      {
        technology: "React + Vite",
        reason: "Instant hot-module reloading and minimal production bundle size for fast 30-second demos"
      },
      {
        technology: "Tailwind CSS",
        reason: "Professional developer-tool aesthetic with high contrast and dark mode"
      },
      {
        technology: "Node.js & Express",
        reason: "Lightweight, reliable backend that handles image streams and serves static Vite assets on Render"
      },
      {
        technology: "Google GenAI SDK (@google/genai)",
        reason: "Official supported SDK for calling Gemma 4 through the Gemini API with structured prompts"
      },
      {
        technology: "Multer (MemoryStorage)",
        reason: "Guarantees zero disk persistence of user screenshots, ensuring strict privacy"
      }
    ],
    implementation_plan: [
      {
        step: 1,
        title: "Setup & Clean Architecture",
        description: "Scaffold Express backend, React Vite client, Tailwind CSS, and /health monitoring endpoint.",
        estimated_minutes: 30
      },
      {
        step: 2,
        title: "Gemma 4 API Integration",
        description: "Implement Multer memory upload, base64 payload construction, grounded prompt design, and JSON normalization.",
        estimated_minutes: 45
      },
      {
        step: 3,
        title: "Results View & Interactive Workspace",
        description: "Build provenanced evidence cards, editable MVP/Tech Stack, and real-time task checklist.",
        estimated_minutes: 45
      },
      {
        step: 4,
        title: "Polish, Export & Local Production Testing",
        description: "Add Markdown/JSON export, demo sample quick-loader, and test local single-port production build.",
        estimated_minutes: 30
      },
      {
        step: 5,
        title: "Render Deployment & Documentation",
        description: "Create render.yaml, write complete README, add MIT license, and verify live URL.",
        estimated_minutes: 30
      }
    ],
    tasks: [
      {
        id: "task-1",
        title: "Verify /health and server-client proxy",
        description: "Ensure local port 5000 and 5173 communicate cleanly",
        status: "completed"
      },
      {
        id: "task-2",
        title: "Design Gemma 4 grounded prompt module",
        description: "Enforce strict separation between visual facts and AI suggestions",
        status: "completed"
      },
      {
        id: "task-3",
        title: "Implement Multer in-memory upload pipeline",
        description: "Validate MIME type and size limits before calling GenAI SDK",
        status: "completed"
      },
      {
        id: "task-4",
        title: "Build editable workspace & checklist UI",
        description: "Allow teams to customize features, stack, and mark tasks as done",
        status: "completed"
      },
      {
        id: "task-5",
        title: "Deploy to Render & test live health check",
        description: "Bind to 0.0.0.0 and supply GEMINI_API_KEY privately in Render dashboard",
        status: "pending"
      }
    ],
    demo_flow: [
      "0-15s: Hook — 'Brief2Build AI turns messy challenge screenshots into an editable build plan in 30 seconds.'",
      "15-35s: Upload a real hackathon screenshot, add team context, and click 'Analyze with Gemma 4'.",
      "35-65s: Show extracted requirements with visual citations, constraints, and uncertainties requiring verification.",
      "65-95s: Show the editable MVP scope, justified tech stack, and check off completed tasks on the live board.",
      "95-110s: Click 'Copy Markdown' to demonstrate instant GitHub-ready planning for team members.",
      "110-120s: Highlight the clean Express + Vite architecture deployed live on Render."
    ],
    caveats: [
      "Ensure GEMINI_API_KEY is configured in server .env or Render dashboard before running live calls",
      "Confirm exact Gemma model name with hackathon mentors if custom endpoint is required"
    ]
  }
};
