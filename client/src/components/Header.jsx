import React, { useState } from 'react';
import { Layers, HelpCircle, Menu, X, ArrowUpRight, Github } from 'lucide-react';

export default function Header({ serverStatus, onOpenHowItWorks, onNavigateHome }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-[#070B14]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <button 
          onClick={onNavigateHome}
          className="flex items-center space-x-3 text-left group transition focus:outline-none"
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-200">
            <Layers className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-bold text-lg text-white tracking-tight group-hover:text-blue-200 transition-colors">
              Brief2Build
            </span>
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/25 tracking-wide">
              AI
            </span>
          </div>
        </button>

        {/* Right: Clean Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
          >
            Workspace
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition flex items-center space-x-1.5"
          >
            <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>How it works</span>
          </button>

          <a
            href="https://github.com/Bethalamanohar09/Brief2Build"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition flex items-center space-x-1.5"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
            <ArrowUpRight className="h-3 w-3 opacity-60" />
          </a>

          {/* Clean API Status Pill */}
          <div className="ml-2 pl-3 border-l border-slate-800 flex items-center">
            <div className="flex items-center space-x-2 text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <span className={`inline-block h-2 w-2 rounded-full ${
                serverStatus === 'online' 
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' 
                  : serverStatus === 'offline' 
                  ? 'bg-red-400' 
                  : 'bg-amber-400 animate-pulse'
              }`} />
              <span>{serverStatus === 'online' ? 'System Online' : 'Connecting...'}</span>
            </div>
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${
              serverStatus === 'online' ? 'bg-emerald-400' : 'bg-amber-400'
            }`} />
            <span>{serverStatus === 'online' ? 'Online' : '...'}</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B101E] px-4 py-3 space-y-1">
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg transition"
          >
            Workspace
          </button>
          <button
            onClick={() => {
              onOpenHowItWorks();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg transition flex items-center space-x-2"
          >
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span>How it works</span>
          </button>
          <a
            href="https://github.com/Bethalamanohar09/Brief2Build"
            target="_blank"
            rel="noreferrer"
            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 rounded-lg transition flex items-center space-x-2"
          >
            <Github className="h-4 w-4 text-slate-400" />
            <span>GitHub Repository</span>
          </a>
        </div>
      )}
    </header>
  );
}
