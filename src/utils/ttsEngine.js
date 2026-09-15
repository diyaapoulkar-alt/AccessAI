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

  formatChemicalFormulas(text) {
    if (!text) return '';
    const formulaMap = {
      'CH4': 'C H 4 (Methane)',
      'H2O': 'H 2 O (Water)',
      'CO2': 'C O 2 (Carbon Dioxide)',
      'O2': 'O 2 (Oxygen)',
      'NH3': 'N H 3 (Ammonia)',
      'NaCl': 'N a C l (Sodium Chloride)',
      'C6H12O6': 'C 6 H 12 O 6 (Glucose)'
    };

    let processed = text;
    Object.keys(formulaMap).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      processed = processed.replace(regex, formulaMap[key]);
    });

    // Expand general chemical formulas like CH4, C2H6 if not in explicit dictionary
    processed = processed.replace(/\b([A-Z][a-z]?\d+)+\b/g, (match) => {
      return match.replace(/([A-Z][a-z]?)(\d+)/g, '$1 $2 ');
    });

    return processed;
  }

  formatTextForNaturalSpeech(text) {
    if (!text) return '';

    let processed = text;

    // 1. Filter out OS taskbar/browser chrome OCR noise (e.g. 285°C, Monty dowdy, WO ypeheetosarch, etc.)
    processed = processed.replace(/(?:WO\s+ypeheetosarch|HOO\s+@|285°C|Monty\s+dowdy|Ema\)\s+ove\s+U%).*/gi, '');

    // 2. Expand abbreviations like "1.Def:" -> "Point 1. Definition: "
    processed = processed.replace(/\b(\d+)\s*\.\s*Def\s*:/gi, 'Point $1. Definition: ');
    processed = processed.replace(/\bDef\s*:/gi, 'Definition: ');

    // 3. Normalize numbered list items like "1.Class" -> "Point 1. Class"
    processed = processed.replace(/(\d+)\s*\.\s*([A-Za-z])/g, 'Point $1. $2');

    // 4. Format chemical formulas (CH4, H2O)
    processed = this.formatChemicalFormulas(processed);

    // 5. Replace colon markers with natural pause indicator
    processed = processed.replace(/\s*:\s*/g, '. ');

    // 6. Preserve linebreaks by converting newlines into explicit sentence pauses
    processed = processed.replace(/\r?\n+/g, '. \n');

    return processed;
  }

  splitIntoChunks(text) {
    if (!text) return [];
    
    // Format text for natural pronunciation and speech cadence
    const formattedText = this.formatTextForNaturalSpeech(text);

    // Remove raw markdown symbols (*, #, _, `, ~)
    const cleanText = formattedText.replace(/[*#_`~]/g, ' ').replace(/[ \t]+/g, ' ').trim();
    if (!cleanText) return [];

    // Split by sentence terminators (. ! ? ; \n) or linebreaks
    const rawSentences = cleanText.split(/(?<=[.?!;\n])\s+/);
    const chunks = [];

    for (let sentence of rawSentences) {
      sentence = sentence.trim();
      if (!sentence) continue;

      // Clean trailing duplicate periods
      sentence = sentence.replace(/\.+/g, '.').trim();

      // If sentence is longer than 140 characters, break by comma or spaces
      if (sentence.length > 140) {
        const subParts = sentence.match(/.{1,130}(?:,|\s+|$)/g) || [sentence];
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
    // Non-destructive keep-alive indicator to prevent garbage collection without calling synth.pause()
    this.keepAliveInterval = setInterval(() => {
      if (this.synth && this.isSpeaking && !this.isPaused) {
        if (this.synth.speaking === false && this.queueIndex < this.textQueue.length) {
          this.speakNextChunk();
        }
      }
    }, 3000);
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
          setTimeout(() => {
            if (this.isSpeaking && !this.isPaused) {
              this.speakNextChunk();
            }
          }, 250); // Natural 250ms pause between sentences and line breaks
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
          setTimeout(() => {
            if (this.isSpeaking && !this.isPaused) {
              this.speakNextChunk();
            }
          }, 250);
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

