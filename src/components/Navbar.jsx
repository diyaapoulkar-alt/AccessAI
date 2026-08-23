import React from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Mic, 
  Code, 
  FileText, 
  Zap, 
  Sun, 
  Moon, 
  Sparkles,
  Volume2,
  Sliders
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  highContrast, 
  setHighContrast, 
  dyslexiaFont, 
  setDyslexiaFont 
}) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 text-white px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('scanner')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AccessAI
              </h1>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Vision & Audio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Meaningful Web Accessibility & Inclusive Real-Time Platform
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>AI Web Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'vision'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-300" />
            <span className="flex items-center gap-1">
              Vision Loud Reader
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-semibold">Blind UX</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('meeting')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'meeting'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-4 h-4 text-purple-300" />
            <span>Live Captions</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'api'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Developer API</span>
          </button>

          <button
            onClick={() => setActiveTab('presentation')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'presentation'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Gamma PPT & Docs</span>
          </button>
        </nav>

        {/* Accessibility Quick Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Toggle High Contrast Yellow-Black Mode for Low Vision"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-300 shadow-md shadow-yellow-400/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{highContrast ? 'Yellow-Black Mode' : 'High Contrast'}</span>
          </button>

          <button
            onClick={() => setDyslexiaFont(!dyslexiaFont)}
            title="Toggle Dyslexic Accessible Font"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              dyslexiaFont
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{dyslexiaFont ? 'Atkinson Font' : 'OpenDyslexic'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
