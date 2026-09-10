import React, { useState } from 'react';
import { Sliders, Search, CheckCircle2, AlertTriangle, Layers, FileCode, Check } from 'lucide-react';

export default function ExtensionInspectorView() {
  const [targetUrl, setTargetUrl] = useState('https://example.com/mock-portal');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState({
    imagesTotal: 14,
    missingAlt: 3,
    unlabeledButtons: 2,
    emptyLinks: 1,
    headingIssues: 2,
    contrastViolations: 4,
    wcagScore: 82
  });

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="space-y-2">
          <span className="bg-purple-50 text-purple-900 border border-purple-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-xs">
            <Sliders className="w-3.5 h-3.5 text-purple-700" /> Chrome Extension In-Page DOM Inspector
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            Browser Overlay & In-Page Audit Simulator
          </h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-3xl font-normal">
            Inspects target web pages and mock DOM trees for missing alt text, unlabeled controls, skipped heading levels, and contrast violations. Engineered by <strong className="font-semibold text-stone-900">Ayushi Gupta & Eshaan Dogra</strong>.
          </p>
        </div>
      </div>

      {/* URL Target & Controls */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <label className="text-xs font-bold text-stone-800 block">Target Page URL for Live In-Page Audit</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-full pl-11 pr-4 py-3 text-xs sm:text-sm font-mono font-bold text-stone-800 focus:outline-none focus:border-stone-400 shadow-xs"
            />
          </div>
          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center gap-2 shrink-0"
          >
            {isAuditing ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isAuditing ? 'Auditing DOM...' : 'Run In-Page Audit'}</span>
          </button>
        </div>
      </div>

      {/* Audit Results Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Metric Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <h3 className="font-extrabold text-stone-900 text-base">WCAG Compliance Score</h3>
              <span className="text-xl font-mono font-extrabold text-emerald-700">{auditReport.wcagScore}%</span>
            </div>

            <div className="space-y-2.5 text-xs font-medium text-stone-700">
              <div className="flex items-center justify-between bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span>Images Inspected</span>
                <span className="font-mono font-bold text-stone-900">{auditReport.imagesTotal}</span>
              </div>

              <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-950">
                <span>Missing Alt Text</span>
                <span className="font-mono font-bold text-rose-700">{auditReport.missingAlt}</span>
              </div>

              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950">
                <span>Unlabeled Buttons</span>
                <span className="font-mono font-bold text-amber-700">{auditReport.unlabeledButtons}</span>
              </div>

              <div className="flex items-center justify-between bg-amber-50 p-3 rounded-xl border border-amber-200 text-amber-950">
                <span>Empty Links</span>
                <span className="font-mono font-bold text-amber-700">{auditReport.emptyLinks}</span>
              </div>

              <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-950">
                <span>Contrast Ratio Violations</span>
                <span className="font-mono font-bold text-rose-700">{auditReport.contrastViolations}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DOM Remediation Diff Code Box */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-700" />
                <h3 className="font-extrabold text-stone-900 text-lg">Side-by-Side Code Remediation</h3>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full">
                AI Fixed Code
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Original Non-Compliant Markup
                </span>
                <pre className="bg-stone-900 p-4 rounded-xl border border-stone-800 text-xs font-mono text-rose-300 overflow-x-auto shadow-inner leading-relaxed">
{`<img src="prescription.png">
<button onClick="submit()"></button>
<a href="/portal"></a>`}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AccessAI Remediated Accessible Markup
                </span>
                <pre className="bg-stone-900 p-4 rounded-xl border border-stone-800 text-xs font-mono text-emerald-300 overflow-x-auto shadow-inner leading-relaxed">
{`<img src="prescription.png" 
  alt="Amoxicillin 500mg dosage label">
<button aria-label="Submit Form">Submit</button>
<a href="/portal">Patient Portal</a>`}
                </pre>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
