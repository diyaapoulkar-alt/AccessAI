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
    { id: 'ocr', label: 'OCR Reader', icon: FileSearch, badge: 'Documents', color: 'text-emerald-400' },
    { id: 'alt-text', label: 'Alt-Text Evaluator', icon: ScanSearch, badge: 'AI Review', color: 'text-cyan-400' },
    { id: 'meeting', label: 'Live Captions', icon: Mic, badge: 'Deaf UX', color: 'text-indigo-400' },
    { id: 'cvd', label: 'CVD Simulator', icon: Eye, badge: 'Vision UX', color: 'text-amber-400' },
    { id: 'contrast', label: 'WCAG Contrast', icon: ShieldCheck, badge: 'Compliance', color: 'text-blue-400' },
    { id: 'extension', label: 'DOM Inspector', icon: Sliders, badge: 'Extension', color: 'text-purple-400' },
    { id: 'api', label: 'API Gateway', icon: Code, badge: 'Dev Sandbox', color: 'text-orange-400' },
  ];

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-2xl md:rounded-full p-2 shadow-lg shadow-stone-900/5 flex flex-col xl:flex-row items-center justify-between gap-2.5 transition-all duration-300">
        
        {/* Brand Logo & Author Tag */}
        <div 
          className="flex items-center gap-2.5 px-3 py-1 cursor-pointer group shrink-0" 
          onClick={() => setActiveTab('home')}
        >
          <div className="w-8 h-8 rounded-full bg-stone-900 flex items-center justify-center shadow-xs text-white group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-stone-900">
                AccessAI
              </h1>
              <span className="bg-amber-50 text-amber-900 border border-amber-200/80 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-700" /> Diya Poulkar Core
              </span>
            </div>
          </div>
        </div>

        {/* Top Features Bar (Pill Buttons) */}
        <div className="flex items-center gap-1 bg-stone-100/90 p-1 rounded-full border border-stone-200/80 overflow-x-auto max-w-full no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-stone-200/80 text-stone-700'
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
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 shadow-xs'
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
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 shadow-xs'
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
