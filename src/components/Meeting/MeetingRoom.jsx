import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sliders, 
  Users, 
  Sparkles, 
  Eye, 
  Square, 
  Copy, 
  Download, 
  CheckCircle2, 
  Video, 
  Tv, 
  MessageSquareText,
  FileText
} from 'lucide-react';
import { stt } from '../../utils/sttEngine';

export default function MeetingRoom({ highContrast, setHighContrast, dyslexiaFont, setDyslexiaFont }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState([
    { id: 1, speaker: "Sarah Jenkins (Host)", text: "Welcome everyone to our AccessAI sync. Today we're reviewing the live transcription and vision reader tools.", timestamp: "10:00:12 AM" },
    { id: 2, speaker: "Alex Rivera (Lead Dev)", text: "The speech-to-text latency is down to 80ms, ensuring deaf participants can read captions synchronously without delay.", timestamp: "10:00:25 AM" }
  ]);
  const [captionSize, setCaptionSize] = useState('large'); // normal, large, xlarge
  const [captionTheme, setCaptionTheme] = useState('yellow-black'); // yellow-black, dark, light
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom of transcripts
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Audio wave canvas visualizer
  useEffect(() => {
    if (!isRecording) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#a855f7';

      for (let x = 0; x < width; x += 6) {
        const h = Math.sin(x * 0.08 + phase) * (12 + Math.random() * 8);
        ctx.moveTo(x, height / 2 - h);
        ctx.lineTo(x, height / 2 + h);
      }
      ctx.stroke();

      phase += 0.2;
      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      stt.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      stt.startListening((data) => {
        setTranscripts(prev => [...prev, {
          id: Date.now(),
          speaker: data.speaker,
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString()
        }]);
      });
    }
  };

  const getCaptionTextSize = () => {
    if (captionSize === 'xlarge') return 'text-2xl md:text-3xl font-extrabold';
    if (captionSize === 'large') return 'text-lg md:text-xl font-bold';
    return 'text-base font-semibold';
  };

  const getCaptionThemeStyle = () => {
    if (captionTheme === 'yellow-black') return 'bg-black text-yellow-300 border border-yellow-400';
    if (captionTheme === 'dark') return 'bg-slate-950 text-white border border-slate-800';
    return 'bg-white text-black border border-slate-300';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      {/* Header Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" /> For Deaf & Hard-of-Hearing Users
              </span>
              <span className="text-xs text-slate-400">Live Whisper STT Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Real-Time Accessible Meeting & Live Captions
            </h2>
            <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed mt-1">
              Provides real-time speech-to-text captions with high contrast yellow-on-black overlay, speaker identification, and live AI meeting summary. Zero installs required — works in any browser.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleRecording}
              className={`font-bold px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5 fill-current" />
                  <span>Stop Captions</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Start Live Captions</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Video Feed Simulation & High Contrast Subtitle Screen */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-card p-5 bg-slate-950 border-purple-500/30 space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-sm text-white">Live Audience View (Deaf Accessible)</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                  isRecording ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  {isRecording ? 'STREAMING LIVE' : 'MIC IDLE'}
                </span>
              </div>
            </div>

            {/* Simulated Meeting Stage */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 aspect-video flex flex-col justify-between p-6">
              
              {/* Speaker Video Avatar Row */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    SJ
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Sarah Jenkins (Host)</span>
                    <span className="text-[10px] text-purple-400">Speaking...</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800/60 opacity-70">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    AR
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-300">Alex Rivera</span>
                  </div>
                </div>
              </div>

              {/* Audio Wave Visualizer inside Video Stage */}
              <div className="flex items-center justify-center my-auto">
                {isRecording ? (
                  <canvas ref={canvasRef} width={400} height={40} className="w-full h-10 opacity-80" />
                ) : (
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <MicOff className="w-4 h-4" /> Click "Start Live Captions" to test real-time speech
                  </div>
                )}
              </div>

              {/* LIVE HIGH-CONTRAST SUBTITLE OVERLAY BOX */}
              <div className={`p-4 rounded-xl shadow-2xl transition-all ${getCaptionThemeStyle()}`}>
                <div className="flex items-center justify-between text-[11px] opacity-80 mb-1 font-mono">
                  <span>{transcripts[transcripts.length - 1]?.speaker || "Speaker"}</span>
                  <span>{transcripts[transcripts.length - 1]?.timestamp || "Live"}</span>
                </div>
                <p className={`${getCaptionTextSize()} ${dyslexiaFont ? 'dyslexia-font' : ''} leading-tight`}>
                  "{transcripts[transcripts.length - 1]?.text || "Listening for speech input..."}"
                </p>
              </div>

            </div>

            {/* Subtitle Customization Controls */}
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Deaf & Low-Vision Subtitle Preferences
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Caption Size</label>
                  <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {['normal', 'large', 'xlarge'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setCaptionSize(sz)}
                        className={`flex-1 py-1 text-xs font-bold capitalize rounded ${
                          captionSize === sz ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Subtitle Theme</label>
                  <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                    {[
                      { id: 'yellow-black', label: 'Yellow/Black' },
                      { id: 'dark', label: 'Dark Mode' },
                      { id: 'light', label: 'Light Mode' }
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        onClick={() => setCaptionTheme(thm.id)}
                        className={`flex-1 py-1 text-xs font-bold rounded ${
                          captionTheme === thm.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {thm.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Complete Transcript Feed & Live AI Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Transcript History Box */}
          <div className="glass-card p-5 bg-slate-950 border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-purple-400" />
                Live Transcript Feed
              </h3>
              <span className="text-xs text-slate-400">{transcripts.length} items</span>
            </div>

            <div ref={scrollRef} className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {transcripts.map((item) => (
                <div key={item.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">{item.speaker}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Meeting Summary Box */}
          <div className="glass-card p-5 bg-purple-950/20 border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">
                Live AI Meeting Notes & Takeaways
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-purple-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>Confirmed live speech-to-text latency under 100ms for deaf participants.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>Validated high-contrast yellow-on-black overlay and OpenDyslexic font support.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
