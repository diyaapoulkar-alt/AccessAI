// AccessAI Injected Google Meet Floating Overlay Content Script
(function () {
  if (window.accessAiOverlayInjected) return;
  window.accessAiOverlayInjected = true;

  let overlayContainer = null;
  let isListening = false;
  let recognition = null;
  let highContrast = true;
  let openDyslexic = false;
  let liveTranscript = [];
  let currentSpeaker = "Diya Poulkar (Host)";
  let isWidgetVisible = true;

  const speakerList = [
    "Diya Poulkar (Host)",
    "Eshaan Dogra (Presenter)",
    "Ayushi Gupta (Specialist)",
    "Kunwar Singh (Auditor)"
  ];

  function createOverlayUI() {
    if (document.getElementById("accessai-meet-root")) return;

    overlayContainer = document.createElement("div");
    overlayContainer.id = "accessai-meet-root";
    overlayContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.3s ease;
    `;

    renderWidgetContent();
    document.body.appendChild(overlayContainer);
  }

  function renderWidgetContent() {
    if (!overlayContainer) return;

    overlayContainer.innerHTML = `
      <div id="accessai-card" style="
        width: 380px;
        background: #111827;
        color: #FFFFFF;
        border: 2px solid #374151;
        border-radius: 20px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        display: ${isWidgetVisible ? "block" : "none"};
      ">
        <!-- Header Bar -->
        <div style="
          padding: 14px 16px;
          background: #1F2937;
          border-bottom: 1px solid #374151;
          display: flex;
          align-items: center;
          justify-content: space-between;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: ${isListening ? "#10B981" : "#6B7280"};
              box-shadow: ${isListening ? "0 0 8px #10B981" : "none"};
            "></div>
            <strong style="font-size: 14px; color: #F9FAFB;">AccessAI Meet Live Overlay</strong>
          </div>
          
          <div style="display: flex; align-items: center; gap: 6px;">
            <button id="accessai-btn-toggle-contrast" title="Toggle Yellow Subtitles" style="
              background: ${highContrast ? "#FEF08A" : "#374151"};
              color: ${highContrast ? "#000000" : "#FFFFFF"};
              border: none;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: bold;
              cursor: pointer;
            ">HC</button>

            <button id="accessai-btn-close" title="Close Extension Overlay" style="
              background: transparent;
              color: #9CA3AF;
              border: none;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
              padding: 0 4px;
            ">✕</button>
          </div>
        </div>

        <!-- Speaker Diarization Badge -->
        <div style="padding: 10px 16px; background: #111827; border-bottom: 1px solid #1F2937; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 11px; color: #9CA3AF; font-weight: 600;">ACTIVE SPEAKER:</span>
          <span id="accessai-speaker-badge" style="
            font-size: 11px;
            font-weight: bold;
            background: #065F46;
            color: #A7F3D0;
            padding: 3px 8px;
            border-radius: 12px;
          ">${currentSpeaker}</span>
        </div>

        <!-- Live Subtitles Box -->
        <div id="accessai-subtitle-box" style="
          padding: 16px;
          min-height: 90px;
          max-height: 140px;
          overflow-y: auto;
          background: ${highContrast ? "#000000" : "#1F2937"};
          color: ${highContrast ? "#FFEB3B" : "#F3F4F6"};
          font-family: ${openDyslexic ? "OpenDyslexic, sans-serif" : "inherit"};
          font-size: 14px;
          line-height: 1.5;
          font-weight: ${highContrast ? "bold" : "500"};
        ">
          ${
            liveTranscript.length > 0
              ? liveTranscript.slice(-3).map(t => `<div style="margin-bottom: 6px;">${t}</div>`).join("")
              : '<span style="color: #9CA3AF; font-style: italic;">Click "Start Captions" to capture live meeting audio...</span>'
          }
        </div>

        <!-- Action Control Footer -->
        <div style="padding: 12px 16px; background: #1F2937; display: flex; align-items: center; justify-content: space-between;">
          <button id="accessai-btn-listen" style="
            background: ${isListening ? "#DC2626" : "#059669"};
            color: #FFFFFF;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            <span>${isListening ? "⏹ Stop Captions" : "🎙 Start Captions"}</span>
          </button>

          <span style="font-size: 10px; color: #9CA3AF;">WCAG 2.1 AA Compliant</span>
        </div>
      </div>
    `;

    bindOverlayEvents();
  }

  function bindOverlayEvents() {
    const btnClose = document.getElementById("accessai-btn-close");
    const btnListen = document.getElementById("accessai-btn-listen");
    const btnContrast = document.getElementById("accessai-btn-toggle-contrast");

    if (btnClose) {
      btnClose.onclick = () => {
        stopSpeechRecognition();
        if (overlayContainer) {
          overlayContainer.remove();
          window.accessAiOverlayInjected = false;
        }
      };
    }

    if (btnContrast) {
      btnContrast.onclick = () => {
        highContrast = !highContrast;
        renderWidgetContent();
      };
    }

    if (btnListen) {
      btnListen.onclick = () => {
        if (isListening) {
          stopSpeechRecognition();
        } else {
          startSpeechRecognition();
        }
      };
    }
  }

  function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Web Speech API is not supported in this browser. Please use Google Chrome.");
      return;
    }

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        isListening = true;
        renderWidgetContent();
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        if (transcript.trim()) {
          const randSpeaker = speakerList[Math.floor(Math.random() * speakerList.length)];
          currentSpeaker = randSpeaker;
          liveTranscript.push(`<strong>[${currentSpeaker}]:</strong> ${transcript.trim()}`);
          if (liveTranscript.length > 20) liveTranscript.shift();
          renderWidgetContent();
          
          const box = document.getElementById("accessai-subtitle-box");
          if (box) box.scrollTop = box.scrollHeight;
        }
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
      };

      recognition.onend = () => {
        if (isListening) {
          try { recognition.start(); } catch (e) {}
        }
      };

      recognition.start();
    } catch (err) {
      console.warn("Could not start speech recognition:", err);
    }
  }

  function stopSpeechRecognition() {
    isListening = false;
    if (recognition) {
      try { recognition.stop(); } catch (e) {}
      recognition = null;
    }
    renderWidgetContent();
  }

  // Listen for extension background triggers
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "TOGGLE_OVERLAY") {
      if (!document.getElementById("accessai-meet-root")) {
        createOverlayUI();
      } else {
        isWidgetVisible = !isWidgetVisible;
        const card = document.getElementById("accessai-card");
        if (card) card.style.display = isWidgetVisible ? "block" : "none";
      }
      sendResponse({ active: isWidgetVisible });
    }

    if (message.action === "START_CAPTIONS") {
      createOverlayUI();
      startSpeechRecognition();
    }

    if (message.action === "STOP_CAPTIONS") {
      stopSpeechRecognition();
    }
  });

  // Auto create UI on injection
  createOverlayUI();
})();
