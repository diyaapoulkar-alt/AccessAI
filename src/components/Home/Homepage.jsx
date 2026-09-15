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
  Users,
  Award,
  ScanSearch,
  FileSearch,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function Homepage({ setActiveTab }) {
  const teamMembers = [
    {
      name: "Diya Annasaheb Poulkar",
      regNo: "25BCE11424",
      role: "Real-Time Audio & AI Systems Architect",
      contributions: "Vision AI Loud Reader (OCR + TTS), Whisper speech-to-text live meeting tool, REST & WebSocket API Gateway."
    },
    {
      name: "Diya Payal",
      regNo: "25BCE11416",
      role: "Accessibility & AI Engine Specialist",
      contributions: "AI alt-text context evaluator, Vision OCR engine for documents/signs, AI prompt templates."
    },
    {
      name: "Eshaan Dogra",
      regNo: "25BCE10675",
      role: "UX/UI & Compliance Specialist",
      contributions: "Color Vision Deficiency Simulator, WCAG AA/AAA contrast calculator, High-Contrast Yellow/Black & OpenDyslexic UI modes."
    },
    {
      name: "Ayushi Gupta",
      regNo: "25BCE11169",
      role: "AI Vision & Speech Synthesis Developer",
      contributions: "Core React 18 / Vite app layout, Chrome Extension simulator widget, split-screen meeting view & audio visualizer canvas."
    },
    {
      name: "Kunwar Singh",
      regNo: "25BCE11021",
      role: "Integration / Testing Developer",
      contributions: "Developer REST & WebSocket API Sandbox, Chrome Extension simulator widget, downloadable PDF/JSON report exporters."
    }
  ];

  const features = [
    {
      id: 'ocr',
      title: 'Vision AI OCR Loud Reader',
      category: 'Blind & Low-Vision UX',
      tagColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
      icon: Volume2,
      description: 'Upload documents, signs, or bills. AI extracts verbatim text and synthesizes natural Speech-to-Text audio without preamble prefixes.',
      action: 'Open Vision Reader'
    },
    {
      id: 'meeting',
      title: 'Google Meet Live Captions & Taskbar',
      category: 'Deaf & Hard-of-Hearing UX',
      tagColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-300',
      icon: Mic,
      description: 'Real-time speech transcription with speaker diarization, yellow-black high contrast subtitles, and floating Google Meet extension control widget.',
      action: 'Launch Live Captions'
    },
    {
      id: 'alt-text',
      title: 'AI Alt-Text Context Evaluator',
      category: 'AI Vision Review',
      tagColor: 'bg-cyan-500/10 text-cyan-700 border-cyan-300',
      icon: ScanSearch,
      description: 'Scores images for alt-text quality, detects missing descriptive context, and provides instant WCAG-compliant alt text recommendations.',
      action: 'Evaluate Alt-Text'
    },
    {
      id: 'cvd',
      title: 'Color Vision Deficiency Simulator',
      tag: 'CVD Vision Simulation',
      category: 'Vision Simulation',
      tagColor: 'bg-amber-500/10 text-amber-800 border-amber-300',
      icon: Eye,
      description: 'Simulate Deuteranopia, Protanopia, Tritanopia, and Achromatopsia using Brettel and Machado matrix color transforms in real time.',
      action: 'Run CVD Simulator'
    },
    {
      id: 'contrast',
      title: 'WCAG 2.1/2.2 AA Contrast Engine',
      category: 'Compliance Suite',
      tagColor: 'bg-blue-500/10 text-blue-700 border-blue-300',
      icon: ShieldCheck,
      description: 'Calculates relative luminance via piecewise sRGB companding and alpha compositing. Generates compliant UI palettes in HSL space.',
      action: 'Check WCAG Contrast'
    },
    {
      id: 'extension',
      title: 'Chrome Extension DOM Inspector',
      category: 'DOM Audit',
      tagColor: 'bg-purple-500/10 text-purple-700 border-purple-300',
      icon: Sliders,
      description: 'Audit webpage DOM elements for missing alt text, unlabeled controls, skipped heading levels, and side-by-side code fixes.',
      action: 'Open DOM Inspector'
    },
    {
      id: 'api',
      title: 'REST & WebSocket API Gateway',
      category: 'Developer Sandbox',
      tagColor: 'bg-orange-500/10 text-orange-700 border-orange-300',
      icon: Code,
      description: 'Interactive API sandbox to test endpoints `/api/v1/vision/read-explain`, `/api/v1/scan/url`, and `wss://stream.accessai.io` with code snippets.',
      action: 'Test API Endpoints'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 px-4 sm:px-6 py-6 font-sans">
      
      {/* White-Themed Minimalist Hero Section */}
      <section className="relative bg-white border border-stone-200 rounded-3xl p-8 md:p-14 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-stone-100 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="space-y-6 max-w-4xl relative z-10">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-100/80 text-amber-950 border border-amber-300 text-xs px-3.5 py-1 rounded-full font-extrabold tracking-wide flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              INTELLIGENT ACCESSIBLE ECOSYSTEM
            </span>
            <span className="bg-stone-100 text-stone-700 border border-stone-200 text-xs px-3.5 py-1 rounded-full font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WCAG 2.1 / 2.2 AA Standard
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-stone-950 tracking-tight leading-[1.05]">
            Access<span className="text-amber-600">AI</span> Platform
          </h1>

          <p className="text-stone-600 text-lg md:text-xl font-normal leading-relaxed max-w-3xl">
            An end-to-end accessible suite featuring Vision AI Loud Reader for document OCR, Real-Time Google Meet Captions with speaker diarization, CVD color vision simulation, and WCAG contrast validation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('ocr')}
              className="px-6 py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-extrabold text-sm transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2.5"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Try Vision AI Reader</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => setActiveTab('meeting')}
              className="px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-stone-900" />
              <span>Launch Live Captions</span>
            </button>

            <button
              onClick={() => setActiveTab('cvd')}
              className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-extrabold text-sm transition-all duration-300 flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-amber-600" />
              <span>CVD Simulator</span>
            </button>
          </div>

        </div>
      </section>

      {/* Feature Showcase Grid Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-700 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Interactive Accessibility Suite
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-950 tracking-tight">
              Explore All Features
            </h2>
          </div>
          <p className="text-stone-500 text-sm max-w-md">
            Click on any feature card below to instantly launch and interact with the live tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className="group bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-5 transform hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${feat.tagColor}`}>
                      {feat.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-stone-950 group-hover:text-amber-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed mt-2">
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-black text-stone-900 group-hover:text-amber-600">
                  <span>{feat.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team & Architecture Credits Section */}
      <section className="bg-stone-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Core Development Team
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Project Architects & Contributors
            </h3>
          </div>
          <div className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-full text-xs font-bold text-stone-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> VIT Vellore Accessible AI Project
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div 
              key={idx}
              className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 hover:border-amber-400/50 transition-colors duration-300 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-white">{member.name}</h4>
                <span className="text-[10px] font-mono bg-stone-800 text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                  {member.regNo}
                </span>
              </div>
              <p className="text-xs font-bold text-amber-400">{member.role}</p>
              <p className="text-xs text-stone-400 leading-relaxed font-normal">
                {member.contributions}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
