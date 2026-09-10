import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sliders, 
  Sparkles, 
  Square, 
  CheckCircle2, 
  Video, 
  MessageSquareText,
  Radio,
  User,
  Trash2
} from 'lucide-react';
import { stt } from '../../utils/sttEngine';
import AudienceMeetingView from '../../meeting/AudienceMeetingView';

export default function MeetingRoom({ highContrast, setHighContrast, dyslexiaFont, setDyslexiaFont }) {
  const [isMicActive, setIsMicActive] = useState(false);
  const [useSimulationMode, setUseSimulationMode] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [transcripts, setTranscripts] = useState([
    { id: 1, speaker: "Diya Poulkar (Architect)", text: "Welcome to AccessAI real-time speech demonstration.", timestamp: "10:00:12 AM" }
  ]);
  const [captionSize, setCaptionSize] = useState('large');
  const [captionTheme, setCaptionTheme] = useState('yellow-black');
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, interimText]);

  // Audio Canvas Waveform Animation
  useEffect(() => {
    if (!isMicActive) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      ctx.beginPath();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#b45309';

      for (let x = 0; x < width; x += 6) {
        const h = Math.sin(x * 0.08 + phase) * (14 + Math.random() * 8);
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
  }, [isMicActive]);

  const toggleMicrophone = (simulate = false) => {
    if (isMicActive) {
      stt.stopListening();
      setIsMicActive(false);
      setInterimText('');
    } else {
      setIsMicActive(true);
      setUseSimulationMode(simulate);
      setInterimText('');

      stt.startListening((data) => {
        if (data.isFinal) {
          setInterimText('');
          setTranscripts(prev => [...prev, data]);
        } else {
          setInterimText(data.text);
        }
      }, { useSimulation: simulate });
    }
  };

  const clearTranscripts = () => {
    setTranscripts([]);
    setInterimText('');
  };

  const getCaptionTextSize = () => {
    if (captionSize === 'xlarge') return 'text-2xl md:text-4xl font-black';
    if (captionSize === 'large') return 'text-xl md:text-2xl font-extrabold';
    return 'text-lg md:text-xl font-bold';
  };

  const getCaptionThemeStyle = () => {
    if (captionTheme === 'yellow-black') return 'bg-black text-yellow-300 border-2 border-yellow-400 shadow-yellow-400/20';
    if (captionTheme === 'dark') return 'bg-stone-950 text-white border border-stone-800';
    return 'bg-white text-stone-900 border border-stone-300';
  };

  const currentDisplaySubtitle = interimText || (transcripts.length > 0 ? transcripts[transcripts.length - 1].text : 'Listening for live speech...');
  const currentSpeaker = interimText ? 'You (Speaking...)' : (transcripts.length > 0 ? transcripts[transcripts.length - 1].speaker : 'Microphone User');

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 py-6">
      
      {/* Hero Header Card */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-xs">
              🎤 Deaf & Hard-of-Hearing Accessibility
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Hearing Assistant & Real-Time Meeting Captions
            </h2>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-3xl font-normal">
              Live speech transcription powered by <strong className="font-semibold text-stone-900">Whisper STT Engine</strong>. Includes High-Contrast Yellow/Black overlay mode, OpenDyslexic font support, and instant live summary takeaways.
            </p>
          </div>

          {/* Microphone & Demo Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => toggleMicrophone(false)}
              className={`px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm transition duration-200 shadow-sm flex items-center gap-2 hover:scale-[1.02] ${
                isMicActive && !useSimulationMode
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              {isMicActive && !useSimulationMode ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Microphone: OFF</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-emerald-400" />
                  <span>Microphone: ON</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleMicrophone(true)}
              className={`px-4 py-2.5 rounded-full font-bold text-xs border transition duration-200 flex items-center gap-1.5 ${
                isMicActive && useSimulationMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-700" />
              <span>{isMicActive && useSimulationMode ? 'Stop Simulation' : 'Run Demo Stream'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Subtitle Stage */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-stone-800" />
                <h3 className="font-extrabold text-stone-900 text-lg">Live Audience Stage</h3>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                isMicActive ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-stone-100 text-stone-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isMicActive ? 'bg-emerald-600 animate-ping' : 'bg-stone-400'}`} />
                {isMicActive ? (useSimulationMode ? 'DEMO STREAMING' : 'LIVE MIC RECORDING') : 'MIC OFF'}
              </span>
            </div>

            {/* Video Box */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 aspect-video flex flex-col justify-between p-5 shadow-xl">
              
              {/* Speaker Row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
                  <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold text-xs">
                    DP
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Diya Poulkar (Host)</span>
                    <span className="text-[10px] text-amber-300 font-mono">Live Captions Stream</span>
                  </div>
                </div>
              </div>

              {/* Audio Wave */}
              <div className="flex items-center justify-center my-auto">
                {isMicActive ? (
                  <canvas ref={canvasRef} width={400} height={40} className="w-full h-10 opacity-90" />
                ) : (
                  <div className="text-xs text-stone-300 flex items-center gap-2 font-medium bg-black/60 px-4 py-2 rounded-full border border-white/10">
                    <MicOff className="w-3.5 h-3.5 text-rose-400" /> Click "Microphone: ON" to speak live into your mic
                  </div>
                )}
              </div>

              {/* SUBTITLE BOX */}
              <div className={`p-5 rounded-xl shadow-xl transition-all ${getCaptionThemeStyle()}`}>
                <div className="flex items-center justify-between text-[11px] opacity-85 mb-1.5 font-mono font-semibold">
                  <span className="no-hc">{currentSpeaker}</span>
                  <span className="no-hc">Live</span>
                </div>
                <p className={`${getCaptionTextSize()} ${dyslexiaFont ? 'dyslexia-font' : ''} leading-tight`}>
                  "{currentDisplaySubtitle}"
                </p>
              </div>

            </div>

            {/* Deaf Subtitle Preferences */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-stone-700" /> Deaf Subtitle Preferences
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">Caption Sizing</label>
                  <div className="flex gap-1 bg-white p-1 rounded-full border border-stone-200">
                    {['normal', 'large', 'xlarge'].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setCaptionSize(sz)}
                        className={`flex-1 py-1 text-xs font-bold capitalize rounded-full transition-all ${
                          captionSize === sz ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5">Subtitle Theme</label>
                  <div className="flex gap-1 bg-white p-1 rounded-full border border-stone-200">
                    {[
                      { id: 'yellow-black', label: 'Yellow/Black' },
                      { id: 'dark', label: 'Dark Mode' },
                      { id: 'light', label: 'Light Mode' }
                    ].map((thm) => (
                      <button
                        key={thm.id}
                        onClick={() => setCaptionTheme(thm.id)}
                        className={`flex-1 py-1 text-xs font-bold rounded-full transition-all ${
                          captionTheme === thm.id ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
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

        {/* Right Column: Live Transcript Stream */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <h3 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
                <MessageSquareText className="w-4 h-4 text-stone-800" />
                Live Transcript Feed
              </h3>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-mono font-semibold">{transcripts.length} entries</span>
                <button
                  onClick={clearTranscripts}
                  className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Clear Transcript Feed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {transcripts.map((item) => (
                <div key={item.id} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-600" /> {item.speaker}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">{item.text}</p>
                </div>
              ))}

              {interimText && (
                <div className="bg-amber-50/90 p-3.5 rounded-2xl border border-amber-200 space-y-1 animate-pulse">
                  <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-amber-800 animate-ping" /> You (Speaking...)
                  </span>
                  <p className="text-xs sm:text-sm text-amber-950 font-bold italic leading-relaxed">{interimText}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-200 p-5 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-900" />
              <h4 className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
                Live AI Meeting Takeaways
              </h4>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-indigo-950 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                <span>Verified live speech transcription operating cleanly without duplicate draft lines.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                <span>Validated high-contrast yellow-on-black overlay and OpenDyslexic typography.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* Audience Meeting View by Ayushi & Eshaan */}
      <AudienceMeetingView />

    </div>
  );
}
