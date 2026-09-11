import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Homepage from './components/Home/Homepage';
import VisionLoudReader from './components/VisionReader/VisionLoudReader';
import MeetingRoom from './components/Meeting/MeetingRoom';
import CvdView from './components/Cvd/CvdView';
import ContrastView from './components/Contrast/ContrastView';
import ExtensionInspectorView from './components/Extension/ExtensionInspectorView';
import ApiPlayground from './components/ApiSandbox/ApiPlayground';
import ExtensionSimulator from './extension/ExtensionSimulator';
import MeetExtensionWidget from './extension/MeetExtensionWidget';
import { AccessibilityProvider } from './accessibility-theme/AccessibilityContext';
import { ShieldCheck, Sparkles } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#faf9f5] text-stone-900 selection:bg-amber-200 selection:text-amber-950 relative overflow-x-hidden">
      
      {/* Background Soft Glow Spots matching Diya's Portfolio */}
      <div className="fixed top-12 left-1/4 w-[600px] h-[600px] bg-amber-200/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-float" />
      <div className="fixed bottom-12 right-1/4 w-[600px] h-[600px] bg-amber-100/30 blur-[120px] rounded-full pointer-events-none -z-10 animate-float" style={{ animationDelay: '2.5s' }} />

      {/* Floating Pill Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        dyslexiaFont={dyslexiaFont}
        setDyslexiaFont={setDyslexiaFont}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-20 pt-4">
        {activeTab === 'home' && <Homepage setActiveTab={setActiveTab} />}
        {activeTab === 'vision' && <VisionLoudReader />}
        {activeTab === 'meeting' && (
          <MeetingRoom
            highContrast={highContrast}
            setHighContrast={setHighContrast}
            dyslexiaFont={dyslexiaFont}
            setDyslexiaFont={setDyslexiaFont}
          />
        )}
        {activeTab === 'cvd' && <CvdView />}
        {activeTab === 'contrast' && <ContrastView />}
        {activeTab === 'extension' && <ExtensionInspectorView />}
        {activeTab === 'api' && <ApiPlayground />}
      </main>

      {/* Floating Chrome Extension Audit Widget Overlay & Google Meet Right-Corner Extension Dock */}
      <ExtensionSimulator />
      <MeetExtensionWidget />

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="font-extrabold text-stone-950">AccessAI Platform</span>
            <span className="text-stone-500 font-medium">· Next-Gen Web Accessibility Suite</span>
          </div>
          <p className="flex items-center gap-1.5 font-bold text-stone-700">
            <Sparkles className="w-4 h-4 text-amber-700" /> WCAG 2.1 / 2.2 AA Compliant Assistive Ecosystem
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}


