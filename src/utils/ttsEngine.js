// Text-to-Speech (TTS) Engine using Web Speech Synthesis API with sentence chunking & Chrome keep-alive heartbeat

class TTSEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.isPaused = false;
    this.listeners = [];
    this.textQueue = [];
    this.queueIndex = 0;
    this.options = {};
    this.keepAliveInterval = null;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getVoices() {
    return this.voices.length > 0 ? this.voices : (this.synth ? this.synth.getVoices() : []);
  }

  splitIntoChunks(text) {
    if (!text) return [];
    // Remove markdown symbols (*, #, _, `, ~)
    const cleanText = text.replace(/[*#_`~]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) return [];

    // Split by sentence terminators (. ! ? ; \n) or linebreaks
    const rawSentences = cleanText.split(/(?<=[.?!;\n])\s+/);
    const chunks = [];

    for (let sentence of rawSentences) {
      sentence = sentence.trim();
      if (!sentence) continue;

      // If sentence is longer than 150 characters, break by comma or spaces
      if (sentence.length > 150) {
        const subParts = sentence.match(/.{1,140}(?:,|\s+|$)/g) || [sentence];
        for (let sub of subParts) {
          const trimmed = sub.trim();
          if (trimmed) chunks.push(trimmed);
        }
      } else {
        chunks.push(sentence);
      }
    }

    return chunks.length > 0 ? chunks : [cleanText];
  }

  startKeepAlive() {
    this.stopKeepAlive();
    // Chrome bug workaround: speechSynthesis stops after ~15 sec unless paused/resumed periodically
    this.keepAliveInterval = setInterval(() => {
      if (this.synth && this.isSpeaking && !this.isPaused) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 5000);
  }

  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  speak(text, options = {}) {
    if (!this.synth || !text) return;
    this.stop();

    this.options = options;
    this.textQueue = this.splitIntoChunks(text);
    this.queueIndex = 0;

    if (this.textQueue.length === 0) return;

    this.isSpeaking = true;
    this.isPaused = false;
    this.startKeepAlive();
    this.notifyStateChange('start');

    this.speakNextChunk();
  }

  speakNextChunk() {
    if (!this.synth || !this.isSpeaking) return;

    if (this.queueIndex >= this.textQueue.length) {
      this.stop();
      return;
    }

    const chunkText = this.textQueue[this.queueIndex];
    const utterance = new SpeechSynthesisUtterance(chunkText);
    
    utterance.rate = this.options.rate || 1.0;
    utterance.pitch = this.options.pitch || 1.0;
    utterance.volume = this.options.volume || 1.0;

    if (this.options.voice) {
      utterance.voice = this.options.voice;
    } else if (this.voices.length > 0) {
      const preferred = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')));
      utterance.voice = preferred || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }

    utterance.onend = () => {
      if (this.isSpeaking && !this.isPaused) {
        this.queueIndex++;
        if (this.queueIndex < this.textQueue.length) {
          this.speakNextChunk();
        } else {
          this.stop();
        }
      }
    };

    utterance.onerror = (e) => {
      console.warn("TTS sentence chunk error:", e);
      if (this.isSpeaking && !this.isPaused) {
        this.queueIndex++;
        if (this.queueIndex < this.textQueue.length) {
          this.speakNextChunk();
        } else {
          this.stop();
        }
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
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
    this.stopKeepAlive();
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.textQueue = [];
    this.queueIndex = 0;
    this.currentUtterance = null;
    this.notifyStateChange('stop');
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

