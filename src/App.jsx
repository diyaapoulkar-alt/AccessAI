import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ScannerDashboard from './components/Scanner/ScannerDashboard';
import VisionLoudReader from './components/VisionReader/VisionLoudReader';
import MeetingRoom from './components/Meeting/MeetingRoom';
import ApiPlayground from './components/ApiSandbox/ApiPlayground';
import GammaPromptGenerator from './components/Presentation/GammaPromptGenerator';
import { ShieldCheck, Puzzle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [showExtension, setShowExtension] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }

    if (dyslexiaFont) {
      document.documentElement.classList.add('dyslexia-font');
    } else {
      document.documentElement.classList.remove('dyslexia-font');
    }
  }, [highContrast, dyslexiaFont]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        dyslexiaFont={dyslexiaFont}
        setDyslexiaFont={setDyslexiaFont}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'scanner' && <ScannerDashboard />}
        {activeTab === 'vision' && <VisionLoudReader />}
        {activeTab === 'meeting' && (
          <MeetingRoom
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            dyslexiaFont={dyslexiaFont}
            setDyslexiaFont={setDyslexiaFont}
          />
        )}
        {activeTab === 'api' && <ApiPlayground />}
        {activeTab === 'presentation' && <GammaPromptGenerator />}
      </main>

      {/* Floating Browser Extension Simulator Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {!showExtension ? (
          <button
            onClick={() => setShowExtension(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-blue-400/40 text-xs transition-all transform hover:scale-105"
          >
            <Puzzle className="w-4 h-4" />
            <span>Simulate Extension</span>
          </button>
        ) : (
          <div className="glass-card p-4 w-72 bg-slate-950/95 border-blue-500/50 shadow-2xl rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> AccessAI Chrome Ext
              </span>
              <button
                onClick={() => setShowExtension(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>DOM Audit Status:</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span>Meaningful Score:</span>
                <span className="text-blue-400 font-bold">78/100</span>
              </div>
              <div className="flex justify-between">
                <span>Vision Reader:</span>
                <span className="text-emerald-400 font-semibold">READY</span>
              </div>
            </div>
            <button
              onClick={() => { setActiveTab('scanner'); setShowExtension(false); }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-lg"
            >
              Open Full Audit Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-slate-300">AccessAI Platform</span>
            <span>- Meaningful Accessibility & Inclusive Real-Time Tools</span>
          </div>
          <p>© 2026 AccessAI Inc. WCAG 2.1 & 2.2 AA Compliant. Built for Google Antigravity.</p>
        </div>
      </footer>

    </div>
  );
}
