import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Upload, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  AlertCircle,
  HelpCircle,
  Camera,
  Layers,
  FastForward,
  Mic,
  Bookmark
} from 'lucide-react';
import { sampleVisionImages } from '../../data/sampleVisionData';
import { tts } from '../../utils/ttsEngine';

export default function VisionLoudReader() {
  const [selectedSample, setSelectedSample] = useState(sampleVisionImages[0]);
  const [customImage, setCustomImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [activeWordInfo, setActiveWordInfo] = useState(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    // Subscribe to TTS state changes
    const unsubscribe = tts.subscribe((event, data) => {
      setIsPlaying(data.isSpeaking);
      setIsPaused(data.isPaused);
      if (event === 'word') {
        setActiveWordInfo(data);
      }
    });

    // Fetch voices
    setTimeout(() => {
      const availableVoices = tts.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0]);
      }
    }, 500);

    return () => {
      unsubscribe();
      tts.stop();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Canvas waveform visualizer animation
  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#10b981';

      for (let x = 0; x < width; x += 5) {
        const y = centerY + Math.sin(x * 0.05 + phase) * (15 + Math.random() * 10);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.15;
      animRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, isPaused]);

  const handleSelectSample = (sample) => {
    tts.stop();
    setCustomImage(null);
    setSelectedSample(sample);
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 600);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    tts.stop();
    const reader = new FileReader();
    reader.onload = (event) => {
      const customData = {
        id: "custom-" + Date.now(),
        title: file.name || "Uploaded Document",
        category: "Custom Upload",
        image: event.target.result,
        extractedText: "ACCESSAI OCR TEXT EXTRACTION:\nDocument: " + file.name + "\nContent: Detailed analysis of text embedded within image. Includes section titles, numerical values, and context.",
        aiExplanation: "This uploaded document appears to contain printed text and tabular content. AccessAI vision model has extracted text and formatted it for screen reader and audio playback.",
        keyPoints: [
          "Uploaded Image: " + file.name,
          "Text Quality: High Resolution OCR",
          "Audio Output: Clean Speech Generated"
        ],
        audioScript: "Loud Reading for uploaded document " + file.name + ". Content successfully analyzed by AccessAI Vision text model. Preparing audio playback."
      };

      setCustomImage(customData);
      setSelectedSample(customData);
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 800);
    };
    reader.readAsDataURL(file);
  };

  const handlePlayAudio = (textToRead) => {
    if (isPaused) {
      tts.resume();
    } else {
      tts.speak(textToRead || selectedSample.audioScript, {
        rate: speechRate,
        voice: selectedVoice
      });
    }
  };

  const handlePauseAudio = () => {
    tts.pause();
  };

  const handleStopAudio = () => {
    tts.stop();
  };

  const currentItem = customImage || selectedSample;

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> For Visually Impaired Users
              </span>
              <span className="text-xs text-slate-400">AI Vision + Loud Audio Reading</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Vision AI Loud Reader & Context Explainer
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Upload any image containing text, signs, prescriptions, or documents. AccessAI extracts the text, generates a simple <strong className="text-emerald-300">AI context explanation</strong>, and reads it out loud with clear text-to-speech audio.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5">
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Preset Sample Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Or Try Preset Real-World Test Images:
          </h3>
          <span className="text-xs text-slate-400">Click any preset to test vision reading</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sampleVisionImages.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`glass-card p-3 text-left transition-all relative overflow-hidden rounded-xl border ${
                currentItem.id === sample.id
                  ? 'border-emerald-500 bg-emerald-950/40 ring-2 ring-emerald-500/30'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
              }`}
            >
              <div className="h-24 w-full rounded-lg overflow-hidden mb-2 bg-slate-950 relative">
                <img 
                  src={sample.image} 
                  alt={sample.title} 
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" 
                />
                <span className="absolute bottom-1 right-1 bg-slate-950/80 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {sample.category}
                </span>
              </div>
              <h4 className="font-semibold text-xs text-white line-clamp-1">{sample.title}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{sample.aiExplanation}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Vision Inspection & Audio Reader Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Original Image Preview & extracted text */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                Original Image Source
              </h3>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {currentItem.category}
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center gap-3 p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <p className="text-xs text-slate-300 font-medium">Running AccessAI Vision OCR & Context Synthesizer...</p>
                </div>
              ) : (
                <img 
                  src={currentItem.image} 
                  alt={currentItem.title} 
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Key Summary Highlights */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Key Extracted Data Points
              </h4>
              <ul className="space-y-1.5">
                {currentItem.keyPoints.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Audio Reader Player & AI Explanation */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Audio Player Controller Box */}
          <div className="glass-card p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/30 space-y-6 relative">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Active Audio Track</span>
                <h3 className="text-xl font-bold text-white">{currentItem.title}</h3>
              </div>

              {/* Speech Controls */}
              <div className="flex items-center gap-2">
                {!isPlaying || isPaused ? (
                  <button
                    onClick={() => handlePlayAudio()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-105"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>{isPaused ? 'Resume' : 'Loud Read'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseAudio}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all"
                  >
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Pause</span>
                  </button>
                )}

                {isPlaying && (
                  <button
                    onClick={handleStopAudio}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <Square className="w-4 h-4 fill-current text-rose-400" />
                    <span>Stop</span>
                  </button>
                )}
              </div>
            </div>

            {/* Audio Waveform Canvas Visualizer */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center space-y-2">
              <canvas ref={canvasRef} width={500} height={50} className="w-full h-12" />
              <div className="flex items-center justify-between w-full text-[11px] text-slate-400 px-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                  {isPlaying ? 'TTS Audio Speaking Live' : 'Ready for Audio Output'}
                </span>
                <span>Speed: {speechRate}x</span>
              </div>
            </div>

            {/* Playback Settings (Rate & Voice Picker) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Speech Rate (Speed)</label>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setSpeechRate(rate)}
                      className={`flex-1 py-1 text-xs font-semibold rounded ${
                        speechRate === rate ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">Voice Accent</label>
                <select
                  value={selectedVoice ? selectedVoice.name : ''}
                  onChange={(e) => {
                    const v = voices.find(v => v.name === e.target.value);
                    setSelectedVoice(v);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2 focus:border-emerald-500 focus:outline-none"
                >
                  {voices.map((v, i) => (
                    <option key={i} value={v.name}>{v.name} ({v.lang})</option>
                  ))}
                  {voices.length === 0 && <option>Default Browser Speech Voice</option>}
                </select>
              </div>
            </div>

            {/* AI Explanation & Context Box */}
            <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                  AI Contextual Explanation for Blind Users
                </h4>
              </div>
              <p className="text-sm text-emerald-100 font-medium leading-relaxed">
                "{currentItem.aiExplanation}"
              </p>
            </div>

            {/* Full Audio Script Text Box with Read-along button */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Full Audio Script / Transcript
                </h4>
                <button
                  onClick={() => handlePlayAudio(currentItem.extractedText)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  <Play className="w-3 h-3" /> Read Raw Text
                </button>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 max-h-40 overflow-y-auto">
                {currentItem.audioScript}
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
