import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadCard from './components/UploadCard';
import ResultsView from './components/ResultsView';
import { 
  Sparkles, 
  Terminal, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  X,
  FileImage,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
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
    const interval = setInterval(checkServerHealth, 15000);
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
      const isMissingKey = 
        err.message.includes('GOOGLE_API_KEY') || 
        err.message.includes('GEMINI_API_KEY') || 
        err.message.includes('API key');

      setErrorInfo({
        message: isMissingKey 
          ? "AI service is not configured yet. Please configure the server's AI API key to enable live challenge analysis."
          : err.message,
        isKeyMissing: isMissingKey
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
    <div className="min-h-screen flex flex-col bg-[#070B14] text-slate-100 ambient-bg selection:bg-blue-600/30">
      <Header 
        serverStatus={serverStatus} 
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onNavigateHome={handleReset}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* If Active Analysis is loaded, show Results Workspace */}
        {activeAnalysis ? (
          <ResultsView 
            analysisData={activeAnalysis}
            originalImage={lastUploadedFile}
            userContext={lastContext}
            onReset={handleReset}
          />
        ) : (
          /* Main Workspace View */
          <div>
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-4 tracking-wider uppercase">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>AI Project Planner</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                Brief2Build <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">AI</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto">
                Turn project challenges into clear, actionable development plans.
              </p>

              {/* Visual Flow Indicator */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-slate-400 mt-6 max-w-md mx-auto">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 text-slate-300 font-medium">
                  <FileImage className="h-3.5 w-3.5 text-blue-400" /> Challenge Input
                </span>
                <ArrowRight className="h-3 w-3 text-slate-600" />
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 text-slate-300 font-medium">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> AI Grounding
                </span>
                <ArrowRight className="h-3 w-3 text-slate-600" />
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center gap-1.5 text-slate-300 font-medium">
                  <ClipboardList className="h-3.5 w-3.5 text-emerald-400" /> Build Plan
                </span>
              </div>
            </div>

            {/* Error Notice (Compact & Clean) */}
            {errorInfo && (
              <div className="max-w-3xl mx-auto mb-6 p-4 rounded-xl bg-slate-900/90 border border-red-500/30 text-slate-200 text-sm shadow-xl flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-200 text-xs uppercase tracking-wider">Notice</p>
                    <p className="text-xs text-slate-300 mt-1">{errorInfo.message}</p>
                    
                    {errorInfo.isKeyMissing && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          onClick={handleLoadDemoWorkspace}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
                        >
                          Explore Sample Plan
                        </button>
                        <button
                          onClick={() => setErrorInfo(null)}
                          className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs transition"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {!errorInfo.isKeyMissing && (
                  <button onClick={() => setErrorInfo(null)} className="text-slate-400 hover:text-white p-1">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            {/* Main Upload / Input Workspace Card */}
            <UploadCard 
              onAnalyze={handleStartAnalysis}
              isAnalyzing={isAnalyzing}
              serverStatus={serverStatus}
            />

            {/* Value Proposition Cards */}
            <div className="mt-14 sm:mt-18 border-t border-slate-800/80 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                <div className="glass-panel glass-panel-hover rounded-xl p-5">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <FileCode className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">Visual Grounding</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Extracts explicit requirements and constraints directly from screenshots, citing visual evidence quotes.
                  </p>
                </div>

                <div className="glass-panel glass-panel-hover rounded-xl p-5">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">Focused MVP Scope</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Recommends a feasible, high-impact MVP tailored to hackathon time constraints and team skills.
                  </p>
                </div>

                <div className="glass-panel glass-panel-hover rounded-xl p-5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">Execution Roadmap</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generates an interactive team task checklist, reasoned tech stack, and 2-minute demo pitch flow.
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
          <div className="bg-[#0B101E] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-blue-400" />
                <h3 className="font-bold text-white text-base">How Brief2Build AI Works</h3>
              </div>
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">1. In-Memory Privacy:</strong> Your challenge screenshot is parsed in RAM buffer memory. Zero bytes are saved to disk.
              </p>
              <p>
                <strong className="text-white">2. Multimodal Extraction:</strong> Gemma 4 reads visible requirements with temperature 0.2 to prevent hallucinations and cite visual text quotes.
              </p>
              <p>
                <strong className="text-white">3. Editable Workspace:</strong> Review ground truth facts, customize your MVP scope, check off tasks, and copy a complete GitHub Markdown plan with one click.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070B14] py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Brief2Build AI — AI-Powered Challenge Architect
          </p>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>System: <code className="text-slate-300 font-mono">{serverStatus}</code></span>
            <span>•</span>
            <button onClick={() => setShowHowItWorks(true)} className="hover:text-blue-400 transition">
              How it works
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
