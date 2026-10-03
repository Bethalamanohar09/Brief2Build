/**
 * Generic Sample Challenge Brief for Brief2Build AI.
 * Demonstrates the full multimodal workflow, grounded visual extraction, and website intelligence.
 */

export const SAMPLE_CHALLENGE_TITLE = "EcoRoute AI — Sustainable Mobility & Carbon Optimization";

export const SAMPLE_CHALLENGE_TEXT = `CHALLENGE STATEMENT: EcoRoute AI
Build a focused web application that ingests urban transit routes, extracts carbon emission factors, and synthesizes an optimized, multi-modal travel roadmap.

CORE REQUIREMENTS:
1. Meaningfully integrate Gemma 4 through the Gemini API for multimodal intelligence.
2. Ingest transit screenshots or commute schedules and extract explicit constraints with evidence citations.
3. Build one focused user story with an interactive, end-to-end working prototype.
4. Calculate comparative carbon footprint savings across transit modes (metro, bus, cycling, EV).
5. Deploy a working version to a cloud web service with a public live URL and /health endpoint.
6. Provide an interactive team checklist and exportable project plan.

CONSTRAINTS & RULES:
- Development Window: 24-hour rapid development sprint.
- No heavy database or payment gateway bloat; focus on core MVP user journey.
- Ground all extracted facts; strictly separate visible constraints from AI suggestions.
- Reference documentation: https://ai.google.dev/gemma`;

export const SAMPLE_CHALLENGE_CONTEXT = 
  "Team size: 3 engineers (1 Frontend, 1 Backend, 1 AI/ML). Time remaining: 24 hours. Primary focus: high-reliability prototype, real Gemma 4 integration, and clear separation of extracted facts vs suggestions.";

