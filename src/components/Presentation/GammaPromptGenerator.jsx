import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, Layers, ArrowRight, Monitor, Share2, CheckCircle2, Image as ImageIcon, Grid } from 'lucide-react';
import ArchitectureDiagrams from './ArchitectureDiagrams';

export default function GammaPromptGenerator() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const enhancedGammaPromptText = `Create a sleek, highly professional, modern presentation for "AccessAI: AI-Powered Web Accessibility Scanner & Real-Time Inclusive Meeting Platform".

GENERAL DESIGN DIRECTIVES:
- Theme: Minimalistic white background theme (#FFFFFF background, deep navy/slate typography #0F172A, subtle indigo #3B82F6 & emerald #10B981 accent card borders).
- Layout Style: Clean card grid containers, split-screen content boxes, structured key-value feature cards, rounded metric boxes, and visual image placeholders.
- Visual Assets: Include minimal white-themed vector illustrations, UI screen mockups, and system architecture flowchart images.

SLIDE-BY-SLIDE CARD LAYOUT BLUEPRINT:

--- SLIDE 1: Title of the Project ---
[Slide Layout: Hero Banner with Centered Card Box & Accent Badge]
- Header Badge: [Pill Badge: AI-Powered Accessibility Platform]
- Main Title: AccessAI - Next-Generation AI Web Accessibility Scanner & Inclusive Real-Time Platform
- Subtitle: Evaluating Meaningful WCAG Compliance, Vision Loud Reading for Blind Users & Live Captions for Deaf Users
- [Hero Card Box]:
  - Presenter: Engineering Project Team
  - Date: August 2026 | Platform Version: v2.4 Release
- [Image Placeholder]: Clean minimalist white vector illustration of an AI engine scanning web DOM elements and outputting audio waves & captions.

--- SLIDE 2: Problem Statement / Objective / Scope of the Project ---
[Slide Layout: 3-Column Card Grid]

- [Card Box 1: The Problem]
  - Icon/Header: ⚠️ Traditional Compliance Gaps
  - Content: Rule-based checkers only verify technical attribute existence, approving useless tags like alt="image123.jpg".
  - Sub-Card: Visually impaired users lack context-aware image explanations and loud-reading tools for daily printed text. Deaf users lack zero-install real-time meeting subtitles.

- [Card Box 2: Project Objective]
  - Icon/Header: 🎯 Meaningful Accessibility
  - Content: Build AccessAI to evaluate whether accessibility fixes are truly MEANINGFUL and usable using AI vision and speech models.
  - Sub-Card: Deliver automated one-click remediation, color vision deficiency simulation, and real-time caption sync.

- [Card Box 3: Scope & Modules]
  - Icon/Header: 🚀 Core Platform Scope
  - Content: 4 Integrated Modules: (1) AI Web Scanner (2) Vision Loud Reader for Blind Users (3) Live Meeting Tool for Deaf Users (4) Developer API & Chrome Extension.
- [Image Placeholder]: Side-by-side comparison mockup showing standard rule pass vs AccessAI meaningful evaluation alert.

--- SLIDE 3: Hardware / Software Requirement ---
[Slide Layout: 2-Column Split Cards with Stat Boxes]

- [Left Container Card: Hardware Requirements]
  - Card Title: 💻 Client Hardware Specifications
  - Box 1: Client Devices — Any modern PC, Mac, Chromebook, Tablet, or Smartphone.
  - Box 2: Audio Input — Standard built-in microphone for live speech transcription.
  - Box 3: Camera / File Input — Standard camera or drag-and-drop image file support.

- [Right Container Card: Software & Framework Requirements]
  - Card Title: 🛠️ Software & AI Tech Stack
  - Box 1: Frontend Engine — React 18, Vite, Tailwind CSS, Lucide Icons.
  - Box 2: Voice & AI Models — Web Speech Synthesis (TTS), Web Speech Recognition / Whisper AI model (STT).
  - Box 3: Protocol & Standards — WebSockets / BroadcastChannel API, WCAG 2.1 & 2.2 Level AA / AAA.
- [Image Placeholder]: Clean vector graphic displaying hardware devices (laptop, phone) syncing with cloud AI APIs.

--- SLIDE 4: Architecture Diagram / Process Flow / Timeline ---
[Slide Layout: Full-Width Architecture Diagram Card + 4-Phase Horizontal Process Flow]

- [Top Full-Width Card: System Architecture Schematics]
  - Card Header: 🏗️ End-to-End System Microservices
  - Layer 1 (Client): Extension Inspector, Web Dashboard, Vision Loud Reader, Meeting Subtitles.
  - Layer 2 (Gateway): REST API Gateway, WebSocket Stream Router.
  - Layer 3 (AI Core): Alt-Text Semantic Evaluator, Vision OCR Engine, Whisper Speech Model, Contrast Calculator.
  - Layer 4 (Output): TTS Audio Stream, Subtitles Stream, Side-by-Side Code Fixes.
  - [Image Placeholder]: High-resolution white-background system architecture flowchart diagram.

- [Bottom Process Flow Cards: 4-Phase Timeline]
  - [Phase Card 1]: Month 1 — Core WCAG Scanner & Contrast Calculator
  - [Phase Card 2]: Month 2 — AI Alt-Text Synthesizer & Vision Loud Reader
  - [Phase Card 3]: Month 3 — Live Accessible Meeting Subtitles & WebSockets
  - [Phase Card 4]: Month 4 — Developer API Sandbox & Audit Exporters

--- SLIDE 5: Usability / Application ---
[Slide Layout: 4-Card Grid with Target User Badges]

- [Usability Card 1: Blind & Low-Vision Users]
  - Badge: Vision Assistance
  - Feature: Upload images of prescriptions, signs, or invoices to receive loud reading (TTS) and simple AI explanations.

- [Usability Card 2: Deaf & Hard-of-Hearing Users]
  - Badge: Hearing Assistance
  - Feature: Participate in live meetings with high-contrast yellow-on-black captions and OpenDyslexic font support.

- [Usability Card 3: Web Developers & QA Engineers]
  - Badge: Developer Tooling
  - Feature: Scan target URLs, simulate color vision deficiencies (Deuteranopia, Protanopia, etc.), and copy side-by-side code fixes.

- [Usability Card 4: Enterprise Compliance Officers]
  - Badge: Audit & Governance
  - Feature: Generate downloadable WCAG 2.1/2.2 AA PDF audit reports for executive compliance.
- [Image Placeholder]: Split UI screen showing live captions on left and vision loud reader audio wave on right.

--- SLIDE 6: Contribution of Each Member ---
[Slide Layout: 4 Member Profile Cards Grid]

- [Member Card 1: Lead AI & Frontend Architect]
  - Name/Role: Member 1 - AI & Frontend Lead
  - Key Contribution: Developed React/Vite dashboard, Vision AI Loud Reader, and TTS speech synthesis engine.

- [Member Card 2: Accessibility & Engine Specialist]
  - Name/Role: Member 2 - Accessibility Rule Specialist
  - Key Contribution: Created WCAG rule evaluator, alt-text semantic model, and color contrast simulator.

- [Member Card 3: Real-Time Audio & API Engineer]
  - Name/Role: Member 3 - Real-Time Audio Engineer
  - Key Contribution: Built Whisper speech-to-text live meeting tool, WebSocket stream, and API sandbox.

- [Member Card 4: UX/UI Designer & Auditor]
  - Name/Role: Member 4 - UX & Compliance Specialist
  - Key Contribution: Designed accessible white-themed UI, high-contrast modes, and compliance PDF report exporters.
- [Image Placeholder]: Clean minimalistic icon set representing teamwork, code, AI models, and UI design.

--- SLIDE 7: References ---
[Slide Layout: 2-Column Reference Link Cards with White Minimalist Theme]

- [Left Container Card: Standards & Specifications]
  - Link Card 1: W3C Web Content Accessibility Guidelines (WCAG 2.1 & 2.2 AA/AAA) — w3.org/TR/WCAG21
  - Link Card 2: W3C Web Speech API Specification — W3C Editor's Draft

- [Right Container Card: AI Models & Guidelines]
  - Link Card 3: OpenAI Whisper Speech Recognition Model (Radford et al.)
  - Link Card 4: Chrome DevTools Accessibility Auditing Guidelines
- [Image Placeholder]: Minimalist W3C & WCAG official standards logo watermark on white card background.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(enhancedGammaPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <Grid className="w-3.5 h-3.5" /> Structured Card Layout Prompt
              </span>
              <span className="text-xs text-slate-400">With Image Placeholders & Info Boxes</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
              Gamma AI Presentation Generator Prompt
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Includes explicit <strong className="text-amber-300">layout cards, information containers, image placeholders, and white minimalistic style rules</strong> for all 7 slides.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/30 flex items-center gap-2 transition-all transform hover:scale-105 shrink-0"
          >
            {copiedPrompt ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copiedPrompt ? 'Prompt Copied!' : 'Copy Gamma AI Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Copyable Enhanced Prompt Box */}
      <div className="glass-card p-6 bg-slate-950 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Gamma AI Generation Prompt (With Cards & Image Placeholders)
          </h3>
          <span className="text-xs text-amber-400 font-mono">White Minimalist + Card Containers</span>
        </div>

        <pre className="bg-slate-900 p-5 rounded-xl border border-slate-800 text-xs font-mono text-amber-200/90 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto select-all">
          {enhancedGammaPromptText}
        </pre>
      </div>

      {/* Visual System Architecture Schematics for Slide 4 */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          System Architecture & Workflow Diagram (Slide 4 Image Asset)
        </h3>
        <ArchitectureDiagrams />
      </div>

    </div>
  );
}
