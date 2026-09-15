import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  const [stage, setStage] = useState('entering'); // entering -> visible -> exiting -> hidden

  useEffect(() => {
    // Check if intro has already been shown in this session
    const hasSeenIntro = sessionStorage.getItem('accessai_intro_seen');
    if (hasSeenIntro) {
      if (onComplete) onComplete();
      return;
    }

    const timer1 = setTimeout(() => {
      setStage('visible');
    }, 100);

    const timer2 = setTimeout(() => {
      handleClose();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleClose = () => {
    setStage('exiting');
    sessionStorage.setItem('accessai_intro_seen', 'true');
    setTimeout(() => {
      setStage('hidden');
      if (onComplete) onComplete();
    }, 700);
  };

  if (stage === 'hidden') return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100000] bg-stone-950 text-white flex items-center justify-center cursor-pointer select-none transition-all duration-700 ease-out ${
        stage === 'exiting' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Soft Glow & Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Brand Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-6">
        
        {/* Stylish Animated 'A' Logo */}
        <div className={`relative transition-all duration-1000 transform ${
          stage === 'visible' ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-90'
        }`}>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black border-2 border-amber-400/60 shadow-[0_0_50px_rgba(250,204,21,0.25)] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-amber-300/10 opacity-60" />
            
            {/* Custom Stylish Geometric 'A' Logo SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-400 fill-current drop-shadow-[0_0_12px_rgba(250,204,21,0.6)]"
            >
              {/* Outer Stylized 'A' Frame */}
              <path d="M50 12 L85 85 L66 85 L50 48 L34 85 L15 85 Z M50 28 L38 58 L62 58 Z" />
              {/* Glowing Accent Crossbar */}
              <rect x="30" y="52" width="40" height="6" rx="3" fill="#FACC15" className="animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className={`space-y-2 transition-all duration-1000 delay-200 transform ${
          stage === 'visible' ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
              Access<span className="text-yellow-400">AI</span>
            </h1>
          </div>

          <p className="text-stone-400 text-xs sm:text-sm font-mono tracking-widest uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen Accessible Intelligence</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </p>
        </div>

        {/* Enter Prompt */}
        <div className={`pt-4 transition-all duration-1000 delay-500 transform ${
          stage === 'visible' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <button 
            onClick={handleClose}
            className="px-5 py-2.5 rounded-full bg-stone-900 border border-stone-700 hover:border-amber-400 text-stone-300 hover:text-white text-xs font-bold transition duration-300 flex items-center gap-2 group shadow-lg"
          >
            <span>Click or wait to enter</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
