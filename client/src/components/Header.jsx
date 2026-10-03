import React from 'react';
import { Layers, Activity, Sparkles } from 'lucide-react';

export default function Header({ serverStatus }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">Brief2Build</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">Powered by Gemma 4</p>
          </div>
        </div>

        {/* Center Badge: Hackathon category */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Hacktoberfest Hack Day 2026</span>
          <span className="text-slate-500">•</span>
          <span className="text-blue-400 font-medium">Best Use of Gemma 4</span>
        </div>

        {/* Server & Status Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60">
            <span className={`inline-block h-2 w-2 rounded-full ${
              serverStatus === 'online' 
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' 
                : serverStatus === 'offline' 
                ? 'bg-red-400' 
                : 'bg-amber-400'
            }`} />
            <span className="text-slate-300">
              {serverStatus === 'online' ? 'API Ready' : serverStatus === 'offline' ? 'API Offline' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
