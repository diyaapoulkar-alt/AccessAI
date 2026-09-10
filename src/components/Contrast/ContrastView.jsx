import React from 'react';
import { ContrastCheckerCard, PaletteGeneratorCard } from '../../contrast';
import { ShieldCheck, Briefcase } from 'lucide-react';

export default function ContrastView() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="space-y-2">
          <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> WCAG 2.1 / 2.2 AA Contrast & Palette Suite
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Mathematical Contrast Engine & Palette Generator
          </h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-3xl font-normal">
            Calculates relative luminance using piecewise sRGB companding and alpha-channel compositing. Auto-generates accessible UI color palettes using HSL binary bisection search. Engineered by <strong className="font-semibold text-stone-900">Eshaan Dogra</strong>.
          </p>
        </div>
      </div>

      {/* WCAG Contrast Checker Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm">
        <ContrastCheckerCard />
      </div>

      {/* Palette Generator Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm">
        <PaletteGeneratorCard />
      </div>

    </div>
  );
}
