import React, { useState } from 'react';
import { 
  CVDSimulatorToolbar, 
  CVDPreviewWrapper, 
  useCVD, 
  CVD_METADATA, 
  simulateCVDColor 
} from '../../cvd';
import { 
  Eye, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  SlidersHorizontal, 
  Activity, 
  FileCheck, 
  CheckCircle2, 
  XCircle,
  Upload,
  Image as ImageIcon,
  Layout
} from 'lucide-react';

export default function CvdView() {
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

  const [activeStage, setActiveStage] = useState('dashboard'); // 'dashboard' or 'custom'
  const [uploadedImage, setUploadedImage] = useState(null);

  const currentMetadata = CVD_METADATA[type];

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setUploadedImage(evt.target.result);
      setActiveStage('custom');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 py-4">
      
      {/* Clean Header */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-xs">
              <Eye className="w-3.5 h-3.5 text-amber-700" /> Color Vision Deficiency Simulator
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight">
              CVD Simulation & Token Inspector
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-2xl font-normal">
              Simulate Deuteranopia, Protanopia, Tritanopia, and Achromatopsia using exact Brettel and Machado transform matrices. Engineered by <strong className="font-semibold text-stone-900">Eshaan Dogra</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Custom UI / Image</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {isSimulating && (
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 shadow-xs shrink-0">
                {currentMetadata.category}: {currentMetadata.label} ({Math.round(severity * 100)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm">
        <CVDSimulatorToolbar
          currentType={type}
          severity={severity}
          comparisonMode={comparisonMode}
          onTypeChange={setCvdType}
          onSeverityChange={setSeverity}
          onModeChange={setComparisonMode}
          onReset={reset}
        />
      </div>

      {/* Stage Selector Tabs */}
      <div className="flex items-center justify-between bg-white border border-stone-200/90 rounded-2xl px-5 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveStage('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeStage === 'dashboard'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" /> Live Dashboard Mockup Stage
          </button>

          <button
            onClick={() => setActiveStage('custom')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              activeStage === 'custom'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Uploaded Screenshot / Chart Stage
          </button>
        </div>

        <span className="text-xs text-stone-500 font-mono hidden sm:inline">
          Drag split handle ↔ to compare trichromat vs simulated view
        </span>
      </div>

      {/* Simulation Stage */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm">
        <CVDPreviewWrapper
          type={type}
          severity={severity}
          comparisonMode={comparisonMode}
          splitPosition={splitPosition}
          onSplitChange={setSplitPosition}
        >
          {activeStage === 'dashboard' ? (
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 space-y-6 text-white min-h-[380px] flex flex-col justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
                    <span>WCAG AA Score</span>
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-white">96.4%</div>
                  <div className="mt-1 flex items-center text-xs text-emerald-400 font-semibold gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +4.2% compliant
                  </div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
                    <span>Contrast Warnings</span>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-amber-400">2 Warnings</div>
                  <div className="mt-1 text-xs text-amber-400/90">Secondary button contrast</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
                    <span>Contrast Ratio</span>
                    <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-sky-400">5.42:1</div>
                  <div className="mt-1 text-xs text-sky-300">Exceeds 4.5:1 AA</div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium">
                    <span>DOM Elements</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-purple-400">1,840</div>
                  <div className="mt-1 text-xs text-purple-300">Active scan complete</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Success: Passed AA</h4>
                    <p className="text-xs text-stone-300 mt-1">Navigation links maintain compliant focus boundaries.</p>
                  </div>
                </div>

                <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Warning: Color Reliance</h4>
                    <p className="text-xs text-stone-300 mt-1">Color alone indicates required input fields.</p>
                  </div>
                </div>

                <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Error: Low Contrast</h4>
                    <p className="text-xs text-stone-300 mt-1">Ratio of 2.1:1 fails AA requirements.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 min-h-[380px] flex flex-col items-center justify-center">
              {uploadedImage ? (
                <img
                  src={uploadedImage}
                  alt="Custom UI Test Stage"
                  className="max-h-[500px] w-auto object-contain rounded-xl shadow-md"
                />
              ) : (
                <label className="flex flex-col items-center gap-3 p-8 text-center cursor-pointer hover:opacity-80 transition">
                  <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Upload UI Screenshot or Chart</span>
                    <span className="text-xs text-stone-400 block mt-1">Upload PNG/JPG to test under Deuteranopia, Protanopia, Tritanopia</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          )}
        </CVDPreviewWrapper>
      </div>

      {/* Color Swatch Token Inspector */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Design Token Inspector
            </h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Left: Original · Right: Simulated under {currentMetadata.label}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-3">
          {testSwatches.map((swatch) => {
            const simulatedHex = simulateCVDColor(swatch.hex, type, severity);

            return (
              <div
                key={swatch.label}
                className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-2"
              >
                <span className="text-[11px] font-bold text-stone-800 block truncate">
                  {swatch.label}
                </span>

                <div className="h-9 w-full rounded-lg overflow-hidden flex border border-stone-300 shadow-inner">
                  <div
                    className="w-1/2 h-full"
                    style={{ backgroundColor: swatch.hex }}
                    title={`Original: ${swatch.hex}`}
                  />
                  <div
                    className="w-1/2 h-full"
                    style={{ backgroundColor: simulatedHex }}
                    title={`Simulated: ${simulatedHex}`}
                  />
                </div>

                <div className="text-[10px] font-mono space-y-0.5">
                  <div className="text-stone-500">{swatch.hex}</div>
                  <div className="text-emerald-700 font-bold">{simulatedHex}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
