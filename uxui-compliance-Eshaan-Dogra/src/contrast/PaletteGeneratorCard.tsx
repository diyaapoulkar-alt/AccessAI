/**
 * Compliant Palette Generator UI Card (Drake Theme)
 * AccessAI - UX/UI & Compliance Suite
 */

import React, { useState, useMemo } from 'react';
import { Palette, Sparkles, Copy, Check, ArrowUpRight } from 'lucide-react';
import { generateCompliantPalette, generateContrastRamp } from './palette-generator';
import { PaletteSuggestion } from './types';

export interface PaletteGeneratorCardProps {
  initialBaseColor?: string;
  onSelectPair?: (foreground: string, background: string) => void;
  className?: string;
}

const BRAND_PRESETS = [
  { label: 'Drake Emerald', hex: '#28E98C' },
  { label: 'Emerald Green', hex: '#10B981' },
  { label: 'Signal Amber', hex: '#F59E0B' },
  { label: 'Electric Blue', hex: '#3B82F6' },
  { label: 'Royal Violet', hex: '#8B5CF6' },
  { label: 'Solar Gold', hex: '#EAB308' },
];

export const PaletteGeneratorCard: React.FC<PaletteGeneratorCardProps> = ({
  initialBaseColor = '#28E98C',
  onSelectPair,
  className = ''
}) => {
  const [baseColor, setBaseColor] = useState(initialBaseColor);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    return generateCompliantPalette(baseColor);
  }, [baseColor]);

  const ramp = useMemo(() => {
    return generateContrastRamp(baseColor);
  }, [baseColor]);

  const handleCopy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className={`bg-[#0f0f0f]/90 border border-[#262626] rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-5 border-b border-[#262626] gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#171717] border border-[#2e2e2e] text-[#28e98c]">
            <Palette className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">WCAG Compliant Palette Engine</h3>
            <p className="text-xs text-slate-400">Algorithmic HSL Lightness Bisection search to calculate optimal contrast pairings</p>
          </div>
        </div>

        {/* Base Color Input */}
        <div className="flex items-center gap-2.5 bg-[#171717] border border-[#2e2e2e] px-4 py-2 rounded-2xl shadow-inner">
          <label htmlFor="palette-base-input" className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Base:
          </label>
          <input
            type="color"
            id="palette-base-picker"
            value={baseColor.startsWith('#') && baseColor.length === 7 ? baseColor : '#28E98C'}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-7 h-7 rounded-xl border border-[#383838] bg-transparent cursor-pointer"
            aria-label="Base palette color picker"
          />
          <input
            type="text"
            id="palette-base-input"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="w-24 bg-[#0a0a0a] border border-[#333333] rounded-xl px-3 py-1 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-[#28e98c] font-bold"
          />
        </div>
      </div>

      {/* Preset Swatches */}
      <div className="flex flex-wrap items-center gap-2 my-5">
        <span className="text-[11px] text-slate-400 font-bold uppercase mr-1">Brand Seeds:</span>
        {BRAND_PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setBaseColor(preset.hex)}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all ${
              baseColor.toLowerCase() === preset.hex.toLowerCase()
                ? 'bg-[#28e98c] text-black border-[#28e98c] shadow-[0_0_15px_rgba(40,233,140,0.4)]'
                : 'bg-[#171717] border-[#2b2b2b] text-slate-300 hover:text-white hover:bg-[#242424]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: preset.hex }}></span>
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Suggested Compliant Pairings */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-200">
          <Sparkles className="w-4 h-4 text-[#28e98c]" />
          <span>Recommended Accessible UI Pairings (Guaranteed ≥ 4.5:1)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((item: PaletteSuggestion) => (
            <div
              key={item.id}
              className="bg-[#171717] border border-[#2b2b2b] rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-[#28e98c]/50 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white truncate">{item.title}</h4>
                  <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full border bg-[#28e98c]/15 text-[#28e98c] border-[#28e98c]/40 flex-shrink-0">
                    {item.formattedRatio}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
              </div>

              {/* Visual Demo Card */}
              <div
                className="rounded-2xl p-4 text-center border shadow-inner transition-all flex flex-col items-center justify-center min-h-[70px]"
                style={{
                  backgroundColor: item.background,
                  color: item.foreground,
                  borderColor: 'rgba(255,255,255,0.1)'
                }}
              >
                <span className="text-xs font-black uppercase tracking-wider">Accessible UI</span>
                <span className="text-[10px] opacity-80 mt-0.5 font-bold">WCAG {item.passesAAA ? 'AAA' : 'AA'} Compliant</span>
              </div>

              {/* Color Hex & Actions */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400 border-t border-[#262626]">
                <div className="space-x-1">
                  <span>FG: <strong className="text-white">{item.foreground}</strong></span>
                  <span>·</span>
                  <span>BG: <strong className="text-white">{item.background}</strong></span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.foreground)}
                    title="Copy foreground hex"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#242424] transition-colors"
                  >
                    {copiedHex === item.foreground ? (
                      <Check className="w-3.5 h-3.5 text-[#28e98c]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {onSelectPair && (
                    <button
                      type="button"
                      onClick={() => onSelectPair(item.foreground, item.background)}
                      title="Load in Contrast Checker"
                      className="p-1.5 text-[#28e98c] hover:text-white rounded-lg hover:bg-[#242424] transition-colors"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monochromatic Accessibility Ramp */}
      <div className="space-y-3 pt-5 border-t border-[#262626]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black uppercase tracking-wider text-slate-200">10-Step Monochromatic Ramp (50 to 900)</span>
          <span className="text-[11px] text-slate-400">W: White Pass · B: Black Pass</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {ramp.map((step) => (
            <div
              key={step.step}
              className="bg-[#171717] border border-[#2b2b2b] rounded-2xl p-2 text-center flex flex-col items-center space-y-1"
            >
              <span className="text-[10px] font-mono text-slate-400">{step.step}</span>
              <div
                className="w-full h-8 rounded-xl border border-[#333333] cursor-pointer hover:scale-105 transition-transform shadow-sm"
                style={{ backgroundColor: step.hex }}
                title={`Click to copy: ${step.hex}`}
                onClick={() => handleCopy(step.hex)}
              ></div>
              <span className="text-[9px] font-mono text-white font-bold truncate w-full">{step.hex}</span>
              <div className="text-[8px] flex items-center justify-center gap-1 text-slate-400 font-black">
                <span className={step.passesAAOnWhite ? 'text-[#28e98c]' : 'text-slate-600'}>W</span>
                <span className={step.passesAAOnBlack ? 'text-[#28e98c]' : 'text-slate-600'}>B</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
