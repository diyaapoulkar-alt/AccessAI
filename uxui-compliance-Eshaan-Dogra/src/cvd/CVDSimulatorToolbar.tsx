/**
 * CVD Simulator Toolbar Component (Drake Theme)
 * AccessAI - UX/UI & Compliance Suite
 */

import React, { useState } from 'react';
import { Eye, Sliders, Columns, RotateCcw, Info, ShieldAlert, ChevronDown } from 'lucide-react';
import { CVD_METADATA } from './matrices';
import { CVDType, ComparisonMode } from './types';

export interface CVDSimulatorToolbarProps {
  currentType: CVDType;
  severity: number;
  comparisonMode: ComparisonMode;
  onTypeChange: (type: CVDType) => void;
  onSeverityChange: (severity: number) => void;
  onModeChange: (mode: ComparisonMode) => void;
  onReset: () => void;
  className?: string;
  isCompact?: boolean;
}

export const CVDSimulatorToolbar: React.FC<CVDSimulatorToolbarProps> = ({
  currentType,
  severity,
  comparisonMode,
  onTypeChange,
  onSeverityChange,
  onModeChange,
  onReset,
  className = '',
  isCompact = false
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const info = CVD_METADATA[currentType];
  const isSimulating = currentType !== 'normal' && severity > 0;

  return (
    <nav
      aria-label="Color Vision Deficiency Simulator Controls"
      className={`bg-[#0f0f0f]/90 border border-[#262626] rounded-3xl ${isCompact ? 'p-3' : 'p-4 sm:p-5'} text-white shadow-2xl backdrop-blur-md ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Vision Mode Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Eye className="w-4 h-4 text-[#28e98c]" aria-hidden="true" />
            <label htmlFor="cvd-type-select" className="text-xs uppercase tracking-widest font-bold text-slate-200">
              Vision Mode:
            </label>
          </div>

          <div className="relative">
            <select
              id="cvd-type-select"
              value={currentType}
              onChange={(e) => onTypeChange(e.target.value as CVDType)}
              className="appearance-none bg-[#171717] border border-[#333333] rounded-2xl pl-4 pr-9 py-2 text-xs font-semibold text-white hover:border-[#28e98c] focus:outline-none focus:ring-2 focus:ring-[#28e98c] transition-colors cursor-pointer"
              aria-describedby="cvd-condition-desc"
            >
              <optgroup label="Standard Vision">
                <option value="normal">Standard Trichromat (Normal)</option>
              </optgroup>
              <optgroup label="Dichromacy (Absence of Cone)">
                <option value="deuteranopia">Deuteranopia (Green-Blind · ~1.2% Males)</option>
                <option value="protanopia">Protanopia (Red-Blind · ~1.0% Males)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind · Rare)</option>
              </optgroup>
              <optgroup label="Monochromacy (Total Colorblind)">
                <option value="achromatopsia">Achromatopsia (Rod Monochromacy)</option>
                <option value="achromatomaly">Achromatomaly (Partial Monochromacy)</option>
              </optgroup>
              <optgroup label="Anomalous Trichromacy (Shifted Spectrum)">
                <option value="deuteranomaly">Deuteranomaly (Green-Weak · ~5.0% Males)</option>
                <option value="protanomaly">Protanomaly (Red-Weak · ~1.0% Males)</option>
                <option value="tritanomaly">Tritanomaly (Blue-Weak · Rare)</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#28e98c] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quick Info Toggle */}
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            aria-expanded={showInfo}
            aria-controls="cvd-info-card"
            title="Inspect clinical epidemiology & UX impact"
            className={`p-2 rounded-xl border text-xs transition-colors ${
              showInfo
                ? 'bg-[#28e98c] text-black border-[#28e98c] font-bold shadow-[0_0_15px_rgba(40,233,140,0.4)]'
                : 'bg-[#171717] text-slate-400 border-[#333333] hover:text-white hover:border-[#28e98c]'
            }`}
          >
            <Info className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Toggle condition information</span>
          </button>
        </div>

        {/* Middle: Severity Slider */}
        {currentType !== 'normal' && (
          <div className="flex items-center gap-3 px-4 py-1.5 bg-[#171717] rounded-2xl border border-[#333333]">
            <Sliders className="w-4 h-4 text-[#28e98c]" aria-hidden="true" />
            <label htmlFor="cvd-severity-slider" className="text-xs text-slate-200 font-semibold">
              Severity: {Math.round(severity * 100)}%
            </label>
            <input
              id="cvd-severity-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={severity}
              onChange={(e) => onSeverityChange(parseFloat(e.target.value))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(severity * 100)}
              aria-valuetext={`${Math.round(severity * 100)} percent deficiency severity`}
              className="w-24 h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#28e98c]"
            />
          </div>
        )}

        {/* Right: View Mode Toggle & Reset */}
        <div className="flex items-center gap-2">
          {/* Segmented View Mode Toggle */}
          <div className="inline-flex rounded-2xl border border-[#333333] bg-[#171717] p-1" role="group" aria-label="Comparison View Mode">
            <button
              type="button"
              onClick={() => onModeChange('full')}
              aria-pressed={comparisonMode === 'full'}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                comparisonMode === 'full'
                  ? 'bg-[#28e98c] text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full
            </button>
            <button
              type="button"
              onClick={() => onModeChange('split-vertical')}
              aria-pressed={comparisonMode === 'split-vertical'}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                comparisonMode === 'split-vertical'
                  ? 'bg-[#28e98c] text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" aria-hidden="true" />
              Split
            </button>
            <button
              type="button"
              onClick={() => onModeChange('side-by-side')}
              aria-pressed={comparisonMode === 'side-by-side'}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                comparisonMode === 'side-by-side'
                  ? 'bg-[#28e98c] text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
          </div>

          {/* Reset Button */}
          {isSimulating && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-200 hover:text-black hover:bg-[#28e98c] bg-[#171717] border border-[#333333] hover:border-[#28e98c] rounded-2xl transition-all shadow-sm"
              title="Reset vision simulator to normal (Alt+C)"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <span className="hidden md:inline-flex items-center text-[10px] font-mono text-slate-400 border border-[#333333] px-2 py-1 rounded-xl bg-[#171717]">
            Alt+C
          </span>
        </div>
      </div>

      {/* ARIA Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isSimulating
          ? `Simulating ${info.label} at ${Math.round(severity * 100)} percent severity in ${comparisonMode} view mode.`
          : 'Normal vision mode active.'}
      </div>

      {/* Clinical Info Drawer */}
      {showInfo && (
        <div
          id="cvd-info-card"
          className="mt-4 pt-4 border-t border-[#262626] text-xs grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-150"
        >
          <div className="bg-[#171717] p-4 rounded-2xl border border-[#2b2b2b]">
            <span className="text-[#28e98c] font-bold text-[10px] uppercase tracking-wider block">Condition:</span>
            <p className="font-extrabold text-white text-sm mt-0.5">{info.label}</p>
            <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">{info.description}</p>
          </div>
          <div className="bg-[#171717] p-4 rounded-2xl border border-[#2b2b2b]">
            <span className="text-[#28e98c] font-bold text-[10px] uppercase tracking-wider block">Affected Photoreceptors:</span>
            <p className="font-bold text-white mt-0.5">{info.affectedCone}</p>
            <p className="text-slate-300 mt-1 text-[11px]">Epidemiology: <strong className="text-[#28e98c]">{info.prevalence}</strong></p>
          </div>
          <div className="bg-[#171717] p-4 rounded-2xl border border-[#2b2b2b]">
            <span className="text-[#28e98c] font-bold text-[10px] uppercase tracking-wider block">Compliance Impact:</span>
            <p className="text-slate-200 mt-0.5 flex items-start gap-1.5 text-[11px] leading-relaxed">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#28e98c]" aria-hidden="true" />
              <span>{info.clinicalImpact}</span>
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};