export const SAMPLE_DEMO_RESULT = {
  success: true,
  model_used: "gemma-4-26b-a4b-it",
  input_type: "sample_demonstration",
  analyzed_at: new Date().toISOString(),
  data: {
    title: "EcoRoute AI — Sustainable Mobility & Transit Optimizer",
    summary: "A focused transit intelligence application that analyzes multimodal travel schedules, extracts explicit constraints, and generates an optimized low-emission commute plan.",
    target_user: "Urban commuters, student teams, and logistics coordinators seeking to reduce carbon footprints without increasing travel time.",
    problem: "Commuters struggle to decipher fragmented transit schedules and lack immediate visibility into carbon trade-offs between transit options.",
    detected_urls: [
      "https://ai.google.dev/gemma"
    ],
    screenshot_findings: [
      {
        category: "Requirement",
        detail: "Must process multimodal input (schedules, screenshots) through Gemini API.",
        visual_location: "Core Requirements Box (Item 1 & 2)"
      },
      {
        category: "Deliverable",
        detail: "Provide an end-to-end working prototype with live deployment URL and /health check.",
        visual_location: "Core Requirements Box (Item 3 & 5)"
      },
      {
        category: "Constraint",
        detail: "Strict 24-hour sprint timeframe with lean tech stack.",
        visual_location: "Constraints & Rules Box"
      },
      {
        category: "Reference Link",
        detail: "Official documentation link visible on reference bar.",
        visual_location: "Footer documentation bar"
      }
    ],
    extracted_requirements: [
      {
        requirement: "Meaningfully use Gemma 4 through the Gemini API for multimodal challenge understanding.",
        evidence: "1. Meaningfully integrate Gemma 4 through the Gemini API for multimodal intelligence.",
        type: "explicit"
      },
      {
        requirement: "Ingest transit screenshots and extract explicit constraints with evidence citations.",
        evidence: "2. Ingest transit screenshots or commute schedules and extract explicit constraints with evidence citations.",
        type: "explicit"
      },
      {
        requirement: "Build one focused user story with an interactive, end-to-end working prototype.",
        evidence: "3. Build one focused user story with an interactive, end-to-end working prototype.",
        type: "explicit"
      },
      {
        requirement: "Calculate comparative carbon footprint savings across transit modes.",
        evidence: "4. Calculate comparative carbon footprint savings across transit modes (metro, bus, cycling, EV).",
        type: "explicit"
      },
      {
        requirement: "Deploy working application to cloud web service with /health monitoring endpoint.",
        evidence: "5. Deploy a working version to a cloud web service with a public live URL and /health endpoint.",
        type: "explicit"
      }
    ],
    constraints: [
      "24-hour rapid development sprint window",
      "No database or complex payment bloat; keep architecture lightweight",
      "Strict data privacy: process images in RAM; never store user files permanently",
      "Single-service cloud deployment with health check"
    ],
    deliverables: [
      "Public GitHub repository with MIT License and clean commit history",
      "Live deployed URL on Render or equivalent cloud service",
      "2-minute judge video demonstration",
      "Architecture diagram and prompt documentation in README"
    ],
    uncertainties: [
      "Exact municipal transit open data API refresh frequency",
      "Specific rate limits or token allowances on configured API key"
    ],
    conflicts_and_discrepancies: [
      {
        item: "Sprint Scope vs Feature Count",
        issue: "Brief outlines 6 distinct deliverables within 24 hours. Recommendation: Focus on 1 primary user flow to ensure a flawless working prototype."
      }
    ],
    mvp: {
      name: "EcoRoute AI Core Navigator",
      description: "An intelligent challenge analysis and transit optimization prototype that extracts explicit constraints from visual briefs and builds an actionable execution roadmap.",
      features: [
        "In-memory drag-and-drop screenshot upload with client & server validation",
        "Gemma 4 multimodal extraction separating visual ground truth from AI recommendations",
        "Interactive team task checklist with real-time completion tracking",
        "Live reference URL detection with explicit user approval workflow",
        "One-click GitHub-ready Markdown and JSON export"
      ]
    },
    technology_stack: [
      {
        technology: "React + Vite",
        reason: "Ultra-fast hot module reloading and minimal production bundle size for responsive demos"
      },
      {
        technology: "Tailwind CSS",
        reason: "Professional developer-tool aesthetic with high contrast and accessible dark mode"
      },
      {
        technology: "Node.js & Express",
        reason: "Lightweight, reliable backend that handles image streams and serves static assets"
      },
      {
        technology: "Google GenAI SDK (@google/genai)",
        reason: "Official supported SDK for calling Gemma 4 through the Gemini API"
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
        title: "URL Intelligence & Website Inspection",
        description: "Implement safe URL retrieval with SSRF defense and cross-referenced discrepancy detection.",
        estimated_minutes: 35
      },
      {
        step: 5,
        title: "Polish, Export & Local Production Testing",
        description: "Add Markdown/JSON export, demo quick-loader, and test local single-port production build.",
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
        description: "Bind to 0.0.0.0 and supply GOOGLE_API_KEY privately in Render dashboard",
        status: "pending"
      }
    ],
    demo_flow: [
      "0-15s: Hook — 'Brief2Build AI turns complex challenge screenshots into an editable build plan in 30 seconds.'",
      "15-35s: Upload a challenge screenshot or paste text, add team context, and click 'Analyze with Gemma 4'.",
      "35-65s: Show extracted requirements with visual citations, constraints, and detected reference URLs.",
      "65-95s: Demonstrate explicit approval for website inspection, showing separated findings and discrepancies.",
      "95-110s: Edit the MVP scope live and check off tasks on the interactive checklist.",
      "110-120s: Click 'Copy Markdown' to demonstrate instant GitHub-ready project planning."
    ],
    caveats: [
      "Ensure GOOGLE_API_KEY (or GEMINI_API_KEY) is configured in server .env or hosting environment variables",
      "Model identifier defaults to gemma-4-26b-a4b-it or your configured GEMMA_MODEL_ID"
    ]
  }
};
