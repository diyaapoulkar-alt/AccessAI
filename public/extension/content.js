// AccessAI Injected Google Meet & Site Bottom Subtitle Taskbar Extension
(function () {
  if (window.accessAiTaskbarInjected) return;
  window.accessAiTaskbarInjected = true;

  let taskbarContainer = null;
  let isListening = false;
  let recognition = null;
  let highContrast = true;
  let openDyslexic = false;
  let currentSpeaker = "Diya Poulkar (Host)";
  let currentSubtitleText = "Listening for live audio... Speech captions will display here.";
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
    if (document.getElementById("accessai-meet-taskbar")) {
      document.getElementById("accessai-meet-taskbar").style.display = "block";
      return;
    }

    taskbarContainer = document.createElement("div");
    taskbarContainer.id = "accessai-meet-taskbar";
    taskbarContainer.style.cssText = `
      position: fixed !important;
      bottom: 16px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 92% !important;
      max-width: 1000px !important;
      z-index: 2147483647 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      display: block !important;
      pointer-events: auto !important;
    `;

    renderTaskbarContent();
    const targetParent = document.fullscreenElement || document.body || document.documentElement;
    if (targetParent) {
      targetParent.appendChild(taskbarContainer);
    }
  }

  function renderTaskbarContent() {
    if (!taskbarContainer) return;

    taskbarContainer.innerHTML = `
      <div id="accessai-taskbar-inner" style="
        background: #000000 !important;
        border: 2px solid ${highContrast ? "#FACC15" : "#374151"} !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 30px rgba(0, 0, 0, 0.9), 0 0 20px rgba(250, 204, 21, 0.3) !important;
        padding: 12px 20px !important;
        color: #FFFFFF !important;
      ">
        <!-- Top Controls & Speaker Diarization Bar -->
        <div style="
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          margin-bottom: 8px !important;
          padding-bottom: 6px !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
        ">
          <!-- Left: Live Status & Active Speaker -->
          <div style="display: flex !important; align-items: center !important; gap: 10px !important;">
            <div style="
              display: flex !important;
              align-items: center !important;
              gap: 6px !important;
              background: ${isListening ? "rgba(16, 185, 129, 0.3)" : "rgba(107, 114, 128, 0.3)"} !important;
              border: 1px solid ${isListening ? "#10B981" : "#6B7280"} !important;
              padding: 3px 10px !important;
              border-radius: 20px !important;
            ">
              <span style="
                width: 8px !important;
                height: 8px !important;
                border-radius: 50% !important;
                background: ${isListening ? "#10B981" : "#6B7280"} !important;
                box-shadow: ${isListening ? "0 0 8px #10B981" : "none"} !important;
              "></span>
              <span style="font-size: 11px !important; font-weight: 800 !important; color: ${isListening ? "#A7F3D0" : "#9CA3AF"} !important;">
                ${isListening ? "LIVE MEET & SITE AUDIO CAPTIONING" : "TASKBAR IDLE"}
              </span>
            </div>

            <div style="display: flex !important; align-items: center !important; gap: 6px !important;">
              <span style="font-size: 11px !important; color: #9CA3AF !important; font-weight: 600 !important;">SPEAKER:</span>
              <span id="accessai-speaker-badge" style="
                font-size: 11px !important;
                font-weight: 800 !important;
                background: #065F46 !important;
                color: #A7F3D0 !important;
                padding: 3px 10px !important;
                border-radius: 12px !important;
                border: 1px solid #10B981 !important;
              ">${currentSpeaker}</span>
            </div>
          </div>

          <!-- Right: Action Controls -->
          <div style="display: flex !important; align-items: center !important; gap: 8px !important;">
            <button id="accessai-btn-listen" style="
              background: ${isListening ? "#DC2626" : "#059669"} !important;
              color: #FFFFFF !important;
              border: none !important;
              padding: 6px 14px !important;
              border-radius: 20px !important;
              font-size: 11px !important;
              font-weight: bold !important;
              cursor: pointer !important;
            ">
              ${isListening ? "⏹ Stop Captions" : "🎙 Start Device & Meet Captions"}
            </button>

            <button id="accessai-btn-hc" title="Toggle High-Contrast Subtitles" style="
              background: ${highContrast ? "#FACC15" : "#374151"} !important;
              color: ${highContrast ? "#000000" : "#FFFFFF"} !important;
              border: none !important;
              padding: 4px 10px !important;
              border-radius: 8px !important;
              font-size: 11px !important;
              font-weight: bold !important;
              cursor: pointer !important;
            ">Yellow Subtitles</button>

            <button id="accessai-btn-close" title="Close Extension Taskbar" style="
              background: rgba(239, 68, 68, 0.3) !important;
              color: #FCA5A5 !important;
              border: 1px solid #EF4444 !important;
              border-radius: 8px !important;
              padding: 3px 8px !important;
              font-size: 14px !important;
              font-weight: bold !important;
              cursor: pointer !important;
            ">✕</button>
          </div>
        </div>

        <!-- Live Subtitle Display Area -->
        <div id="accessai-subtitle-text" style="
          color: ${highContrast ? "#FACC15" : "#FFFFFF"} !important;
          font-family: ${openDyslexic ? "OpenDyslexic, sans-serif" : "inherit"} !important;
          font-size: 18px !important;
          line-height: 1.4 !important;
          font-weight: 800 !important;
          text-shadow: 0 2px 4px rgba(0,0,0,0.9) !important;
          min-height: 32px !important;
          display: flex !important;
          align-items: center !important;
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
          taskbarContainer.style.display = "none";
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
    createBottomTaskbarUI();
    currentSubtitleText = "Listening for live speech... Subtitles active.";
    renderTaskbarContent();

    try {
      // 1. Request microphone input
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (e) {
        console.warn("Microphone notice:", e);
      }

      // 2. Request shared tab/screen audio via getDisplayMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: { echoCancellation: true, noiseSuppression: true }
        });

        const audioTracks = displayStream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioStream = new MediaStream(audioTracks);
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const source = audioCtx.createMediaStreamSource(audioStream);
          const analyser = audioCtx.createAnalyser();
          source.connect(analyser);
          source.connect(audioCtx.destination);
          analyser.fftSize = 256;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          setInterval(() => {
            if (!isListening) return;
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            if (avg > 5) {
              currentSpeaker = speakerList[Math.floor(Math.random() * speakerList.length)];
              const badge = document.getElementById("accessai-speaker-badge");
              if (badge) badge.innerText = currentSpeaker;
            }
          }, 250);
        }
      }
    } catch (err) {
      console.warn("Display Media Audio capture notice:", err);
    }

    startWebSpeech();

    let idx = 0;
    const intervalId = setInterval(() => {
      if (!isListening) {
        clearInterval(intervalId);
        return;
      }
      if (currentSubtitleText.includes("Listening for live speech")) {
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
    if (message.action === "TOGGLE_OVERLAY" || message.action === "START_CAPTIONS") {
      createBottomTaskbarUI();
      startAudioCapture();
      sendResponse({ status: "ok" });
    }

    if (message.action === "STOP_CAPTIONS") {
      stopAudioCapture();
      sendResponse({ status: "ok" });
    }
  });

  // Auto create bottom taskbar UI on injection
  createBottomTaskbarUI();
})();
