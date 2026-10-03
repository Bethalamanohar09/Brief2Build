import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadCard from './components/UploadCard';
import ResultsView from './components/ResultsView';
import { Sparkles, Terminal, FileCode, CheckCircle2, AlertCircle, Info, Key, ExternalLink, HelpCircle, X } from 'lucide-react';
import { SAMPLE_DEMO_RESULT } from './data/sampleChallenge';

export default function App() {
  const [serverStatus, setServerStatus] = useState('checking'); // checking | online | offline
  const [serverMeta, setServerMeta] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState(null);
  const [lastContext, setLastContext] = useState('');

  // Auto-poll server health
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch('/health');
        if (response.ok) {
          const data = await response.json();
          setServerStatus('online');
          setServerMeta(data);
        } else {
          setServerStatus('offline');
        }
      } catch (err) {
        console.warn('Backend server not reachable yet:', err.message);
        setServerStatus('offline');
      }
    };

    checkServerHealth();
    const interval = setInterval(checkServerHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartAnalysis = async ({ mode, file, challengeText, context }) => {
    setIsAnalyzing(true);
    setErrorInfo(null);
    setLastUploadedFile(file);
    setLastContext(context);

    const formData = new FormData();
    if (file) {
      formData.append('image', file);
    }
    if (challengeText) {
      formData.append('challengeText', challengeText);
    }
    if (context) {
      formData.append('context', context);
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze challenge specification.');
      }

      setActiveAnalysis(json);
    } catch (err) {
      console.error('[ANALYSIS CLIENT ERROR]', err.message);
      setErrorInfo({
        message: err.message,
        isKeyMissing: 
          err.message.includes('GOOGLE_API_KEY') || 
          err.message.includes('GEMINI_API_KEY') || 
          err.message.includes('API key')
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadDemoWorkspace = () => {
    setErrorInfo(null);
    setActiveAnalysis(SAMPLE_DEMO_RESULT);
  };

  const handleReset = () => {
    setActiveAnalysis(null);
    setErrorInfo(null);
    setLastUploadedFile(null);
    setLastContext('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header serverStatus={serverStatus} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* If Active Analysis is loaded, show the Results Workspace */}
        {activeAnalysis ? (
          <ResultsView 
            analysisData={activeAnalysis}
            originalImage={lastUploadedFile}
            userContext={lastContext}
            onReset={handleReset}
          />
        ) : (
          /* Upload & Initial Welcome View */
          <div>
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/50 text-xs text-blue-300 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                <span className="font-medium tracking-wide">Brief2Build AI • Powered by Gemma 4</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-tight mb-4">
                From Challenge Screenshot <br className="hidden sm:inline" />
                to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">Build-Ready Plan</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Turn confusing hackathon problem statements, screenshots, and visual requirements into an editable MVP scope, justified tech stack, and step-by-step roadmap powered by Gemma 4.
              </p>

              <div className="mt-4 flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowHowItWorks(true)}
                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-blue-400 transition"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>How Gemma 4 processes your brief</span>
                </button>
              </div>
            </div>

            {/* Error Banner with helpful actions */}
            {errorInfo && (
              <div className="max-w-3xl mx-auto mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-slate-200 text-sm shadow-xl">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-red-200">Analysis Request Notice</p>
                    <p className="text-xs text-slate-300 mt-1">{errorInfo.message}</p>

                    {errorInfo.isKeyMissing && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-red-900/40 text-xs space-y-2">
                        <div className="flex items-center space-x-2 text-amber-300 font-medium">
                          <Key className="h-4 w-4" />
                          <span>How to enable live Gemma 4 calls:</span>
                        </div>
                        <p className="text-slate-400">
                          Add your Gemini API key in the server's <code className="text-amber-200 font-mono">.env</code> file:
                        </p>
                        <pre className="p-2 rounded bg-slate-900 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                          GEMINI_API_KEY=your_actual_key_here
                        </pre>
                        <p className="text-[11px] text-slate-500">
                          (In Render deployment, add this in Render Dashboard &gt; Environment Variables).
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleLoadDemoWorkspace}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center space-x-1.5 shadow-md transition"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                        <span>Explore Demo Workspace (Sample Output)</span>
                      </button>
                      <button
                        onClick={() => setErrorInfo(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Panel */}
            <UploadCard 
              onAnalyze={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
              serverStatus={serverStatus}
              onTrySampleDemo={handleLoadDemoWorkspace}
            />

            {/* Value Proposition Cards / Workflow explanation */}
            <div className="mt-16 sm:mt-20 border-t border-slate-800/80 pt-12">
              <div className="text-center mb-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  How Brief2Build AI Accelerates Hackathon Teams
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Separating strictly extracted facts from generative recommendations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <FileCode className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1.5">1. Multimodal Grounding</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Extracts explicit requirements, constraints, and submission rules directly from your screenshot, citing visual evidence quotes.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1.5">2. Realistic MVP Scope</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Recommends a sharply focused MVP that your team can actually complete within the hackathon time limits without scope creep.
                  </p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1.5">3. Implementation & Demo Flow</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generates an interactive team checklist, justified tech stack, and a 2-minute judge demo flow ready to copy into your README.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* How It Works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">How Gemma 4 Powers Brief2Build AI</h3>
              </div>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">1. Multimodal Ingestion:</strong> Your screenshot is ingested in Express via Multer memory storage. The raw image bytes never touch disk, safeguarding confidential challenge materials.
              </p>
              <p>
                <strong className="text-white">2. Grounded Prompt Engineering:</strong> The image buffer and optional context are sent to the configured Gemma 4 model via the Google GenAI SDK with low temperature (<code className="text-blue-400 font-mono">0.2</code>) and a strict system instruction to separate facts from AI suggestions.
              </p>
              <p>
                <strong className="text-white">3. Visual Citations:</strong> For each extracted requirement, Gemma cites the exact visual snippet where the text was detected, ensuring verifiable grounding.
              </p>
              <p>
                <strong className="text-white">4. Editable Workspace:</strong> The parsed JSON is rendered into interactive, customizable cards. You can adjust the MVP scope, add custom tasks, check off progress, and export a complete GitHub README in Markdown with one click.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Brief2Build AI — From Challenge Screenshot to Build-Ready Plan
          </p>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Server: <code className="text-slate-300 font-mono">{serverStatus}</code></span>
            <span>•</span>
            <span>Architecture: <code className="text-blue-400 font-mono">Vite + Express (Single Service)</code></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
