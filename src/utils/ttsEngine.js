// Text-to-Speech (TTS) Engine using Web Speech Synthesis API with fallback capabilities

class TTSEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.listeners = [];

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices().filter(v => v.lang.startsWith('en'));
  }

  getVoices() {
    return this.voices.length > 0 ? this.voices : (this.synth ? this.synth.getVoices() : []);
  }

  speak(text, options = {}) {
    if (!this.synth) return;

    this.stop(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    if (options.voice) {
      utterance.voice = options.voice;
    } else if (this.voices.length > 0) {
      // Pick a clean English voice
      const preferredVoice = this.voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'));
      utterance.voice = preferredVoice || this.voices[0];
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.notifyStateChange('start');
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyStateChange('end');
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyStateChange('error', e);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        this.notifyStateChange('word', { charIndex: e.charIndex, charLength: e.charLength });
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
      this.isPaused = true;
      this.notifyStateChange('pause');
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notifyStateChange('resume');
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.notifyStateChange('stop');
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyStateChange(event, payload = {}) {
    this.listeners.forEach(cb => cb(event, {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      ...payload
    }));
  }
}

export const tts = new TTSEngine();
