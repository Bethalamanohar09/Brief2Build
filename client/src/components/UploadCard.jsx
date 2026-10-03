import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Sparkles, FileText, AlertCircle, ShieldCheck, PlayCircle } from 'lucide-react';
import { SAMPLE_CHALLENGE_CONTEXT } from '../data/sampleChallenge';

export default function UploadCard({ onAnalyze, isAnalyzing, serverStatus, onTrySampleDemo }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [contextText, setContextText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loadingStage, setLoadingStage] = useState(1);
  
  const fileInputRef = useRef(null);

  // Cycle loading steps during active analysis
  React.useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingStage(1);
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < 4 ? prev + 1 : prev));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleLoadSampleChallenge = async () => {
    try {
      setErrorMsg(null);
      const res = await fetch('/sample-challenge.png');
      const blob = await res.blob();
      const sampleFile = new File([blob], 'hacktoberfest-gemma-challenge.png', { type: 'image/png' });
      
      setSelectedFile(sampleFile);
      setPreviewUrl('/sample-challenge.svg');
      setContextText(SAMPLE_CHALLENGE_CONTEXT);
    } catch (e) {
      console.error('Failed to load sample challenge:', e);
      setErrorMsg('Could not load sample challenge graphic.');
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

    // Validate type (PNG, JPEG, WEBP, SVG)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
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

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    if (onAnalyze) {
      onAnalyze({ file: selectedFile, context: contextText });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-950/50 backdrop-blur-sm">
        
        {/* Card Header with Sample Challenge Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800/80 mb-6 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Upload Challenge Screenshot</h2>
              <p className="text-xs text-slate-400">Supported formats: PNG, JPG, JPEG, WEBP (Max 10MB)</p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleLoadSampleChallenge}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-300 text-xs font-medium border border-indigo-700/60 flex items-center space-x-1.5 transition"
            title="Load the official Hack Day 2026 Gemma 4 sample brief"
          >
            <PlayCircle className="h-3.5 w-3.5 text-indigo-400" />
            <span>Load Sample Challenge</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-red-200 text-xs flex items-center space-x-2.5">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Hidden native input */}
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

        {/* Upload Zone / Preview Area */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleTriggerBrowse}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all duration-200 ${
              isDragging 
                ? 'border-blue-500 bg-blue-950/20 scale-[0.99]' 
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/60'
            }`}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTriggerBrowse();
              }
            }}
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-4 group-hover:text-slate-200">
              <ImageIcon className="h-7 w-7 text-blue-400" />
            </div>
            <p className="text-base font-medium text-slate-200 mb-1">
              Drag & drop your challenge screenshot here
            </p>
            <p className="text-xs text-slate-400 mb-4">
              or click anywhere to browse from your device
            </p>
            <button
              type="button"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-600 transition"
              onClick={(e) => {
                e.stopPropagation();
                handleTriggerBrowse();
              }}
            >
              <span>Browse files</span>
            </button>
          </div>
        ) : (
          /* Preview State */
          <div className="border border-slate-700/80 bg-slate-950/60 rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="h-10 w-10 rounded-lg bg-blue-950/60 border border-blue-800/50 flex items-center justify-center shrink-0">
                  <ImageIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-200 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type.replace('image/', '').toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleTriggerBrowse}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition"
                  title="Replace with another image"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-medium border border-red-800/40 flex items-center space-x-1.5 transition"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="mt-4 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center max-h-72">
              <img 
                src={previewUrl} 
                alt="Challenge Statement Preview" 
                className="max-h-72 w-auto object-contain mx-auto"
              />
            </div>
          </div>
        )}

        {/* Optional Context Field */}
        <div className="mt-6">
          <label htmlFor="context-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Optional Context or Question
          </label>
          <div className="relative">
            <textarea
              id="context-input"
              rows={3}
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              placeholder="e.g. Target hackathon duration: 24h. We have 3 developers (1 frontend, 1 backend, 1 ML). Emphasize novelty and working demo for judging."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition resize-none font-sans"
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Add team constraints, time limits, judging focus, or specific questions.
          </p>
        </div>

        {/* Submit Action */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Image processed in memory; no permanent server storage.</span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isAnalyzing}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
              !selectedFile 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40' 
                : isAnalyzing
                ? 'bg-blue-600/50 text-blue-200 cursor-wait'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.98]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-300" />
                <span>Running Gemma 4 Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Analyze with Gemma 4</span>
              </>
            )}
          </button>
        </div>

        {/* Multi-stage Progress Indicator when analyzing */}
        {isAnalyzing && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-blue-900/60 text-xs space-y-2.5 animate-pulse">
            <div className="flex items-center justify-between text-blue-400 font-medium">
              <span>Gemma 4 Analysis Pipeline</span>
              <span className="font-mono">Stage {loadingStage} of 4</span>
            </div>
            
            <div className="space-y-1.5 text-slate-400">
              <div className={`flex items-center space-x-2 ${loadingStage >= 1 ? 'text-blue-300 font-semibold' : 'opacity-40'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${loadingStage >= 1 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                <span>1. Validating in-memory image buffer & MIME headers</span>
              </div>
              <div className={`flex items-center space-x-2 ${loadingStage >= 2 ? 'text-blue-300 font-semibold' : 'opacity-40'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${loadingStage >= 2 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                <span>2. Sending multimodal payload to Gemma 4 via Gemini API</span>
              </div>
              <div className={`flex items-center space-x-2 ${loadingStage >= 3 ? 'text-blue-300 font-semibold' : 'opacity-40'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${loadingStage >= 3 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                <span>3. Extracting visual facts with citations & separating AI suggestions</span>
              </div>
              <div className={`flex items-center space-x-2 ${loadingStage >= 4 ? 'text-blue-300 font-semibold' : 'opacity-40'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${loadingStage >= 4 ? 'bg-blue-400' : 'bg-slate-700'}`} />
                <span>4. Constructing editable MVP scope, tech stack & checklist</span>
              </div>
            </div>
          </div>
        )}

        {/* Helper status if button is disabled */}
        {!selectedFile && !isAnalyzing && (
          <p className="text-center text-xs text-slate-500 mt-3 sm:text-right">
            Upload a screenshot or click "Load Sample Challenge" to test.
          </p>
        )}

      </div>
    </div>
  );
}
