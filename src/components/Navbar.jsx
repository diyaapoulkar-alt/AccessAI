import React from 'react';
import { 
  ShieldCheck, 
  Mic, 
  Code, 
  Sparkles, 
  Sliders, 
  Eye,
  Home,
  FileSearch,
  ScanSearch
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  highContrast, 
  setHighContrast, 
  dyslexiaFont, 
  setDyslexiaFont 
}) {
  const navTabs = [
    { id: 'home', label: 'Home', icon: Home, badge: 'Overview', color: 'text-amber-400' },
    { id: 'ocr', label: 'Vision OCR Reader', icon: FileSearch, badge: 'Documents', color: 'text-emerald-400' },
    { id: 'alt-text', label: 'Alt-Text Evaluator', icon: ScanSearch, badge: 'AI Review', color: 'text-cyan-400' },
    { id: 'meeting', label: 'Live Meet Captions', icon: Mic, badge: 'Deaf UX', color: 'text-indigo-400' },
    { id: 'cvd', label: 'CVD Simulator', icon: Eye, badge: 'Vision UX', color: 'text-amber-400' },
    { id: 'contrast', label: 'WCAG Contrast', icon: ShieldCheck, badge: 'Compliance', color: 'text-blue-400' },
    { id: 'extension', label: 'DOM Inspector', icon: Sliders, badge: 'Extension', color: 'text-purple-400' },
    { id: 'api', label: 'API Gateway', icon: Code, badge: 'Dev Sandbox', color: 'text-orange-400' },
  ];

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="bg-stone-950/90 backdrop-blur-2xl border border-stone-800 rounded-2xl md:rounded-full p-2 shadow-2xl shadow-black/40 flex flex-col xl:flex-row items-center justify-between gap-3 transition-all duration-300">
        
        {/* Brand Logo with Stylish Geometric 'A' Icon */}
        <div 
          className="flex items-center gap-2.5 px-3 py-1 cursor-pointer group shrink-0" 
          onClick={() => setActiveTab('home')}
        >
          {/* Stylish Geometric 'A' Logo Badge */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-0.5 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <svg 
                viewBox="0 0 100 100" 
                className="w-5 h-5 text-yellow-400 fill-current"
              >
                <path d="M50 12 L85 85 L66 85 L50 48 L34 85 L15 85 Z M50 28 L38 58 L62 58 Z" />
                <rect x="30" y="52" width="40" height="6" rx="3" fill="#FACC15" />
              </svg>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-lg tracking-tight text-white">
                Access<span className="text-yellow-400">AI</span>
              </h1>
              <span className="bg-amber-950/80 text-amber-300 border border-amber-600/40 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Platform
              </span>
            </div>
          </div>
        </div>

        {/* Top Dashbar Features Navigation */}
        <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-full border border-stone-800 overflow-x-auto max-w-full no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : tab.color}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-800 text-stone-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Accessibility Quick Toggles */}
        <div className="flex items-center gap-1.5 px-1 shrink-0">
          <button
            onClick={() => setHighContrast(!highContrast)}
            title="Toggle High Contrast Yellow-Black Mode"
            className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 transition-all duration-200 ${
              highContrast
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-xs ring-2 ring-yellow-400/40'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 shadow-xs'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>{highContrast ? 'Yellow-Black' : 'High Contrast'}</span>
          </button>

          <button
            onClick={() => setDyslexiaFont(!dyslexiaFont)}
            title="Toggle OpenDyslexic Typography"
            className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 transition-all duration-200 ${
              dyslexiaFont
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-2 ring-indigo-600/40'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 shadow-xs'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{dyslexiaFont ? 'Atkinson' : 'OpenDyslexic'}</span>
          </button>
        </div>

      </nav>
    </header>
  );
}
