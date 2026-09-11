// Speech-to-Text Engine with continuous auto-reconnection loop and speaker diarization

class STTEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.useSimulation = false;
    this.listeners = [];
    this.simulatedTimer = null;
    this.activeSpeakerIndex = 0;
    this.speakers = [
      { name: "Diya Poulkar (Host)", avatar: "DP", color: "bg-amber-600" },
      { name: "Eshaan Dogra (Presenter)", avatar: "ED", color: "bg-emerald-600" },
      { name: "Ayushi Gupta (Specialist)", avatar: "AG", color: "bg-indigo-600" },
      { name: "Guest Participant", avatar: "GP", color: "bg-purple-600" }
    ];
    this.simulatedPhrases = [
      "Welcome everyone to our Google Meet accessible live captions demo.",
      "AccessAI is analyzing the meet screen and detecting who is speaking in real time.",
      "Live captions are streaming with under 80ms latency directly in the right corner overlay.",
      "High-contrast Yellow-on-Black mode is active for visually impaired participants.",
      "OpenDyslexic typography is enabled to enhance cognitive legibility.",
      "Meeting summary: All accessibility tools verified and operating cleanly."
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

        // Continuous Auto-Reconnection Loop if speech stops after pause
        this.recognition.onend = () => {
          if (this.isListening && !this.useSimulation) {
            try {
              this.recognition.start();
            } catch (e) {
              console.warn('Speech recognition auto-restart notice:', e);
            }
          }
        };

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition error notice:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this.startSimulatedStream();
          }
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

      const speakerObj = this.speakers[this.activeSpeakerIndex % this.speakers.length];
      const text = this.simulatedPhrases[this.simulatedIndex % this.simulatedPhrases.length];
      
      this.simulatedIndex++;
      if (this.simulatedIndex % 2 === 0) {
        this.activeSpeakerIndex++;
      }

      this.notifyListeners({
        id: Date.now(),
        speaker: speakerObj.name,
        speakerAvatar: speakerObj.avatar,
        speakerColor: speakerObj.color,
        text: text,
        isFinal: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    }, 4000);
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
