import React from 'react';
import { 
  Volume2, 
  Mic, 
  Eye, 
  ShieldCheck, 
  Code, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Sliders,
  Users,
  Award
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
      id: 'vision',
      title: 'Vision AI Loud Reader',
      tag: 'Blind & Low-Vision UX',
      tagColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      icon: Volume2,
      description: 'Upload images or take snapshots of prescriptions, signs, or bills. AI extracts OCR text and synthesizes plain-language TTS explanations.',
      action: 'Open Vision Reader'
    },
    {
      id: 'meeting',
      title: 'Hearing Assistant & Live Captions',
      tag: 'Deaf & Hard-of-Hearing UX',
      tagColor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      icon: Mic,
      description: 'Real-time speech transcription with high-contrast overlay mode, OpenDyslexic typography, scalable captions, and AI takeaways.',
      action: 'Start Live Captions'
    },
    {
      id: 'cvd',
      title: 'Color Vision Deficiency Simulator',
      tag: 'CVD Vision Simulation',
      tagColor: 'bg-amber-50 text-amber-900 border-amber-200',
      icon: Eye,
      description: 'Simulates Deuteranopia, Protanopia, Tritanopia, and Achromatopsia using Brettel and Machado color transform matrices with split-screen view.',
      action: 'Run CVD Simulator'
    },
    {
      id: 'contrast',
      title: 'WCAG 2.1/2.2 AA Contrast & Palette Generator',
      tag: 'Compliance Engine',
      tagColor: 'bg-blue-50 text-blue-900 border-blue-200',
      icon: ShieldCheck,
      description: 'Calculates relative luminance via piecewise sRGB companding and alpha compositing. Generates compliant UI palettes in HSL space.',
      action: 'Check WCAG Contrast'
    },
    {
      id: 'extension',
      title: 'Chrome Extension DOM Inspector Widget',
      tag: 'In-Page Audit',
      tagColor: 'bg-purple-50 text-purple-900 border-purple-200',
      icon: Sliders,
      description: 'Inspects DOM elements for missing alt text, unlabeled controls, skipped heading levels, and side-by-side code fixes.',
      action: 'Open DOM Inspector'
    },
    {
      id: 'api',
      title: 'Backend REST & WebSocket API Gateway',
      tag: 'Developer Sandbox',
      tagColor: 'bg-orange-50 text-orange-900 border-orange-200',
      icon: Code,
      description: 'Interactive API sandbox to test endpoints `/api/v1/vision/read-explain`, `/api/v1/scan/url`, and `wss://stream.accessai.io` with code snippets.',
      action: 'Test API Endpoints'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-4">
      
      {/* Clean Hero Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="space-y-4 max-w-4xl relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Next-Gen Web Accessibility Platform
            </span>
            <span className="bg-stone-100 text-stone-700 border border-stone-200 text-xs px-3 py-1 rounded-full font-bold">
              WCAG 2.1/2.2 AA Standard
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
            AccessAI <span className="text-amber-700">Platform</span>
          </h1>

          <p className="text-stone-600 text-base md:text-lg leading-relaxed font-normal max-w-3xl">
            An end-to-end accessibility platform featuring Vision AI Loud Reader for blind users, Real-Time Whisper Captions for deaf users, CVD color simulation, WCAG contrast validation, and in-page DOM audit tools.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('vision')}
              className="px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition duration-200 shadow-sm flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" /> Vision AI Loud Reader
            </button>

            <button
              onClick={() => setActiveTab('meeting')}
              className="px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-bold text-xs sm:text-sm transition duration-200 flex items-center gap-2"
            >
              <Mic className="w-4 h-4 text-indigo-500" /> Live Meeting Captions
            </button>

            <button
              onClick={() => setActiveTab('cvd')}
              className="px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 font-bold text-xs sm:text-sm transition duration-200 flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-amber-600" /> CVD Simulator
            </button>
          </div>
        </div>
      </div>

      {/* Feature Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-700" /> Platform Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-900 group-hover:scale-105 transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-base leading-snug">{item.title}</h3>
                  </div>

                  <p className="text-xs text-stone-600 font-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-amber-800">
                  <span>{item.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Team & Major Technical Contributions */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-extrabold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-700" /> Project Team & Technical Contributions
          </h2>
          <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            AccessAI Team Members
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">{member.name}</h3>
                  <span className="text-xs font-mono text-amber-700 font-bold">{member.regNo}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">Project Role</span>
                <p className="text-xs font-bold text-stone-900">{member.role}</p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">Major Contribution</span>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {member.contributions}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
