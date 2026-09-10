/**
 * WCAG Contrast Ratio Checker UI Card (Drake Theme)
 * AccessAI - UX/UI & Compliance Suite
 */

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Check, X, ShieldCheck } from 'lucide-react';
import { evaluateContrast } from './wcag-math';
import { ContrastScore } from './types';

export interface ContrastCheckerCardProps {
  initialForeground?: string;
  initialBackground?: string;
  onScoreChange?: (score: ContrastScore) => void;
  className?: string;
}

const PRESET_PAIRS = [
  { label: 'High Contrast (Dark)', fg: '#FFFFFF', bg: '#0A0A0A' },
  { label: 'High Contrast (Light)', fg: '#121212', bg: '#FFFFFF' },
  { label: 'Yellow on Black', fg: '#FFFF00', bg: '#000000' },
  { label: 'Drake Emerald on Obsidian', fg: '#28E98C', bg: '#0D0D0D' },
  { label: 'Subtle Fail Case', fg: '#94A3B8', bg: '#CBD5E1' },
];

export const ContrastCheckerCard: React.FC<ContrastCheckerCardProps> = ({
  initialForeground = '#28E98C',
  initialBackground = '#0D0D0D',
  onScoreChange,
  className = ''
}) => {
  const [fgInput, setFgInput] = useState(initialForeground);
  const [bgInput, setBgInput] = useState(initialBackground);

  const score = useMemo(() => {
    const result = evaluateContrast(fgInput, bgInput);
    if (onScoreChange) {
      onScoreChange(result);
    }
    return result;
  }, [fgInput, bgInput, onScoreChange]);

  const handleSwap = () => {
    const temp = fgInput;
    setFgInput(bgInput);
    setBgInput(temp);
  };

  return (
    <div className={`bg-[#0f0f0f]/90 border border-[#262626] rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl backdrop-blur-md ${className}`}>
      {/* Header with Contrast Readout */}
      <div className="flex flex-wrap items-center justify-between pb-5 border-b border-[#262626] gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#171717] border border-[#2e2e2e] text-[#28e98c]">
            <ShieldCheck className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">WCAG 2.1 / 2.2 AA & AAA Contrast Engine</h3>
            <p className="text-xs text-slate-400">Exact relative luminance conversion and real-time pass/fail evaluation</p>
          </div>
        </div>

        {/* Primary Metric Display */}
        <div className="flex items-center gap-3.5 bg-[#171717] px-5 py-2.5 rounded-2xl border border-[#2e2e2e] shadow-inner">
          <div className="text-right">
            <div className={`text-3xl font-black font-mono tracking-tight ${
              score.normalText.passesAA ? 'text-[#28e98c]' : 'text-rose-400'
            }`}>
              {score.formattedRatio}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {score.normalText.passesAAA ? 'WCAG AAA Level' : score.normalText.passesAA ? 'WCAG AA Level' : 'Below AA Threshold'}
            </div>
          </div>
          <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
            score.normalText.passesAA ? 'bg-[#28e98c] shadow-[0_0_12px_#28e98c]' : 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
          }`} />
        </div>
      </div>

      {/* Color Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
        {/* Foreground Input */}
        <div className="bg-[#171717] border border-[#2b2b2b] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="fg-color-input" className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Foreground (Text / Icon)
            </label>
            <span className="font-mono text-xs text-[#28e98c] font-bold">{score.fgHex}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              id="fg-color-picker"
              value={score.fgHex.length === 7 ? score.fgHex : '#FFFFFF'}
              onChange={(e) => setFgInput(e.target.value)}
              className="w-10 h-10 rounded-xl border border-[#383838] bg-transparent cursor-pointer"
              aria-label="Foreground color picker"
            />
            <input
              type="text"
              id="fg-color-input"
              value={fgInput}
              onChange={(e) => setFgInput(e.target.value)}
              placeholder="#FFFFFF"
              className="flex-1 bg-[#0a0a0a] border border-[#333333] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#28e98c]"
            />
          </div>
        </div>

        {/* Background Input */}
        <div className="bg-[#171717] border border-[#2b2b2b] rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="bg-color-input" className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Background (Surface)
            </label>
            <span className="font-mono text-xs text-[#28e98c] font-bold">{score.bgHex}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              id="bg-color-picker"
              value={score.bgHex.length === 7 ? score.bgHex : '#000000'}
              onChange={(e) => setBgInput(e.target.value)}
              className="w-10 h-10 rounded-xl border border-[#383838] bg-transparent cursor-pointer"
              aria-label="Background color picker"
            />
            <input
              type="text"
              id="bg-color-input"
              value={bgInput}
              onChange={(e) => setBgInput(e.target.value)}
              placeholder="#0D0D0D"
              className="flex-1 bg-[#0a0a0a] border border-[#333333] rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#28e98c]"
            />
          </div>
        </div>
      </div>

      {/* Quick Swap & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <button
          type="button"
          onClick={handleSwap}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-200 hover:text-black hover:bg-[#28e98c] bg-[#171717] border border-[#333333] hover:border-[#28e98c] rounded-full transition-all shadow-sm"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Swap Colors</span>
        </button>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-bold uppercase mr-1">Presets:</span>
          {PRESET_PAIRS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setFgInput(preset.fg);
                setBgInput(preset.bg);
              }}
              className="px-3 py-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-[#171717] hover:bg-[#262626] border border-[#2b2b2b] rounded-full transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* WCAG Compliance Criteria Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* 1. Normal Text */}
        <div className="bg-[#171717] border border-[#2b2b2b] rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">Normal Body Text</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                score.normalText.passesAA
                  ? 'bg-[#28e98c]/15 text-[#28e98c] border-[#28e98c]/40'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
              }`}>
                {score.normalText.passesAAA ? 'PASS AAA' : score.normalText.passesAA ? 'PASS AA' : 'FAIL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">Text &lt; 18pt (24px) or bold &lt; 14pt (18.5px)</p>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
            {score.normalText.passesAA ? (
              <Check className="w-3.5 h-3.5 text-[#28e98c]" />
            ) : (
              <X className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>Min 4.5:1 (AA) · 7.0:1 (AAA)</span>
          </div>
        </div>

        {/* 2. Large Text */}
        <div className="bg-[#171717] border border-[#2b2b2b] rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">Large Heading Text</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                score.largeText.passesAA
                  ? 'bg-[#28e98c]/15 text-[#28e98c] border-[#28e98c]/40'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
              }`}>
                {score.largeText.passesAAA ? 'PASS AAA' : score.largeText.passesAA ? 'PASS AA' : 'FAIL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">Headings ≥ 18pt (24px) or bold ≥ 14pt (18.5px)</p>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
            {score.largeText.passesAA ? (
              <Check className="w-3.5 h-3.5 text-[#28e98c]" />
            ) : (
              <X className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>Min 3.0:1 (AA) · 4.5:1 (AAA)</span>
          </div>
        </div>

        {/* 3. Non-text UI Controls */}
        <div className="bg-[#171717] border border-[#2b2b2b] rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-white">UI Controls & Borders</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full border ${
                score.uiComponents.passesAA
                  ? 'bg-[#28e98c]/15 text-[#28e98c] border-[#28e98c]/40'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/40'
              }`}>
                {score.uiComponents.passesAA ? 'PASS AA' : 'FAIL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">Focus rings, input borders (SC 1.4.11)</p>
          </div>
          <div className="mt-3 text-[10px] text-slate-400 flex items-center gap-1">
            {score.uiComponents.passesAA ? (
              <Check className="w-3.5 h-3.5 text-[#28e98c]" />
            ) : (
              <X className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>Min 3.0:1 (WCAG 2.1)</span>
          </div>
        </div>
      </div>

      {/* Live Visual Sandbox */}
      <div
        className="rounded-2xl border p-6 transition-all duration-150 shadow-inner"
        style={{
          backgroundColor: score.bgHex,
          color: score.fgHex,
          borderColor: score.uiComponents.passesAA ? score.fgHex : 'rgba(255,255,255,0.15)'
        }}
      >
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold tracking-tight">Real-Time Component Rendering</h4>
            <span className="text-xs px-3 py-1 rounded-full border border-current opacity-90 font-mono font-bold">
              Ratio {score.formattedRatio}
            </span>
          </div>

          <p className="text-xs leading-relaxed opacity-90 max-w-2xl font-medium">
            Under WCAG 2.1 SC 1.4.3, standard body text must maintain a minimum 4.5:1 luminance contrast against its
            adjacent background to guarantee cognitive readability for individuals with moderately low vision.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              className="px-4 py-2 rounded-full text-xs font-black shadow-md transition-opacity hover:opacity-90 uppercase tracking-wider"
              style={{
                backgroundColor: score.fgHex,
                color: score.bgHex
              }}
            >
              Action Button
            </button>

            <span className="text-xs font-bold underline underline-offset-4 cursor-pointer">
              Hyperlink Example
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
