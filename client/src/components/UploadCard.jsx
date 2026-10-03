import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  X, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  ShieldCheck, 
  PlayCircle,
  FileCode2,
  Trash2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_CHALLENGE_CONTEXT, SAMPLE_CHALLENGE_TEXT } from '../data/sampleChallenge';

export default function UploadCard({ onAnalyze, isAnalyzing, serverStatus }) {
  const [inputMode, setInputMode] = useState('image'); // 'image' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [challengeText, setChallengeText] = useState('');
  const [contextText, setContextText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleLoadSampleChallenge = async () => {
    setErrorMsg(null);
    if (inputMode === 'image') {
      try {
        const res = await fetch('/sample-challenge.svg');
        const blob = await res.blob();
        const sampleFile = new File([blob], 'sample-challenge-brief.png', { type: 'image/png' });
        
        setSelectedFile(sampleFile);
        setPreviewUrl('/sample-challenge.svg');
        setContextText(SAMPLE_CHALLENGE_CONTEXT);
      } catch (e) {
        console.error('Failed to load sample challenge graphic:', e);
        setErrorMsg('Could not load sample challenge graphic.');
      }
    } else {
      setChallengeText(SAMPLE_CHALLENGE_TEXT);
      setContextText(SAMPLE_CHALLENGE_CONTEXT);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = (file) => {
    setErrorMsg(null);
    if (!file) return;

    // Validate type (PNG, JPEG, WEBP)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Unsupported format. Please upload a PNG, JPEG, or WEBP image.');
      return;
    }

    // Limit to 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg('File too large. Maximum supported image size is 10MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    if (previewUrl && !previewUrl.startsWith('/sample-challenge')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMode === 'image' && !selectedFile) return;
    if (inputMode === 'text' && !challengeText.trim()) return;

    if (onAnalyze) {
      onAnalyze({
        mode: inputMode,
        file: selectedFile,
        challengeText: challengeText.trim(),
        context: contextText.trim()
      });
    }
  };

  const isSubmitReady = inputMode === 'image' ? Boolean(selectedFile) : Boolean(challengeText.trim());

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Start with your challenge
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload a screenshot or paste your challenge to create a project plan.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleLoadSampleChallenge}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-blue-300 hover:text-blue-200 text-xs font-medium border border-blue-500/20 hover:border-blue-500/40 flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <PlayCircle className="h-3.5 w-3.5 text-blue-400" />
            <span>Load Sample Challenge</span>
          </button>
        </div>

        {/* Input Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-950/70 rounded-xl border border-slate-800/90 mb-6 max-w-md">
          <button
            type="button"
            onClick={() => setInputMode('image')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              inputMode === 'image'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Upload Screenshot</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              inputMode === 'text'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>Paste Challenge Text</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center space-x-2.5">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mode 1: Image Upload / Preview Area */}
        {inputMode === 'image' && (
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              id="challenge-screenshot-input"
              aria-label="Upload challenge screenshot"
            />

            {!selectedFile ? (
              /* Drag-and-drop zone */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10 scale-[0.99]'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/40'
                }`}
              >
                <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Drop your challenge screenshot here, or <span className="text-blue-400 underline underline-offset-2">browse</span>
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Supports PNG, JPG, or WEBP up to 10MB. Zero disk persistence for privacy.
                </p>
              </div>
            ) : (
              /* Selected Image Preview with Replace / Remove controls */
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 mb-4 gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</p>
                      <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)} • Ready for analysis</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Replace</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-300 text-xs font-medium border border-red-800/40 flex items-center space-x-1.5 transition"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Image Preview Box */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-900 flex items-center justify-center max-h-72">
                  <img 
                    src={previewUrl} 
                    alt="Challenge Preview" 
                    className="max-h-72 w-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Pasted Text Input Area */}
        {inputMode === 'text' && (
          <div className="space-y-2">
            <textarea
              id="challenge-text-input"
              rows={8}
              value={challengeText}
              onChange={(e) => setChallengeText(e.target.value)}
              placeholder="Paste your challenge statement, rules, judging rubrics, or requirements text here..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition font-mono leading-relaxed"
            />
            <div className="flex justify-between text-[11px] text-slate-500 px-1">
              <span>Text will be processed with strict grounding rules</span>
              <span>{challengeText.length} characters</span>
            </div>
          </div>
        )}

        {/* Optional Context Field */}
        <div className="mt-6">
          <label htmlFor="context-input" className="block text-xs font-semibold text-slate-400 mb-2">
            Optional Context or Constraints
          </label>
          <textarea
            id="context-input"
            rows={2}
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            placeholder="Team size, time limit, preferred technologies..."
            className="w-full bg-slate-950/60 border border-slate-800/90 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition resize-none"
          />
        </div>

        {/* Submit Action */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Processed in memory; zero disk persistence for privacy.</span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isSubmitReady || isAnalyzing}
            className={`w-full sm:w-auto min-w-[200px] px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-200 shadow-md ${
              !isSubmitReady 
                ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/40' 
                : isAnalyzing
                ? 'bg-blue-600/70 text-blue-100 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-500/35 active:scale-[0.99]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Analyzing your challenge...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-blue-200" />
                <span>Analyze Challenge</span>
                <ArrowRight className="h-4 w-4 ml-1 opacity-70" />
              </>
            )}
          </button>
        </div>

        {/* Clean status note if button is disabled */}
        {!isSubmitReady && !isAnalyzing && (
          <p className="text-center text-xs text-slate-500 mt-3 sm:text-right">
            {inputMode === 'image' 
              ? 'Upload a screenshot or click "Load Sample Challenge" to begin.' 
              : 'Paste challenge text above or click "Load Sample Challenge" to begin.'}
          </p>
        )}

      </div>
    </div>
  );
}
