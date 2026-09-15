import React from 'react';
import { 
  Volume2, 
  Mic, 
  Eye, 
  ShieldCheck, 
  Code, 
  Sparkles, 
  ArrowRight, 
  Sliders,
  ScanSearch,
  CheckCircle2,
  Zap,
  ChevronDown
} from 'lucide-react';

export default function Homepage({ setActiveTab }) {
  const features = [
    {
      id: 'ocr',
      title: 'Vision AI OCR Loud Reader',
      category: 'Blind & Low-Vision UX',
      tagColor: 'bg-[#FAF0E6] text-[#78350F] border-[#E5D3C3]',
      icon: Volume2,
      description: 'Upload documents, signs, or prescription labels. AI extracts verbatim text and synthesizes natural Speech-to-Text audio cleanly without preamble prefixes.',
      action: 'Open Vision Reader'
    },
    {
      id: 'meeting',
      title: 'Google Meet Live Captions & Taskbar',
      category: 'Deaf & Hard-of-Hearing UX',
      tagColor: 'bg-[#FDF3E7] text-[#92400E] border-[#F6D8B8]',
      icon: Mic,
      description: 'Real-time speech transcription with speaker diarization, yellow-black high contrast subtitles, and floating extension control widget.',
      action: 'Launch Live Captions'
    },
    {
      id: 'alt-text',
      title: 'AI Alt-Text Context Evaluator',
      category: 'AI Vision Review',
      tagColor: 'bg-[#F5EBE6] text-[#6B2D0C] border-[#E8D1C5]',
      icon: ScanSearch,
      description: 'Scores images for alt-text quality, detects missing descriptive context, and provides instant WCAG-compliant alt text recommendations.',
      action: 'Evaluate Alt-Text'
    },
    {
      id: 'cvd',
      title: 'Color Vision Deficiency Simulator',
      category: 'Vision Simulation',
      tagColor: 'bg-[#FDF7ED] text-[#B45309] border-[#FBE6C7]',
      icon: Eye,
      description: 'Simulate Deuteranopia, Protanopia, Tritanopia, and Achromatopsia using Brettel and Machado matrix color transforms in real time.',
      action: 'Run CVD Simulator'
    },
    {
      id: 'contrast',
      title: 'WCAG 2.1/2.2 AA Contrast Engine',
      category: 'Compliance Suite',
      tagColor: 'bg-[#FAF3EB] text-[#854D0E] border-[#EFE0C9]',
      icon: ShieldCheck,
      description: 'Calculates relative luminance via piecewise sRGB companding and alpha compositing. Generates compliant UI palettes in HSL space.',
      action: 'Check WCAG Contrast'
    },
    {
      id: 'extension',
      title: 'DOM Inspector Widget',
      category: 'DOM Audit',
      tagColor: 'bg-[#F7EFE9] text-[#7C2D12] border-[#E8D4C8]',
      icon: Sliders,
      description: 'Audit webpage DOM elements for missing alt text, unlabeled controls, skipped heading levels, and side-by-side code fixes.',
      action: 'Open DOM Inspector'
    },
    {
      id: 'api',
      title: 'REST & WebSocket API Gateway',
      category: 'Developer Sandbox',
      tagColor: 'bg-[#FAF5EE] text-[#78350F] border-[#E5D7C5]',
      icon: Code,
      description: 'Interactive API sandbox to test endpoints `/api/v1/vision/read-explain`, `/api/v1/scan/url`, and `wss://stream.accessai.io` with code snippets.',
      action: 'Test API Endpoints'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 px-4 sm:px-6 py-8 font-sans">
      
      {/* Hero Section (Clean White & Warm Brown Aesthetic) */}
      <section className="relative bg-white border border-[#EBE3D7] rounded-[2.5rem] p-8 md:p-16 shadow-[0_15px_40px_-15px_rgba(120,53,15,0.06)] overflow-hidden transition-all duration-500">
        
        {/* Floating Warm Brown Ambient Glow Orbs */}
        <div className="absolute -top-12 -right-12 w-[450px] h-[450px] bg-gradient-to-br from-[#FDE8D0]/60 to-[#F5D0A9]/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute -bottom-16 -left-12 w-[400px] h-[400px] bg-gradient-to-tr from-[#F7E5D5]/50 to-[#EAD2C0]/20 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

        <div className="space-y-8 max-w-4xl relative z-10">
          
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-[#FAF0E6] text-[#78350F] border border-[#E5D3C3] text-xs px-4 py-1.5 rounded-full font-extrabold tracking-wide flex items-center gap-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              INTELLIGENT ACCESSIBLE ECOSYSTEM
            </span>
            <span className="bg-[#FAF7F2] text-[#443830] border border-[#E8DFC8] text-xs px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" /> WCAG 2.1 / 2.2 AA Standard
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#1C130D] tracking-tight leading-[1.05]">
              Access<span className="text-[#D97706]">AI</span> Platform
            </h1>

            <p className="text-[#4A3E37] text-lg md:text-xl font-normal leading-relaxed max-w-3xl">
              An end-to-end accessible suite featuring Vision AI Loud Reader for document OCR, Real-Time Google Meet Captions with speaker diarization, CVD color vision simulation, and WCAG contrast validation.
            </p>
          </div>

          {/* Action Launcher Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={() => setActiveTab('ocr')}
              className="px-7 py-4 rounded-full bg-[#1C130D] hover:bg-[#38261A] text-white font-extrabold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
            >
              <Volume2 className="w-4 h-4 text-[#34D399]" />
              <span>Try Vision AI Reader</span>
              <ArrowRight className="w-4 h-4 text-[#FBBF24]" />
            </button>

            <button
              onClick={() => setActiveTab('meeting')}
              className="px-7 py-4 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white font-black text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2.5"
            >
              <Mic className="w-4 h-4 text-white" />
              <span>Launch Live Captions</span>
            </button>

            <button
              onClick={() => setActiveTab('cvd')}
              className="px-7 py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1C130D] border border-[#E5D8CA] font-extrabold text-sm transition-all duration-300 flex items-center gap-2.5 shadow-xs"
            >
              <Eye className="w-4 h-4 text-[#D97706]" />
              <span>CVD Simulator</span>
            </button>
          </div>

        </div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EBE3D7] pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D97706] uppercase flex items-center gap-2">
              <Zap className="w-4 h-4" /> Interactive Accessibility Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C130D] tracking-tight">
              Explore All Features
            </h2>
          </div>
          <p className="text-[#6B5C52] text-sm max-w-md">
            Click on any feature card below to directly open and interact with that tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="brown-theme-card rounded-3xl p-7 cursor-pointer flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-[#1C130D] text-[#FBBF24] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#D97706] group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-3.5 py-1 rounded-full border ${feat.tagColor}`}>
                      {feat.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-[#1C130D] group-hover:text-[#D97706] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[#5A4D44] text-xs sm:text-sm font-normal leading-relaxed mt-2.5">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F3ECE4] flex items-center justify-between text-xs font-black text-[#1C130D] group-hover:text-[#D97706] transition-colors">
                  <span>{feat.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
