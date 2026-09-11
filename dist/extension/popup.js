async function executeOnActiveTab(actionName) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  try {
    // Inject content script immediately
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (e) {
    console.warn("Direct injection notice:", e);
  }

  // Send action message to injected taskbar
  chrome.tabs.sendMessage(tab.id, { action: actionName });
}

document.getElementById("btn-show-taskbar").addEventListener("click", () => {
  executeOnActiveTab("TOGGLE_OVERLAY");
});

document.getElementById("btn-start").addEventListener("click", () => {
  executeOnActiveTab("START_CAPTIONS");
});

document.getElementById("btn-stop").addEventListener("click", () => {
  executeOnActiveTab("STOP_CAPTIONS");
});
