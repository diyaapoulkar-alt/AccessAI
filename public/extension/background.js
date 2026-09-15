// AccessAI Background Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  console.log("AccessAI Google Meet & Site Subtitle Extension installed.");
});

// Broadcast Yellow Subtitle Taskbar to all active tabs
async function broadcastTaskbarToAllTabs(message) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("edge://")) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        });
        chrome.tabs.sendMessage(tab.id, message);
      } catch (err) {
        console.warn("Auto-attach notice for tab:", tab.id, err);
      }
    }
  }
}

async function ensureInjectedAndSend(message, sendResponse) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (err) {
    console.warn("Script execution notice:", err);
  }

  chrome.tabs.sendMessage(tab.id, message, (response) => {
    if (sendResponse) sendResponse(response || { status: "ok" });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "TRANSCRIBE_AUDIO") {
  (async () => {
    try {
      const binary = atob(message.audioBase64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const audioBlob = new Blob([bytes], { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", audioBlob, "shared-audio.webm");

      const response = await fetch(
        "http://127.0.0.1:8000/transcribe-audio",
        {
          method: "POST",
          body: formData
        }
      );

      const result = await response.json();

      sendResponse({
        status: "ok",
        text: result.text || ""
      });
    } catch (error) {
      console.error("Background Whisper request failed:", error);

      sendResponse({
        status: "error",
        text: ""
      });
    }
  })();

  return true;
}

  if (message.action === "BROADCAST_YELLOW_TASKBAR" || message.action === "START_CAPTIONS") {
    broadcastTaskbarToAllTabs({ action: "START_CAPTIONS" });
    if (sendResponse) sendResponse({ status: "ok" });
    return true;
  }

  if (message.action === "TOGGLE_OVERLAY" || message.action === "STOP_CAPTIONS") {
    ensureInjectedAndSend(message, sendResponse);
    return true;
  }
});
