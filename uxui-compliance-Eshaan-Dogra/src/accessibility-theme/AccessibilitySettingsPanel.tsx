/**
 * Accessibility Settings Panel UI Component (Drake Theme)
 * AccessAI - UX/UI & Compliance Suite
 */

import React from 'react';
import {
  Sun,
  Moon,
  Zap,
  Type,
  Maximize2,
  AlignLeft,
  RotateCcw,
  Sliders,
  MousePointer,
  Link,
  EyeOff
} from 'lucide-react';
import { useAccessibility } from './useAccessibility';
import { ThemeMode, TextScale, LineSpacing } from './types';

export interface AccessibilitySettingsPanelProps {
  className?: string;
  onClose?: () => void;
}

export const AccessibilitySettingsPanel: React.FC<AccessibilitySettingsPanelProps> = ({
  className = '',
  onClose
}) => {
  const {
    preferences,
    setTheme,
    setFontFamily,
    setTextScale,
    setLineSpacing,
    setReduceMotion,
    setHighContrastFocusRings,
    setUnderlineLinks,
    resetPreferences,
    isHighContrast,
    isOpenDyslexic
  } = useAccessibility();

  const themeOptions: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'dark',
      label: 'Drake Obsidian Theme',
      icon: <Moon className="w-4 h-4 text-[#28e98c]" />,
      desc: 'Dark obsidian background with electric emerald highlights'
    },
    {
      id: 'light',
      label: 'Clean Minimal Light',
      icon: <Sun className="w-4 h-4 text-amber-400" />,
      desc: 'High-clarity paper white interface'
    },
    {
      id: 'high-contrast-yellow',
      label: 'High Contrast Yellow/Black',
      icon: <Zap className="w-4 h-4 text-yellow-400" />,
      desc: 'Safety yellow #FFFF00 on pitch black (19.5:1 ratio)'
    },
    {
      id: 'high-contrast-white',
      label: 'High Contrast White/Black',
      icon: <Maximize2 className="w-4 h-4 text-slate-300" />,
      desc: 'Solid black on pure white (21:1 ratio)'
    },
  ];

  const scaleOptions: { id: TextScale; label: string }[] = [
    { id: '100', label: '100% Default' },
    { id: '115', label: '115% Large' },
    { id: '130', label: '130% X-Large' },
    { id: '150', label: '150% Max' },
  ];

  const spacingOptions: { id: LineSpacing; label: string; desc: string }[] = [
    { id: 'normal', label: '1.5 Normal', desc: 'Standard line height' },
    { id: 'relaxed', label: '1.8 Relaxed', desc: 'Increased line spacing' },
    { id: 'loose', label: '2.1 Loose', desc: 'Maximum line spacing' },
  ];

  return (
    <div className={`bg-[#0f0f0f]/95 border border-[#262626] rounded-[32px] p-6 sm:p-8 text-slate-100 space-y-6 shadow-2xl backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#171717] border border-[#2e2e2e] text-[#28e98c]">
            <Sliders className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">Accessibility & Theme System</h3>
            <p className="text-xs text-slate-400">Perceptual contrast, cognitive font aids, and visual adaptations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetPreferences}
            className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#171717] hover:bg-[#262626] border border-[#2e2e2e] rounded-full transition-colors"
            title="Reset preferences to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-black uppercase tracking-wider text-black bg-[#28e98c] hover:bg-[#20c978] rounded-full shadow-md transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* 1. Theme Selection */}
      <section aria-labelledby="theme-section-title" className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 id="theme-section-title" className="text-xs font-black uppercase tracking-widest text-slate-200">
            Color Themes & High Contrast
          </h4>
          {isHighContrast && (
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-yellow-400 text-black">
              High Contrast Active
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              aria-pressed={preferences.theme === opt.id}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                preferences.theme === opt.id
                  ? 'bg-[#171717] border-[#28e98c] ring-2 ring-[#28e98c]/30 shadow-[0_0_20px_rgba(40,233,140,0.15)]'
                  : 'bg-[#141414] border-[#262626] text-slate-300 hover:border-slate-500 hover:bg-[#1c1c1c]'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[#0d0d0d] border border-[#2b2b2b] flex-shrink-0 mt-0.5">
                {opt.icon}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider block text-white">{opt.label}</span>
                <span className="text-[11px] block mt-0.5 text-slate-400">
                  {opt.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. OpenDyslexic Font */}
      <section aria-labelledby="font-section-title" className="space-y-3 pt-3 border-t border-[#262626]">
        <div className="flex items-center justify-between">
          <div>
            <h4 id="font-section-title" className="text-xs font-black uppercase tracking-widest text-slate-200 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-[#28e98c]" />
              <span>Dyslexia-Friendly Typography (OpenDyslexic)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Bottom-weighted letterforms to minimize letter inversion and visual crowding.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-label="Toggle OpenDyslexic Font"
            aria-checked={isOpenDyslexic}
            onClick={() => setFontFamily(isOpenDyslexic ? 'default' : 'opendyslexic')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#28e98c] ${
              isOpenDyslexic ? 'bg-[#28e98c]' : 'bg-[#2e2e2e]'
            }`}
          >
            <span className="sr-only">Toggle OpenDyslexic Font</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow transition duration-200 ease-in-out ${
                isOpenDyslexic ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Live Font Sample */}
        <div
          className={`p-4 bg-[#141414] border border-[#262626] rounded-2xl text-xs leading-relaxed ${
            isOpenDyslexic ? 'font-opendyslexic text-[#28e98c]' : 'text-slate-200'
          }`}
        >
          <span className="font-bold text-[10px] text-[#28e98c] uppercase tracking-wider block mb-0.5">
            {isOpenDyslexic ? 'OpenDyslexic Typography Enabled:' : 'Standard System Font:'}
          </span>
          "The quick brown fox jumps over the lazy dog. 1234567890."
        </div>
      </section>

      {/* 3. Text Scale & Line Spacing */}
      <section aria-labelledby="scale-section-title" className="space-y-3.5 pt-3 border-t border-[#262626]">
        <h4 id="scale-section-title" className="text-xs font-black uppercase tracking-widest text-slate-200">
          Text Sizing & Line Spacing
        </h4>

        {/* Scale */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-bold uppercase">Text Scale:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {scaleOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTextScale(opt.id)}
                aria-pressed={preferences.textScale === opt.id}
                className={`py-2.5 px-2 text-xs font-bold rounded-2xl border text-center transition-colors ${
                  preferences.textScale === opt.id
                    ? 'bg-[#28e98c] text-black border-[#28e98c] font-black shadow-md'
                    : 'bg-[#141414] border-[#262626] text-slate-300 hover:border-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Line Spacing */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Line Spacing (WCAG 1.4.12):</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {spacingOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLineSpacing(opt.id)}
                aria-pressed={preferences.lineSpacing === opt.id}
                className={`py-2.5 px-3.5 text-xs font-bold rounded-2xl border text-left transition-colors ${
                  preferences.lineSpacing === opt.id
                    ? 'bg-[#28e98c] text-black border-[#28e98c] font-black shadow-md'
                    : 'bg-[#141414] border-[#262626] text-slate-300 hover:border-slate-500'
                }`}
              >
                <div>{opt.label}</div>
                <div className="text-[10px] opacity-75">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Cognitive & Focus Enhancements */}
      <section aria-labelledby="aids-section-title" className="space-y-2.5 pt-3 border-t border-[#262626]">
        <h4 id="aids-section-title" className="text-xs font-black uppercase tracking-widest text-slate-200">
          Navigation & Accessibility Enhancements
        </h4>

        <div className="space-y-2.5">
          <label className="flex items-center justify-between p-3.5 bg-[#141414] border border-[#262626] rounded-2xl cursor-pointer hover:border-slate-500">
            <div className="flex items-center gap-2.5">
              <MousePointer className="w-4 h-4 text-[#28e98c]" />
              <div>
                <span className="text-xs font-bold text-white block">High-Visibility Focus Indicators</span>
                <span className="text-[11px] text-slate-400 block">Thick 3px solid focus rings (WCAG 2.4.7 / 2.4.11)</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.highContrastFocusRings}
              onChange={(e) => setHighContrastFocusRings(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-black text-[#28e98c] focus:ring-[#28e98c]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#141414] border border-[#262626] rounded-2xl cursor-pointer hover:border-slate-500">
            <div className="flex items-center gap-2.5">
              <Link className="w-4 h-4 text-[#28e98c]" />
              <div>
                <span className="text-xs font-bold text-white block">Always Underline Hyperlinks</span>
                <span className="text-[11px] text-slate-400 block">Identifies links without relying solely on color (WCAG 1.4.1)</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.underlineLinks}
              onChange={(e) => setUnderlineLinks(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-black text-[#28e98c] focus:ring-[#28e98c]"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-[#141414] border border-[#262626] rounded-2xl cursor-pointer hover:border-slate-500">
            <div className="flex items-center gap-2.5">
              <EyeOff className="w-4 h-4 text-[#28e98c]" />
              <div>
                <span className="text-xs font-bold text-white block">Reduced Motion</span>
                <span className="text-[11px] text-slate-400 block">Suppresses UI transitions and animations (WCAG 2.3.3)</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.reduceMotion}
              onChange={(e) => setReduceMotion(e.target.checked)}
              className="w-4 h-4 rounded border-slate-600 bg-black text-[#28e98c] focus:ring-[#28e98c]"
            />
          </label>
        </div>
      </section>
    </div>
  );
};
