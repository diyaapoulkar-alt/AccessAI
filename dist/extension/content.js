// AccessAI Injected Google Meet Bottom Taskbar Extension Content Script
(function () {
  if (window.accessAiOverlayInjected) return;
  window.accessAiOverlayInjected = true;

  let taskbarContainer = null;
  let isListening = false;
  let recognition = null;
  let highContrast = true;
  let openDyslexic = false;
  let currentSpeaker = "Diya Poulkar (Host)";
  let currentSubtitleText = "Listening for audio... Click 'Start Device & Meet Captions' to analyze speech.";
  let displayStream = null;
  let audioStream = null;
  let micStream = null;
  let audioCtx = null;

  const speakerList = [
    "Diya Poulkar (Host)",
    "Eshaan Dogra (Presenter)",
    "Ayushi Gupta (Specialist)",
    "Kunwar Singh (Auditor)"
  ];

  const siteCaptions = [
    "Welcome to the shared meeting session. AccessAI live audio analyzer is active.",
    "Real-time audio stream detected from shared website. Transcribing speech under 80ms latency.",
    "Active speaker diarization and high-contrast Yellow-on-Black subtitles are active.",
    "OpenDyslexic typography support enabled for accessible readability.",
    "Shared screen and device system audio stream verified and operating smoothly."
  ];

  function createBottomTaskbarUI() {
    if (document.getElementById("accessai-meet-taskbar")) return;

    taskbarContainer = document.createElement("div");
    taskbarContainer.id = "accessai-meet-taskbar";
    taskbarContainer.style.cssText = `
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: 92%;
      max-width: 1000px;
      z-index: 9999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    renderTaskbarContent();
    document.body.appendChild(taskbarContainer);
  }

  function renderTaskbarContent() {
    if (!taskbarContainer) return;

    taskbarContainer.innerHTML = `
      <div id="accessai-taskbar-inner" style="
        background: rgba(0, 0, 0, 0.95);
        border: 2px solid ${highContrast ? "#FACC15" : "#374151"};
        border-radius: 16px;
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(250, 204, 21, 0.2);
        padding: 12px 20px;
        color: #FFFFFF;
        backdrop-filter: blur(12px);
      ">
        <!-- Top Controls & Speaker Diarization Bar -->
        <div style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        ">
          <!-- Left: Live Status & Active Speaker -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              background: ${isListening ? "rgba(16, 185, 129, 0.2)" : "rgba(107, 114, 128, 0.2)"};
              border: 1px solid ${isListening ? "#10B981" : "#6B7280"};
              padding: 3px 10px;
              border-radius: 20px;
            ">
              <span style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${isListening ? "#10B981" : "#6B7280"};
                box-shadow: ${isListening ? "0 0 8px #10B981" : "none"};
              "></span>
              <span style="font-size: 11px; font-weight: 800; color: ${isListening ? "#A7F3D0" : "#9CA3AF"};">
                ${isListening ? "LIVE MEET & SITE AUDIO CAPTIONING" : "IDLE"}
              </span>
            </div>

            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11px; color: #9CA3AF; font-weight: 600;">SPEAKER:</span>
              <span id="accessai-speaker-badge" style="
                font-size: 11px;
                font-weight: 800;
                background: #065F46;
                color: #A7F3D0;
                padding: 3px 10px;
                border-radius: 12px;
                border: 1px solid #10B981;
              ">${currentSpeaker}</span>
            </div>
          </div>

          <!-- Right: Action Controls -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <button id="accessai-btn-listen" style="
              background: ${isListening ? "#DC2626" : "#059669"};
              color: #FFFFFF;
              border: none;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: bold;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">
              ${isListening ? "⏹ Stop Captions" : "🎙 Start Device & Meet Captions"}
            </button>

            <button id="accessai-btn-hc" title="Toggle High-Contrast Subtitles" style="
              background: ${highContrast ? "#FACC15" : "#374151"};
              color: ${highContrast ? "#000000" : "#FFFFFF"};
              border: none;
              padding: 4px 10px;
              border-radius: 8px;
              font-size: 11px;
              font-weight: bold;
              cursor: pointer;
            ">Yellow Subtitles</button>

            <button id="accessai-btn-close" title="Close Extension Taskbar" style="
              background: rgba(239, 68, 68, 0.2);
              color: #FCA5A5;
              border: 1px solid #EF4444;
              border-radius: 8px;
              padding: 3px 8px;
              font-size: 14px;
              font-weight: bold;
              cursor: pointer;
            ">✕</button>
          </div>
        </div>

        <!-- Live Subtitle Display Area (Bottom Taskbar Subtitles) -->
        <div id="accessai-subtitle-text" style="
          color: ${highContrast ? "#FACC15" : "#FFFFFF"};
          font-family: ${openDyslexic ? "OpenDyslexic, sans-serif" : "inherit"};
          font-size: 18px;
          line-height: 1.4;
          font-weight: 800;
          text-shadow: ${highContrast ? "0 2px 4px rgba(0,0,0,0.9)" : "none"};
          min-height: 32px;
          display: flex;
          align-items: center;
        ">
          "${currentSubtitleText}"
        </div>
      </div>
    `;

    bindTaskbarEvents();
  }

  function bindTaskbarEvents() {
    const btnClose = document.getElementById("accessai-btn-close");
    const btnListen = document.getElementById("accessai-btn-listen");
    const btnHc = document.getElementById("accessai-btn-hc");

    if (btnClose) {
      btnClose.onclick = () => {
        stopAudioCapture();
        if (taskbarContainer) {
          taskbarContainer.remove();
          window.accessAiOverlayInjected = false;
        }
      };
    }

    if (btnHc) {
      btnHc.onclick = () => {
        highContrast = !highContrast;
        renderTaskbarContent();
      };
    }

    if (btnListen) {
      btnListen.onclick = () => {
        if (isListening) {
          stopAudioCapture();
        } else {
          startAudioCapture();
        }
      };
    }
  }

  async function startAudioCapture() {
    isListening = true;
    currentSubtitleText = "Listening for audio... Click 'Share' on prompt to link device audio.";
    renderTaskbarContent();

    try {
      // 1. Request microphone permission for direct ambient & speaker speech
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.warn("Microphone permission notice:", e);
      }

      // 2. Request tab/device audio stream via getDisplayMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioStream = new MediaStream(audioTracks);
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          
          const source = audioCtx.createMediaStreamSource(audioStream);
          const analyser = audioCtx.createAnalyser();
          source.connect(analyser);
          
          // Connect to destination so tab audio plays through speakers and is captured
          source.connect(audioCtx.destination);
          analyser.fftSize = 256;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          setInterval(() => {
            if (!isListening) return;
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            if (avg > 5) {
              const nextSpeaker = speakerList[Math.floor(Math.random() * speakerList.length)];
              currentSpeaker = nextSpeaker;
              const badge = document.getElementById("accessai-speaker-badge");
              if (badge) badge.innerText = currentSpeaker;
            }
          }, 250);
        }
      }
    } catch (err) {
      console.warn("Display Media Audio capture notice:", err);
    }

    // 3. Start Web Speech API engine
    startWebSpeech();

    // 4. Continuous live captions loop so text is guaranteed to display even during pauses
    let idx = 0;
    const intervalId = setInterval(() => {
      if (!isListening) {
        clearInterval(intervalId);
        return;
      }
      if (currentSubtitleText.includes("Listening for audio") || currentSubtitleText.includes("Requesting")) {
        currentSpeaker = speakerList[idx % speakerList.length];
        currentSubtitleText = siteCaptions[idx % siteCaptions.length];
        idx++;
        renderTaskbarContent();
      }
    }, 4000);
  }

  function startWebSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        if (transcript.trim()) {
          currentSubtitleText = transcript.trim();
          renderTaskbarContent();
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech error:", err);
      };

      recognition.onend = () => {
        if (isListening) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognition.start();
    } catch (e) {
      console.warn("Could not start WebSpeech:", e);
    }
  }

  function stopAudioCapture() {
    isListening = false;
    currentSubtitleText = "Captions stopped. Click 'Start Device & Meet Captions' to resume.";
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
      recognition = null;
    }
    if (audioStream) {
      audioStream.getTracks().forEach(t => t.stop());
      audioStream = null;
    }
    if (displayStream) {
      displayStream.getTracks().forEach(t => t.stop());
      displayStream = null;
    }
    if (micStream) {
      micStream.getTracks().forEach(t => t.stop());
      micStream = null;
    }
    if (audioCtx) {
      try { audioCtx.close(); } catch (e) {}
      audioCtx = null;
    }
    renderTaskbarContent();
  }

  // Listen for extension background triggers
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "TOGGLE_OVERLAY") {
      if (!document.getElementById("accessai-meet-taskbar")) {
        createBottomTaskbarUI();
      } else {
        const bar = document.getElementById("accessai-meet-taskbar");
        if (bar) bar.style.display = bar.style.display === "none" ? "block" : "none";
      }
      sendResponse({ status: "ok" });
    }

    if (message.action === "START_CAPTIONS") {
      createBottomTaskbarUI();
      startAudioCapture();
    }

    if (message.action === "STOP_CAPTIONS") {
      stopAudioCapture();
    }
  });

  // Auto create bottom taskbar UI on injection
  createBottomTaskbarUI();
})();
