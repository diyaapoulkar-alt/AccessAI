// AccessAI Background Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  console.log("AccessAI Google Meet Extension Service Worker installed.");
});

async function ensureInjectedAndSend(message, sendResponse) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  try {
    // Programmatically inject content.js into the current active tab to guarantee execution
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (err) {
    console.warn("Script execution notice:", err);
  }

  // Send message to injected script
  chrome.tabs.sendMessage(tab.id, message, (response) => {
    if (sendResponse) sendResponse(response || { status: "ok" });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "TOGGLE_OVERLAY" || message.action === "START_CAPTIONS" || message.action === "STOP_CAPTIONS") {
    ensureInjectedAndSend(message, sendResponse);
    return true; // Keeps channel open for async response
  }
});
