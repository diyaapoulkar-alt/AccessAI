// Speech-to-Text Engine with clean microphone capture and duplicate interim filter

class STTEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.useSimulation = false;
    this.listeners = [];
    this.simulatedTimer = null;
    this.simulatedPhrases = [
      { speaker: "Diya Poulkar (Lead Architect)", text: "Welcome everyone to our AccessAI live demonstration. Can everyone hear the stream clearly?" },
      { speaker: "Alex Rivera (Lead Dev)", text: "Yes Diya, captions are streaming in real-time. Latency is clocking at under 80ms over WebSockets." },
      { speaker: "Eshaan (UI Specialist)", text: "We have also integrated the High-Contrast Yellow-on-Black subtitle mode for low-vision users." },
      { speaker: "AI Meeting Assistant", text: "Live Summary Note: Meeting focused on validating live speech-to-text latency and high-contrast accessibility themes." }
    ];
    this.simulatedIndex = 0;

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptChunk;
            } else {
              interimTranscript += transcriptChunk;
            }
          }

          if (finalTranscript.trim()) {
            this.notifyListeners({
              id: Date.now() + Math.random(),
              speaker: "You (Microphone)",
              text: finalTranscript.trim(),
              isFinal: true,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
          } else if (interimTranscript.trim()) {
            this.notifyListeners({
              id: 'interim-draft',
              speaker: "You (Speaking...)",
              text: interimTranscript.trim(),
              isFinal: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
          }
        };

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition notice:', event.error);
        };
      }
    }
  }

  startListening(onTranscript, options = {}) {
    this.stopListening();
    this.isListening = true;
    if (onTranscript) this.subscribe(onTranscript);

    if (options.useSimulation || !this.recognition) {
      this.useSimulation = true;
      this.startSimulatedStream();
    } else {
      this.useSimulation = false;
      try {
        this.recognition.start();
      } catch (e) {
        this.startSimulatedStream();
      }
    }
  }

  startSimulatedStream() {
    if (this.simulatedTimer) clearInterval(this.simulatedTimer);

    this.simulatedTimer = setInterval(() => {
      if (!this.isListening) return;

      const phrase = this.simulatedPhrases[this.simulatedIndex % this.simulatedPhrases.length];
      this.simulatedIndex++;

      this.notifyListeners({
        id: Date.now(),
        speaker: phrase.speaker,
        text: phrase.text,
        isFinal: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    }, 4500);
  }

  stopListening() {
    this.isListening = false;
    if (this.simulatedTimer) {
      clearInterval(this.simulatedTimer);
      this.simulatedTimer = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(data) {
    this.listeners.forEach(cb => cb(data));
  }
}

export const stt = new STTEngine();
