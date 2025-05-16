// Фоновый скрипт для управления состоянием
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ hideEnabled: true });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getState") {
    chrome.storage.sync.get("hideEnabled", (data) => {
      sendResponse({ hideEnabled: data.hideEnabled });
    });
    return true;
  }
});
