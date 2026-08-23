import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sliders, 
  Code, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  Copy, 
  Download, 
  Eye, 
  ArrowUpRight,
  HelpCircle,
  BarChart3,
  Layers
} from 'lucide-react';
import { presetWebsites, mockScanIssues } from '../../data/mockScanData';
import { calculateContrastRatio, getWCAGRating } from '../../utils/contrastChecker';

export default function ScannerDashboard() {
  const [selectedSite, setSelectedSite] = useState(presetWebsites[0]);
  const [targetUrl, setTargetUrl] = useState(presetWebsites[0].url);
  const [isScanning, setIsScanning] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('issues');
  const [selectedIssue, setSelectedIssue] = useState(mockScanIssues[0]);
  const [visionFilter, setVisionFilter] = useState('normal');
  const [copiedCode, setCopiedCode] = useState(false);

  // Custom contrast test state
  const [fgColor, setFgColor] = useState('#9CA3AF');
  const [bgColor, setBgColor] = useState('#D1E5F0');

  const handleRunScan = (e) => {
    if (e) e.preventDefault();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleSelectPreset = (site) => {
    setSelectedSite(site);
    setTargetUrl(site.url);
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 900);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const contrastRatio = calculateContrastRatio(fgColor, bgColor);
  const wcagRating = getWCAGRating(contrastRatio);

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      {/* Header Banner & URL Input */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> AI Meaningful Accessibility Scanner
              </span>
              <span className="text-xs text-slate-400">WCAG 2.1 / 2.2 AA Evaluator</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Evaluate Web Accessibility with AI Precision
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed mt-1">
              Standard checkers only verify if an HTML attribute exists. <strong className="text-blue-400">AccessAI</strong> uses machine learning models to assess whether fixes are actually <strong className="text-emerald-400">meaningful and usable</strong> for screen reader users and people with disabilities.
            </p>
          </div>

          {/* URL Scan Bar */}
          <form onSubmit={handleRunScan} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="Enter website URL to scan (e.g. https://shopease-demo.store)"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isScanning}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shrink-0"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning DOM & AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Run AI Audit</span>
                </>
              )}
            </button>
          </form>

          {/* Target Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Target Presets:</span>
            {presetWebsites.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSelectPreset(site)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  selectedSite.id === site.id
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 font-bold'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{site.name}</span>
                <span className="text-[10px] opacity-70">({site.category})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Site Score Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Score Card */}
        <div className="glass-card p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">AccessAI Score</span>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-baseline gap-1">
              <span>{selectedSite.overallScore}</span>
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="text-[11px] text-blue-400 font-medium">WCAG 2.1 AA Target</span>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-blue-500/40 border-t-blue-400 flex items-center justify-center font-bold text-lg text-blue-300">
            {selectedSite.overallScore}%
          </div>
        </div>

        {/* Total Issues */}
        <div className="glass-card p-5 bg-slate-900/60 border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Total Issues Found</span>
          <div className="text-2xl font-bold text-white mt-1">{selectedSite.totalIssues}</div>
          <span className="text-[11px] text-slate-400">Across 5 DOM Categories</span>
        </div>

        {/* Critical Barriers */}
        <div className="glass-card p-5 bg-slate-900/60 border-rose-500/30">
          <span className="text-xs text-rose-400 uppercase font-semibold">Critical Barriers</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">{selectedSite.criticalCount}</div>
          <span className="text-[11px] text-rose-300/80">Blocks Screen Readers</span>
        </div>

        {/* High Priority */}
        <div className="glass-card p-5 bg-slate-900/60 border-amber-500/30">
          <span className="text-xs text-amber-400 uppercase font-semibold">High Priority</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">{selectedSite.highCount}</div>
          <span className="text-[11px] text-amber-300/80">Severe Usability Obstacle</span>
        </div>

        {/* Medium/Low */}
        <div className="glass-card p-5 bg-slate-900/60 border-slate-800">
          <span className="text-xs text-slate-400 uppercase font-semibold">Medium / Low</span>
          <div className="text-2xl font-bold text-slate-200 mt-1">{selectedSite.mediumCount + selectedSite.lowCount}</div>
          <span className="text-[11px] text-slate-400">Enhancements Needed</span>
        </div>

      </div>

      {/* Audit Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'issues', label: 'Issues Audit List', icon: ShieldAlert },
          { id: 'alt-text', label: 'Alt-Text AI Evaluator', icon: Sparkles },
          { id: 'contrast', label: 'Color Vision Simulator', icon: Eye },
          { id: 'dom', label: 'Heading Hierarchy Tree', icon: Layers },
          { id: 'remediation', label: 'Code Remediation Studio', icon: Code },
          { id: 'report', label: 'Compliance Audit Report', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Issues Audit List */}
      {activeSubTab === 'issues' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Issue Selection List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Detected Accessibility Findings ({mockScanIssues.length})
            </h3>

            {mockScanIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className={`glass-card p-4 cursor-pointer transition-all border ${
                  selectedIssue.id === issue.id
                    ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/20'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    issue.impact === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    issue.impact === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {issue.impact}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{issue.id}</span>
                </div>
                <h4 className="font-bold text-sm text-white line-clamp-1">{issue.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{issue.description}</p>
              </div>
            ))}
          </div>

          {/* Detailed Issue Inspector Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 bg-slate-900/80 border-slate-800 space-y-6">
              
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400">{selectedIssue.wcagRule}</span>
                  <span className="text-xs font-bold text-rose-400">{selectedIssue.scorePenalty} pts</span>
                </div>
                <h3 className="text-xl font-extrabold text-white">{selectedIssue.title}</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">Selector: {selectedIssue.selector}</p>
              </div>

              {/* AI vs Standard Rule Comparison Box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Rule-Based vs AI Evaluation Comparison
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Standard WCAG Rule Checker</span>
                    <span className="text-xs font-bold text-emerald-400 mt-1 block">
                      {selectedIssue.ruleVsAi?.standardCheck || "Checks syntax presence only"}
                    </span>
                  </div>

                  <div className="bg-rose-950/30 p-3 rounded-lg border border-rose-500/30">
                    <span className="text-[11px] text-rose-300 block font-medium">AccessAI ML Usability Model</span>
                    <span className="text-xs font-bold text-rose-400 mt-1 block">
                      {selectedIssue.ruleVsAi?.aiEvaluation || "FAIL: Suboptimal usability"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  <strong>Why this matters:</strong> {selectedIssue.ruleVsAi?.whyItMatters || selectedIssue.description}
                </p>
              </div>

              {/* Element Code Snippet */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">Target DOM Element</span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-rose-300 font-mono overflow-x-auto">
                  {selectedIssue.element}
                </pre>
              </div>

              {/* AI Remediation Recommendation */}
              <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/30 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI Recommended Code Fix
                </h4>
                <p className="text-xs text-emerald-200">{selectedIssue.remediationExplanation}</p>
                <div className="relative">
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-emerald-300 font-mono overflow-x-auto">
                    {selectedIssue.fixedCode}
                  </pre>
                  <button
                    onClick={() => handleCopyCode(selectedIssue.fixedCode)}
                    className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Sub-Tab 2: Alt-Text AI Evaluator */}
      {activeSubTab === 'alt-text' && (
        <div className="glass-card p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI Meaningful Alt-Text Evaluator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrating the difference between standard alt attribute existence checks vs AccessAI semantic evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Example 1: Generic Alt Text */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="h-44 w-full rounded-lg overflow-hidden relative bg-slate-900 border border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80" 
                  alt="chart.png" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-slate-950/90 text-slate-300 text-xs font-mono px-2 py-1 rounded">
                  alt="chart.png"
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Traditional WCAG Checker:</span>
                  <span className="text-emerald-400 font-bold">PASS (Attribute exists)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">AccessAI Meaningfulness Score:</span>
                  <span className="text-rose-400 font-bold">15% (Useless to blind user)</span>
                </div>
              </div>

              <div className="bg-rose-950/30 p-3 rounded-lg border border-rose-500/30">
                <span className="text-xs font-bold text-rose-400 block">AI Finding:</span>
                <p className="text-xs text-rose-200 mt-0.5">
                  The alt description 'chart.png' tells a screen reader user nothing about the 24% revenue increase or quarterly sales metrics shown in the graphic.
                </p>
              </div>
            </div>

            {/* Example 2: AI Remediation */}
            <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 space-y-4">
              <div className="h-44 w-full rounded-lg overflow-hidden relative bg-slate-900 border border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80" 
                  alt="Infographic showing Q2 revenue growth of 24% reaching $4.2 million, led by Cloud Services" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-emerald-950/90 text-emerald-300 text-[11px] font-mono px-2 py-1 rounded border border-emerald-500/40">
                  AI Generated Semantic Description
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Traditional WCAG Checker:</span>
                  <span className="text-emerald-400 font-bold">PASS</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">AccessAI Meaningfulness Score:</span>
                  <span className="text-emerald-400 font-bold">98% (Fully Informative)</span>
                </div>
              </div>

              <div className="bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 block">AI Recommended Alt Text:</span>
                <p className="text-xs text-emerald-200 mt-0.5 font-mono">
                  alt="Infographic showing Q2 revenue growth of 24% reaching $4.2 million, led by Cloud Services"
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sub-Tab 3: Color Vision Simulator */}
      {activeSubTab === 'contrast' && (
        <div className="glass-card p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                Color Contrast & Vision Deficiency Simulator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulate how target page UI elements appear to users with Deuteranopia, Protanopia, Tritanopia, and Achromatopsia.
              </p>
            </div>

            {/* Vision Mode Selectors */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'normal', name: 'Normal' },
                { id: 'deuteranopia', name: 'Deuteranopia' },
                { id: 'protanopia', name: 'Protanopia' },
                { id: 'tritanopia', name: 'Tritanopia' },
                { id: 'achromatopsia', name: 'Achromatopsia' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setVisionFilter(filter.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    visionFilter === filter.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contrast Calculator Tool */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Live Rendered Element Preview with SVG Vision Filters */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
              <span className="text-xs font-semibold text-slate-400 block">
                Target Button Render under <strong className="text-blue-400 uppercase">{visionFilter}</strong> filter:
              </span>

              <div 
                className={`p-8 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-3 transition-all ${
                  visionFilter === 'achromatopsia' ? 'filter-achromatopsia' : ''
                }`}
                style={{ backgroundColor: bgColor }}
              >
                <button
                  className="px-6 py-3 rounded-xl font-bold text-sm shadow-md"
                  style={{ color: fgColor, backgroundColor: '#D1E5F0', border: '1px solid ' + fgColor }}
                >
                  Complete Purchase ($149)
                </button>
                <span className="text-xs font-mono" style={{ color: fgColor }}>
                  Sample text label
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-300">Contrast Ratio: <strong className="text-white font-mono text-sm">{contrastRatio}:1</strong></span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded ${
                  wcagRating.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {wcagRating.rating} ({wcagRating.status.toUpperCase()})
                </span>
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white">Adjust Foreground & Background Hex</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Foreground Text Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-slate-900 border border-slate-700" 
                    />
                    <input 
                      type="text" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white flex-1" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 mb-1 block">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-slate-900 border border-slate-700" 
                    />
                    <input 
                      type="text" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white flex-1" 
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => { setFgColor('#1E3A8A'); setBgColor('#DBEAFE'); }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-all"
                  >
                    Apply AI Suggested High-Contrast Palette (#1E3A8A / #DBEAFE)
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Sub-Tab 4: DOM Heading Structure Hierarchy */}
      {activeSubTab === 'dom' && (
        <div className="glass-card p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              DOM Heading Structure & ARIA Tree Auditor
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualizing document outline hierarchy to catch skipped heading levels and unlinked form labels.
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">H1</span>
                <span className="text-white font-semibold">ShopEase Online Store</span>
              </div>
              <span className="text-emerald-400 text-[11px]">✔ Valid Single H1</span>
            </div>

            <div className="pl-6 space-y-3 border-l-2 border-slate-800 ml-4">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded">H2</span>
                  <span className="text-white">Summer Sale Recommendations</span>
                </div>
                <span className="text-emerald-400 text-[11px]">✔ Proper Nesting</span>
              </div>

              <div className="pl-6 space-y-2 border-l-2 border-rose-500/40 ml-4">
                <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded">H4</span>
                    <span className="text-rose-200">Customer Testimonials (SKIPPED H3)</span>
                  </div>
                  <span className="text-rose-400 text-[11px] font-bold">✘ Error: H3 Skipped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 5 & 6: Code Remediation & Compliance Exporter */}
      {(activeSubTab === 'remediation' || activeSubTab === 'report') && (
        <div className="glass-card p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                WCAG 2.1 AA Compliance Audit Report
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Generated for target host <strong className="text-white">{targetUrl}</strong> on {new Date().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => alert('Exporting PDF audit report...')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF / JSON Report</span>
            </button>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white">Executive Compliance Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">WCAG Level AA Pass Rate</span>
                <div className="text-xl font-extrabold text-blue-400 mt-1">78%</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Meaningful Alt Text Index</span>
                <div className="text-xl font-extrabold text-amber-400 mt-1">62%</div>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Screen Reader Usability Score</span>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">Good</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
