import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Radio, 
  Sparkles, 
  User, 
  MessageSquareText, 
  Maximize2, 
  Minimize2,
  Sliders,
  Eye,
  Type
} from 'lucide-react';
import { stt } from '../utils/sttEngine';

export default function MeetExtensionWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isWidgetDismissed, setIsWidgetDismissed] = useState(false);
  const [useSimulation, setUseSimulation] = useState(false);
  const [showYellowTaskbar, setShowYellowTaskbar] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [captions, setCaptions] = useState([
    { id: 1, speaker: 'Diya Poulkar (Host)', speakerAvatar: 'DP', speakerColor: 'bg-amber-600', text: 'Welcome to Google Meet. AccessAI live extension is active.', timestamp: '10:00 AM' }
  ]);
  const [activeSpeaker, setActiveSpeaker] = useState('Diya Poulkar (Host)');
  const [activeAvatar, setActiveAvatar] = useState('DP');
  const [captionTheme, setCaptionTheme] = useState('yellow-black');
  const [captionSize, setCaptionSize] = useState('large');
  const [dyslexicFont, setDyslexicFont] = useState(false);

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [captions, interimText]);

  const requestDeviceAudioCapture = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        console.log("Device system/tab audio stream acquired:", stream);
      }
    } catch (e) {
      console.warn("Display Media Audio capture skipped or declined, using Microphone speech recognition fallback:", e);
    }
  };

  const toggleListening = async (simulate = false) => {
    if (isListening) {
      stt.stopListening();
      setIsListening(false);
      setInterimText('');
    } else {
      if (!simulate) {
        await requestDeviceAudioCapture();
      }
      setIsListening(true);
      setUseSimulation(simulate);
      setInterimText('');

      stt.startListening((data) => {
        if (data.isFinal) {
          setInterimText('');
          setCaptions(prev => [...prev, data]);
          setActiveSpeaker(data.speaker);
          if (data.speakerAvatar) setActiveAvatar(data.speakerAvatar);
        } else {
          setInterimText(data.text);
          setActiveSpeaker(data.speaker);
        }
      }, { useSimulation: simulate });
    }
  };

  const handleOpenExtension = () => {
    setShowYellowTaskbar(true);
    if (!isListening) {
      toggleListening(false);
    }
  };

  const getThemeStyles = () => {
    if (captionTheme === 'yellow-black') return 'bg-black text-yellow-300 border-2 border-yellow-400 shadow-yellow-400/20';
    if (captionTheme === 'dark') return 'bg-stone-950 text-white border border-stone-800';
    return 'bg-white text-stone-900 border border-stone-300';
  };

  const getSizeStyle = () => {
    if (captionSize === 'xlarge') return 'text-xl md:text-2xl font-black';
    if (captionSize === 'large') return 'text-base md:text-lg font-extrabold';
    return 'text-sm font-bold';
  };

  const currentText = interimText || (captions.length > 0 ? captions[captions.length - 1].text : 'Listening for Google Meet speech...');

  if (isWidgetDismissed) return null;

  return (
    <>
      {/* Full Bottom Yellow Subtitle Taskbar (Triggered when Open Extension is clicked) */}
      {showYellowTaskbar && (
        <div id="accessai-meet-taskbar-react" className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[94%] max-w-[1020px] z-[99999] font-sans animate-in slide-in-from-bottom duration-300 select-none">
          <div className="bg-black border-4 border-yellow-400 rounded-2xl p-3.5 color-white shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(250,204,21,0.4)]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/20">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE MEET & SITE AUDIO CAPTIONING
                </span>
                <span className="text-[11px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-500 px-3 py-1 rounded-full">
                  SPEAKER: {activeSpeaker}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleListening(false)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold text-white transition ${
                    isListening ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isListening ? '⏹ Stop Captions' : '🎙 Start Device Captions'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowYellowTaskbar(false);
                    stt.stopListening();
                    setIsListening(false);
                    const taskbars = document.querySelectorAll("[id*='accessai-meet-taskbar']");
                    taskbars.forEach(tb => {
                      try { tb.remove(); } catch (err) {}
                    });
                  }}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600 rounded-xl px-2.5 py-1 text-xs font-bold transition hover:scale-105 cursor-pointer"
                  title="Close Subtitle Taskbar"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="text-yellow-300 text-lg md:text-xl font-extrabold leading-snug min-h-[36px] flex items-center tracking-wide">
              "{currentText}"
            </div>
          </div>
        </div>
      )}

      {/* Floating Google Meet Extension Widget (Bottom-Right Dock) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none font-sans">
        {!isOpen && (
          <div className="flex items-center gap-2 bg-stone-950 text-white p-2.5 pl-4 rounded-full border border-stone-800 shadow-2xl backdrop-blur-xl animate-in fade-in duration-200 hover:scale-105 transition">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setIsOpen(true)}>
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {activeAvatar}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-stone-950 ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-stone-500'}`} />
              </div>

              <div className="text-left pr-2">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <Video className="w-3 h-3" />
                  <span>Google Meet Extension</span>
                </div>
                <p className="text-[11px] font-bold text-stone-300 truncate max-w-[150px]">
                  {isListening ? activeSpeaker : 'Meet Extension Idle'}
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenExtension}
              className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-stone-950 border border-yellow-500 shadow-md transition flex items-center gap-1 hover:scale-105"
              title="Open Yellow Subtitle Taskbar"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-stone-900" />
              <span>Open Extension</span>
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="Expand Extension Panel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}

        {isOpen && (
          <div className={`bg-stone-950 text-white border border-stone-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col transition-all duration-300 ${
            isExpanded ? 'w-[440px] h-[600px]' : 'w-[360px] sm:w-[400px] h-[480px]'
          }`}>
            <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    Google Meet Analyzer
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      LIVE EXTENSION
                    </span>
                  </h4>
                  <p className="text-[10px] text-stone-400 font-mono">Diarization & Real-Time Captions</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
                  title={isExpanded ? 'Collapse Panel' : 'Maximize Panel'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    stt.stopListening();
                    setIsListening(false);
                    setIsWidgetDismissed(true);
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-rose-950/50 transition"
                  title="Close & Hide Extension Overlay"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-stone-900/60 p-3.5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {activeAvatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-stone-900 ${
                    isListening ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'
                  }`} />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                    Active Speaker
                  </span>
                  <p className="text-xs font-bold text-white truncate max-w-[190px]">
                    {activeSpeaker}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleListening(false)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-700'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isListening ? 'Mic Live' : 'Mic ON'}</span>
                </button>

                <button
                  onClick={handleOpenExtension}
                  className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-stone-950 border border-yellow-500 shadow-md transition flex items-center gap-1.5 hover:scale-105"
                  title="Open Subtitle Taskbar"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current text-stone-900" />
                  <span>Open Extension</span>
                </button>
              </div>
            </div>

          <div className="bg-stone-950 px-4 py-2 border-b border-stone-900 flex items-center justify-between">
            <canvas ref={canvasRef} width={280} height={20} className="w-full h-5 opacity-90" />
            <span className="text-[10px] font-mono text-stone-400 shrink-0 pl-2">
              {isListening ? 'Stream Active' : 'Idle'}
            </span>
          </div>

          {!showYellowTaskbar ? (
            <div className="p-4 border-b border-stone-800 bg-stone-950/80 text-center">
              <div className="p-4 rounded-2xl border border-stone-800 bg-stone-900/60 flex flex-col items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-bold text-stone-200">Live Captions & Subtitle Taskbar Idle</span>
                <p className="text-[11px] text-stone-400">Click <strong className="text-yellow-400 font-bold">"Open Extension"</strong> above to launch the live yellow subtitle taskbar.</p>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-stone-800 bg-stone-950">
              <div className={`p-4 rounded-2xl transition-all ${getThemeStyles()}`}>
                <div className="flex items-center justify-between text-[10px] opacity-80 mb-1 font-mono font-bold">
                  <span>{activeSpeaker}</span>
                  <span className="uppercase">{isListening ? 'Live Subtitle' : 'Captions Off'}</span>
                </div>

                <p className={`${getSizeStyle()} ${dyslexicFont ? 'dyslexia-font' : ''} leading-snug`}>
                  "{currentText}"
                </p>
              </div>
            </div>
          )}

          <div className="bg-stone-900/80 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCaptionTheme(captionTheme === 'yellow-black' ? 'dark' : 'yellow-black')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                  captionTheme === 'yellow-black'
                    ? 'bg-yellow-400 text-black border-yellow-500'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                Yellow/Black
              </button>

              <button
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                  dyslexicFont
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                OpenDyslexic
              </button>
            </div>

            <div className="flex items-center gap-1">
              {['normal', 'large', 'xlarge'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setCaptionSize(sz)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition ${
                    captionSize === sz ? 'bg-white text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {sz[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div ref={feedRef} className="flex-1 p-4 space-y-2.5 overflow-y-auto bg-stone-950">
            {captions.map((item) => (
              <div key={item.id} className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-stone-400" /> {item.speaker}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">{item.timestamp}</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}

            {interimText && (
              <div className="bg-amber-950/40 p-3 rounded-2xl border border-amber-500/40 space-y-1 animate-pulse">
                <span className="font-bold text-amber-300 text-[11px] flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-amber-400 animate-ping" /> {activeSpeaker}
                </span>
                <p className="text-xs text-amber-200 font-bold italic">{interimText}</p>
              </div>
            )}
          </div>

          <div className="bg-stone-900 px-4 py-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400 font-medium">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Sparkles className="w-3 h-3" /> AccessAI Meet Suite
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white font-bold transition"
            >
              Minimize Dock
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
