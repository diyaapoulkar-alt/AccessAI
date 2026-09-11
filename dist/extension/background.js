// AccessAI Background Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  console.log("AccessAI Google Meet Extension Service Worker installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "TOGGLE_OVERLAY") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "TOGGLE_OVERLAY" }, (response) => {
          sendResponse({ status: "ok", active: response?.active });
        });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (message.action === "START_CAPTIONS") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "START_CAPTIONS" });
      }
    });
  }

  if (message.action === "STOP_CAPTIONS") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "STOP_CAPTIONS" });
      }
    });
  }
});
