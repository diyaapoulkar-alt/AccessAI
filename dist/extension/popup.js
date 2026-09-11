document.getElementById("btn-toggle").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "TOGGLE_OVERLAY" });
});

document.getElementById("btn-start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "START_CAPTIONS" });
});

document.getElementById("btn-stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "STOP_CAPTIONS" });
});
