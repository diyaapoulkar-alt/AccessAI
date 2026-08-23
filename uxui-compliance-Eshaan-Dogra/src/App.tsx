/**
 * AccessAI - UX/UI & Compliance Suite
 * Theme: Drake - Earth Lines Sphere (Fixed Desktop Sidebar & Clean Bottom Spacing)
 */

import { useState, useEffect, useRef } from 'react';
import {
  CVDSimulatorToolbar,
  CVDPreviewWrapper,
  useCVD,
  CVD_METADATA,
  simulateCVDColor
} from './cvd';
import {
  ContrastCheckerCard,
  PaletteGeneratorCard
} from './contrast';
import {
  AccessibilityProvider,
  AccessibilitySettingsPanel,
  AccessibilitySettingsModal,
  useAccessibility
} from './accessibility-theme';
import { EarthLinesSphere } from './components/EarthLinesSphere';
import {
  Eye,
  Sliders,
  Layers,
  FileCheck,
  Activity,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Palette as PaletteIcon,
  Home,
  User,
  Briefcase,
  Zap,
  ArrowDown,
  Sparkles,
  Bot,
  Terminal,
  Cpu,
  Check
} from 'lucide-react';

export function AppContent() {
  const {
    type,
    severity,
    comparisonMode,
    splitPosition,
    setCvdType,
    setSeverity,
    setComparisonMode,
    setSplitPosition,
    reset,
    isSimulating
  } = useCVD({ initialType: 'deuteranopia', initialMode: 'split-vertical' });

  const { isHighContrast, isOpenDyslexic, preferences } = useAccessibility();
  const [activeSection, setActiveSection] = useState<string>('introduce');
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentMetadata = CVD_METADATA[type];

  // Vibrant test swatches representing realistic UI brand and feedback tokens
  const testSwatches = [
    { label: 'Success Green', hex: '#16a34a' },
    { label: 'Danger Crimson', hex: '#dc2626' },
    { label: 'Warning Amber', hex: '#d97706' },
    { label: 'Brand Blue', hex: '#2563eb' },
    { label: 'Royal Violet', hex: '#7c3aed' },
    { label: 'Teal Accent', hex: '#0d9488' },
    { label: 'Coral Orange', hex: '#ea580c' },
    { label: 'Solar Gold', hex: '#ca8a04' },
    { label: 'Magenta Pink', hex: '#db2777' },
  ];

  // Glitch-free smooth scroll handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    setActiveSection(id);
    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Release programmatic scroll lock after smooth scrolling settles
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  // Robust IntersectionObserver for seamless active section tracking without flickering
  useEffect(() => {
    const sections = ['introduce', 'about', 'cvd', 'contrast', 'palette', 'preferences'];

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (isScrollingRef.current) return;

      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveSection(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0.05
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Console signature watermark on mount
  useEffect(() => {
    console.info(
      '%c AccessAI %c UX/UI & Compliance Suite %c Built by Eshaan Dogra (25BCE10675) ',
      'background: #28e98c; color: #000; font-weight: 800; border-radius: 4px 0 0 4px; padding: 2px 6px;',
      'background: #1e1e1e; color: #fff; padding: 2px 6px;',
      'background: #0f0f0f; color: #28e98c; border-radius: 0 4px 4px 0; padding: 2px 6px;'
    );
  }, []);

  return (
    <div
      data-author="Eshaan Dogra: 25BCE10675"
      data-deliverables="CVD Simulator, WCAG Contrast Engine, Adaptive Themes"
      className="min-h-screen bg-black text-white flex flex-col font-sans relative overflow-x-hidden"
    >
      {/* 1. Authentic Earth Lines Sphere Live Video Background */}
      <EarthLinesSphere />

      {/* 2. Top Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#262626] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-black tracking-widest text-white">AccessAI<span className="text-[#28e98c]">®</span></span>
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-[#1f1f1f] px-2 py-0.5 rounded-full">Compliance Suite</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollToSection('introduce')}
            className={`p-2 rounded-xl border text-xs transition-colors ${activeSection === 'introduce' ? 'bg-[#28e98c] text-black border-[#28e98c]' : 'bg-[#141414] border-[#2b2b2b] text-slate-300'}`}
            title="Introduction"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className={`p-2 rounded-xl border text-xs transition-colors ${activeSection === 'about' ? 'bg-[#28e98c] text-black border-[#28e98c]' : 'bg-[#141414] border-[#2b2b2b] text-slate-300'}`}
            title="About Platform"
          >
            <User className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('cvd')}
            className={`p-2 rounded-xl border text-xs transition-colors ${activeSection === 'cvd' ? 'bg-[#28e98c] text-black border-[#28e98c]' : 'bg-[#141414] border-[#2b2b2b] text-slate-300'}`}
            title="CVD Simulator"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('contrast')}
            className={`p-2 rounded-xl border text-xs transition-colors ${activeSection === 'contrast' ? 'bg-[#28e98c] text-black border-[#28e98c]' : 'bg-[#141414] border-[#2b2b2b] text-slate-300'}`}
            title="Contrast Engine"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('palette')}
            className={`p-2 rounded-xl border text-xs transition-colors ${activeSection === 'palette' ? 'bg-[#28e98c] text-black border-[#28e98c]' : 'bg-[#141414] border-[#2b2b2b] text-slate-300'}`}
            title="Palette"
          >
            <PaletteIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('preferences')}
            className={`p-2 rounded-xl border text-xs transition-colors ${activeSection === 'preferences' ? 'bg-[#28e98c] text-black border-[#28e98c]' : 'bg-[#141414] border-[#2b2b2b] text-slate-300'}`}
            title="Preferences"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10 flex-1">
        {/* 3. Left Fixed Desktop Sidebar (Drake Full-Height Persistent Anchoring) */}
        <aside className="hidden lg:block fixed left-6 xl:left-8 top-8 bottom-8 w-[340px] xl:w-[370px] z-30 overflow-y-auto pr-1">
          <div className="min-h-full bg-[#0d0d0d]/95 border border-[#242424] rounded-[32px] p-6 xl:p-7 flex flex-col justify-between text-center shadow-2xl backdrop-blur-md space-y-5">
            {/* Card Header with Version / Compliance Badge */}
            <div className="flex items-center justify-between text-left">
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                <span>AccessAI</span>
                <span className="text-[#28e98c]">®</span>
              </div>
              <div className="flex items-center gap-1 bg-[#181818] px-2.5 py-1 rounded-full border border-[#2b2b2b]">
                <span className="text-[10px] font-mono font-bold text-[#28e98c] uppercase tracking-wider">WCAG 2.2 AA</span>
              </div>
            </div>

            {/* Central Engine Visual Shield */}
            <div className="relative mx-auto w-44 h-44 rounded-3xl overflow-hidden border border-[#262626] bg-[#141414] flex items-center justify-center p-3 shadow-inner group">
              <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[#0a0a0a] via-[#141414] to-[#1e1e1e] flex flex-col items-center justify-center p-3 space-y-2 border border-[#262626]">
                <div className="w-12 h-12 rounded-2xl bg-[#28e98c]/10 border border-[#28e98c]/30 flex items-center justify-center text-[#28e98c] shadow-[0_0_20px_rgba(40,233,140,0.25)]">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-0.5 text-center">
                  <span className="text-xs font-black uppercase tracking-wider text-white block">Compliance Engine</span>
                  <span className="text-[10px] font-mono text-[#28e98c] font-bold block">v2.4 Core Suite</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400">
                  <Check className="w-3 h-3 text-[#28e98c]" />
                  <span>IEC 61966-2-1 Precision</span>
                </div>
              </div>
            </div>

            {/* Core Engine Specifications */}
            <div className="space-y-2 text-left bg-[#141414] p-3.5 rounded-2xl border border-[#222222] text-xs text-slate-300">
              <div className="font-bold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-[#28e98c]">
                <Sparkles className="w-3 h-3" />
                <span>Architecture & Modules:</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-1">
                  <span className="text-slate-400">CVD Transform</span>
                  <span className="font-mono text-[#28e98c] font-bold">Brettel / Machado</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-1">
                  <span className="text-slate-400">Luminance</span>
                  <span className="font-mono text-slate-200">IEC 61966-2-1</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-1">
                  <span className="text-slate-400">Palette Search</span>
                  <span className="font-mono text-slate-200">HSL Bisection</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Adaptive Aids</span>
                  <span className="font-mono text-yellow-400 font-bold">19.5:1 HC + Dyslexic</span>
                </div>
              </div>
            </div>

            {/* Quick Navigation Jump Buttons */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-left">
              <button
                type="button"
                onClick={() => scrollToSection('cvd')}
                className="p-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#222222] hover:border-[#28e98c] rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-[#28e98c]" />
                <span className="truncate">CVD Simulator</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('contrast')}
                className="p-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#222222] hover:border-[#28e98c] rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#28e98c]" />
                <span className="truncate">WCAG Engine</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('palette')}
                className="p-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#222222] hover:border-[#28e98c] rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <PaletteIcon className="w-3.5 h-3.5 text-[#28e98c]" />
                <span className="truncate">Palette Tool</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('preferences')}
                className="p-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#222222] hover:border-[#28e98c] rounded-xl text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-[#28e98c]" />
                <span className="truncate">A11y System</span>
              </button>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => scrollToSection('contrast')}
              className="drake-btn w-full shadow-[0_0_25px_rgba(40,233,140,0.35)]"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>TEST WCAG CONTRAST!</span>
            </button>

            {/* Compliance Standards Footer */}
            <div className="pt-2 border-t border-[#1f1f1f] text-[10px] text-slate-500 flex items-center justify-between">
              <span>Section 508</span>
              <span>•</span>
              <span>ADA Title III</span>
              <span>•</span>
              <span>EN 301 549</span>
            </div>
          </div>
        </aside>

        {/* 4. Center Main Scroll Area (With generous bottom padding to eliminate overlaps) */}
        <main className="w-full lg:pl-[360px] xl:pl-[395px] lg:pr-20 space-y-16 pb-28 lg:pb-36">
          {/* Section 1: Introduction & Hero Overview */}
          <section id="introduce" className="space-y-6 scroll-mt-10">
            {/* Section Subtitle Pill */}
            <div className="drake-pill">
              <Home className="w-3.5 h-3.5 text-[#28e98c]" />
              <span>INTRODUCTION</span>
            </div>

            {/* Drake Hero Title - Focused on Precision Accessibility & Usability */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Engineering <span className="text-[#28e98c]">Meaningful</span> Web Accessibility & Compliance
              </h1>
              <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
                Evaluating web accessibility beyond basic checkbox checks with clinical Color Vision Deficiency simulation,
                mathematical WCAG 2.1/2.2 contrast validation, and cognitive reading adaptations.
              </p>
            </div>

            {/* Circular Rotating Project Badge & Fact Counters */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#28e98c]">8+</div>
                  <div className="text-xs uppercase font-bold text-slate-400 mt-1">Deficiencies<br />Simulated</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#28e98c]">182+</div>
                  <div className="text-xs uppercase font-bold text-slate-400 mt-1">WCAG Rules<br />Verified</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#28e98c]">19.5:1</div>
                  <div className="text-xs uppercase font-bold text-slate-400 mt-1">High Contrast<br />Theme Ratio</div>
                </div>
              </div>

              {/* Drake Rotating Text Badge Widget */}
              <div
                className="relative w-24 h-24 flex items-center justify-center cursor-pointer group"
                onClick={() => scrollToSection('cvd')}
              >
                <svg className="w-full h-full rotating-badge" viewBox="0 0 100 100">
                  <path
                    id="circlePath"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9.5px] font-black uppercase tracking-[0.2em] fill-slate-300 group-hover:fill-[#28e98c] transition-colors">
                    <textPath href="#circlePath">
                      • MY CONTRIBUTION • MY CONTRIBUTION •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border border-[#333333] group-hover:border-[#28e98c] flex items-center justify-center text-slate-300 group-hover:text-[#28e98c] transition-all">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: About AccessAI Project & Scope */}
          <section id="about" className="space-y-6 pt-8 border-t border-[#262626] scroll-mt-10">
            <div className="drake-pill">
              <User className="w-3.5 h-3.5 text-[#28e98c]" />
              <span>ABOUT ACCESSAI PLATFORM</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                AI-Powered Web Accessibility <span className="text-[#28e98c]">Scanner</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                AccessAI is an AI-powered accessibility platform that detects and evaluates web accessibility issues affecting users with disabilities.
                Unlike traditional rule-based accessibility checkers that only identify whether a requirement is technically satisfied, AccessAI uses ML to assess whether accessibility fixes are actually meaningful and usable.
              </p>
            </div>

            {/* Feature Grid: Platform Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0f0f0f]/90 border border-[#262626] rounded-3xl p-5 space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#171717] border border-[#2b2b2b] flex items-center justify-center text-[#28e98c]">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Meaningful ML Judgement</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates whether descriptions and alt-texts are relevant and informative, heading hierarchy is logical, and form fields are truly usable.
                </p>
              </div>

              <div className="bg-[#0f0f0f]/90 border border-[#262626] rounded-3xl p-5 space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#171717] border border-[#2b2b2b] flex items-center justify-center text-[#28e98c]">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Multi-Surface Architecture</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Browser extension for in-page audits, developer API for CI/CD pipeline integration, and centralized compliance telemetry dashboard.
                </p>
              </div>

              <div className="bg-[#0f0f0f]/90 border border-[#262626] rounded-3xl p-5 space-y-2.5 border-[#28e98c]/30">
                <div className="w-10 h-10 rounded-2xl bg-[#28e98c]/10 border border-[#28e98c]/30 flex items-center justify-center text-[#28e98c]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-white">UX/UI & Compliance Suite</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Specialized deliverable architecture including CVD Simulation, WCAG 2.1/2.2 AA Contrast Engine, High-Contrast Themes, and OpenDyslexic integration.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Deliverable 1 - Color Vision Deficiency Simulator */}
          <section id="cvd" className="space-y-6 pt-8 border-t border-[#262626] scroll-mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="drake-pill">
                <Eye className="w-3.5 h-3.5 text-[#28e98c]" />
                <span>DELIVERABLE 1: CVD SIMULATOR</span>
              </div>
              {isSimulating && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#171717] text-[#28e98c] border border-[#28e98c]/40">
                  {currentMetadata.category}: {currentMetadata.label} ({Math.round(severity * 100)}%)
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Color Vision <span className="text-[#28e98c]">Deficiency Simulator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulates Deuteranopia, Protanopia, and Achromatopsia using exact Brettel (1997), Viénot (1999), and Machado (2009) algorithms.
              </p>
            </div>

            {/* Toolbar */}
            <CVDSimulatorToolbar
              currentType={type}
              severity={severity}
              comparisonMode={comparisonMode}
              onTypeChange={setCvdType}
              onSeverityChange={setSeverity}
              onModeChange={setComparisonMode}
              onReset={reset}
            />

            {/* CVD Preview Wrapper (Untouched rich colors inside!) */}
            <CVDPreviewWrapper
              type={type}
              severity={severity}
              comparisonMode={comparisonMode}
              splitPosition={splitPosition}
              onSplitChange={setSplitPosition}
            >
              {/* Vibrant, Realistic UI Dashboard inside the simulation layer */}
              <div className="bg-[#0e1017] border border-[#1e2230] rounded-3xl p-6 space-y-6 shadow-2xl">
                {/* Metric Cards Row (Vibrant Green, Amber, Blue, and Purple) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                      <span>WCAG AA Score</span>
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-white">96.4%</div>
                    <div className="mt-1 flex items-center text-xs text-emerald-400 font-semibold gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+4.2% compliant</span>
                    </div>
                  </div>

                  <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                      <span>Contrast Warnings</span>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-amber-400">2 Warnings</div>
                    <div className="mt-1 text-xs text-amber-400/90">Low contrast in secondary buttons</div>
                  </div>

                  <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                      <span>Average Contrast Ratio</span>
                      <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-sky-400">5.42:1</div>
                    <div className="mt-1 text-xs text-sky-300">Exceeds 4.5:1 AA threshold</div>
                  </div>

                  <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                      <span>DOM Elements Verified</span>
                      <Activity className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-purple-400">1,840</div>
                    <div className="mt-1 text-xs text-purple-300">Active scan complete</div>
                  </div>
                </div>

                {/* Status Alerts (Crucial test for Red vs Green vs Amber discrimination) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Green Alert */}
                  <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-2xl p-4 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Success: Passed AA</h3>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                        All navigation links maintain discernible text and compliant focus boundaries.
                      </p>
                    </div>
                  </div>

                  {/* Amber Alert */}
                  <div className="bg-amber-950/40 border border-amber-500/50 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Warning: Color Reliance</h3>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                        Color alone indicates required fields. Ensure text labels or asterisks are present.
                      </p>
                    </div>
                  </div>

                  {/* Red Alert */}
                  <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Error: Critical Contrast</h3>
                      <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                        Contrast ratio of 2.1:1 on secondary submit button fails AA requirements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Multi-Colored Data Visualization Charts */}
                <div className="bg-[#141724] border border-[#23283a] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-sky-400" />
                      <h3 className="text-sm font-semibold text-white">Compliance Distribution by Category</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-3 h-3 rounded-sm bg-emerald-500"></span> Accessible (Pass)
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-3 h-3 rounded-sm bg-amber-500"></span> Caution Required
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <span className="w-3 h-3 rounded-sm bg-rose-500"></span> Violation (Fail)
                      </span>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>1. Perceivable (Color, Contrast, Text Alternatives)</span>
                        <span className="font-semibold text-white">88% Pass</span>
                      </div>
                      <div className="h-3 w-full bg-[#1e2333] rounded-full overflow-hidden flex">
                        <div style={{ width: '75%' }} className="bg-emerald-500 h-full" title="75% Pass"></div>
                        <div style={{ width: '15%' }} className="bg-amber-500 h-full" title="15% Caution"></div>
                        <div style={{ width: '10%' }} className="bg-rose-500 h-full" title="10% Fail"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>2. Operable (Keyboard Navigation & Focus Indicators)</span>
                        <span className="font-semibold text-white">96% Pass</span>
                      </div>
                      <div className="h-3 w-full bg-[#1e2333] rounded-full overflow-hidden flex">
                        <div style={{ width: '90%' }} className="bg-emerald-500 h-full" title="90% Pass"></div>
                        <div style={{ width: '6%' }} className="bg-amber-500 h-full" title="6% Caution"></div>
                        <div style={{ width: '4%' }} className="bg-rose-500 h-full" title="4% Fail"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>3. Understandable & 4. Robust</span>
                        <span className="font-semibold text-white">74% Pass</span>
                      </div>
                      <div className="h-3 w-full bg-[#1e2333] rounded-full overflow-hidden flex">
                        <div style={{ width: '62%' }} className="bg-emerald-500 h-full" title="62% Pass"></div>
                        <div style={{ width: '22%' }} className="bg-amber-500 h-full" title="22% Caution"></div>
                        <div style={{ width: '16%' }} className="bg-rose-500 h-full" title="16% Fail"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CVDPreviewWrapper>

            {/* Real-time Color Swatch Inspector Section */}
            <div className="bg-[#0f0f0f]/90 border border-[#262626] rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#28e98c]" />
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                    Design Token CVD Inspector (simulateCVDColor)
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Left: Original · Right: Simulated under {currentMetadata.label}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-3">
                {testSwatches.map((swatch) => {
                  const simulatedHex = simulateCVDColor(swatch.hex, type, severity);

                  return (
                    <div
                      key={swatch.label}
                      className="bg-[#171717] border border-[#2b2b2b] rounded-2xl p-3 text-center space-y-2"
                    >
                      <span className="text-[11px] font-bold text-slate-200 block truncate">
                        {swatch.label}
                      </span>

                      <div className="h-10 w-full rounded-xl overflow-hidden flex border border-[#333333] shadow-inner">
                        <div
                          className="w-1/2 h-full"
                          style={{ backgroundColor: swatch.hex }}
                          title={`Original: ${swatch.hex}`}
                        ></div>
                        <div
                          className="w-1/2 h-full"
                          style={{ backgroundColor: simulatedHex }}
                          title={`Simulated: ${simulatedHex}`}
                        ></div>
                      </div>

                      <div className="text-[10px] font-mono space-y-0.5">
                        <div className="text-slate-400">{swatch.hex}</div>
                        <div className="text-[#28e98c] font-black">{simulatedHex}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Section 4: Deliverable 2 - WCAG 2.1/2.2 AA Contrast Engine */}
          <section id="contrast" className="space-y-6 pt-8 border-t border-[#262626] scroll-mt-10">
            <div className="drake-pill">
              <ShieldCheck className="w-3.5 h-3.5 text-[#28e98c]" />
              <span>DELIVERABLE 2: WCAG CONTRAST ENGINE</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Mathematical <span className="text-[#28e98c]">Contrast Ratio Engine</span>
              </h2>
              <p className="text-xs text-slate-400">
                Calculates relative luminance via piecewise IEC 61966-2-1 sRGB companding and alpha-channel compositing.
              </p>
            </div>
            <ContrastCheckerCard />
          </section>

          {/* Section 5: Deliverable 2 - Compliant Palette Generator */}
          <section id="palette" className="space-y-6 pt-8 border-t border-[#262626] scroll-mt-10">
            <div className="drake-pill">
              <Briefcase className="w-3.5 h-3.5 text-[#28e98c]" />
              <span>DELIVERABLE 2: PALETTE GENERATOR</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Algorithmic <span className="text-[#28e98c]">Palette Generator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Binary bisection search in HSL lightness space to auto-generate accessible UI palettes meeting AA/AAA thresholds.
              </p>
            </div>
            <PaletteGeneratorCard />
          </section>

          {/* Section 6: Deliverable 3 - Accessibility & High Contrast Preferences */}
          <section id="preferences" className="space-y-6 pt-8 border-t border-[#262626] scroll-mt-10">
            <div className="drake-pill">
              <Sliders className="w-3.5 h-3.5 text-[#28e98c]" />
              <span>DELIVERABLE 3: THEME PREFERENCES</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                High-Contrast & <span className="text-[#28e98c]">OpenDyslexic Engine</span>
              </h2>
              <p className="text-xs text-slate-400">
                High-contrast Yellow/Black theme ($19.5:1$ ratio), OpenDyslexic font engine, and cognitive reading preferences.
              </p>
            </div>
            <AccessibilitySettingsPanel />
          </section>

          {/* Clean Integrated Footer within Main Stream (No Overlaps) */}
          <footer className="pt-10 border-t border-[#222222] text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">© 2026 AccessAI</span>
              <span>· Precision UX/UI & Compliance Suite</span>
              <span className="text-slate-600">·</span>
              <span
                title="UX/UI & Compliance Suite (CVD Simulator, Contrast Engine, Adaptive Themes) made by Eshaan Dogra: 25BCE10675"
                className="text-[11px] text-slate-600 hover:text-[#28e98c] transition-colors cursor-default"
              >
                Eshaan Dogra: 25BCE10675
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span>Theme: {preferences.theme}</span>
              <span>Font: {preferences.fontFamily}</span>
              <span>Scale: {preferences.textScale}%</span>
              {isHighContrast && <span className="text-yellow-400 font-bold">HC ACTIVE</span>}
              {isOpenDyslexic && <span className="text-[#28e98c] font-bold">OPENDYSLEXIC</span>}
            </div>
          </footer>
        </main>

        {/* 5. Right Floating Navigation Pill Dock (Smooth Glitch-Free Navigation) */}
        <nav
          aria-label="Drake Sidebar Navigation"
          className="hidden lg:flex flex-col items-center fixed right-6 xl:right-8 top-1/2 -translate-y-1/2 z-40 bg-[#0d0d0d]/95 border border-[#262626] rounded-full p-2.5 space-y-4 shadow-2xl backdrop-blur-md"
        >
          <button
            type="button"
            onClick={() => scrollToSection('introduce')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeSection === 'introduce'
                ? 'bg-[#28e98c] text-black shadow-[0_0_15px_rgba(40,233,140,0.5)] scale-110'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Introduction"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('about')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeSection === 'about'
                ? 'bg-[#28e98c] text-black shadow-[0_0_15px_rgba(40,233,140,0.5)] scale-110'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="About AccessAI Platform"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('cvd')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeSection === 'cvd'
                ? 'bg-[#28e98c] text-black shadow-[0_0_15px_rgba(40,233,140,0.5)] scale-110'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="CVD Simulator"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('contrast')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeSection === 'contrast'
                ? 'bg-[#28e98c] text-black shadow-[0_0_15px_rgba(40,233,140,0.5)] scale-110'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="WCAG Contrast Engine"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('palette')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeSection === 'palette'
                ? 'bg-[#28e98c] text-black shadow-[0_0_15px_rgba(40,233,140,0.5)] scale-110'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Palette Generator"
          >
            <PaletteIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('preferences')}
            className={`p-3 rounded-full transition-all duration-200 ${
              activeSection === 'preferences'
                ? 'bg-[#28e98c] text-black shadow-[0_0_15px_rgba(40,233,140,0.5)] scale-110'
                : 'text-slate-400 hover:text-white hover:bg-[#1a1a1a]'
            }`}
            title="Accessibility & Theme Preferences"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </nav>
      </div>

      {/* Floating Accessibility Settings Modal Trigger */}
      <AccessibilitySettingsModal />
    </div>
  );
}

export function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}

export default App;
