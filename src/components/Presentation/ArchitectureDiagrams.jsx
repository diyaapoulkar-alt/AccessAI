import React from 'react';
import { Layers, Cpu, ShieldCheck, Volume2, Mic, Globe, Server, Database, Sparkles } from 'lucide-react';

export default function ArchitectureDiagrams() {
  return (
    <div className="space-y-6">
      
      {/* System Architecture Flow Diagram */}
      <div className="bg-white text-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Minimalistic White Architecture</span>
            <h3 className="text-xl font-extrabold text-slate-900">AccessAI End-to-End System Architecture</h3>
          </div>
          <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-semibold border border-blue-200">
            Microservices & AI Pipeline
          </span>
        </div>

        {/* Visual Schematics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Layer 1: Client Interfaces */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
              <Globe className="w-4 h-4" /> Layer 1: Clients
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Browser Extension Inspector</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Web App Dashboard</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Accessible Meeting Tool</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Vision Image Loud Reader</li>
            </ul>
          </div>

          {/* Layer 2: API Gateway & WebSocket */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <Server className="w-4 h-4" /> Layer 2: Gateway
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">REST API Gateway</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">WebSocket Stream Manager</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Authentication & Auth Tokens</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Rate Limiter & CORS Router</li>
            </ul>
          </div>

          {/* Layer 3: AI Core Processing Engines */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" /> Layer 3: AI Engines
            </div>
            <ul className="space-y-2 text-xs text-slate-800 font-medium">
              <li className="p-2 bg-white rounded border border-blue-200 shadow-2xs font-semibold text-blue-900">
                Alt-Text AI Evaluator
              </li>
              <li className="p-2 bg-white rounded border border-blue-200 shadow-2xs font-semibold text-emerald-900">
                Vision OCR & Loud Reader
              </li>
              <li className="p-2 bg-white rounded border border-blue-200 shadow-2xs font-semibold text-purple-900">
                Whisper STT Transcriber
              </li>
              <li className="p-2 bg-white rounded border border-blue-200 shadow-2xs font-semibold text-amber-900">
                WCAG Contrast Calculator
              </li>
            </ul>
          </div>

          {/* Layer 4: Storage & Exporters */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4" /> Layer 4: Outputs
            </div>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">WCAG Audit PDF Reports</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Live Captions Stream</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">TTS Speech Audio Files</li>
              <li className="p-2 bg-white rounded border border-slate-200 shadow-2xs">Code Fix Snippets Diff</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
