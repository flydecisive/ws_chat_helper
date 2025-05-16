document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");
  const status = document.getElementById("status");

  chrome.storage.sync.get("hideEnabled", (data) => {
    const isEnabled = data.hideEnabled !== false;
    toggle.checked = isEnabled;
    status.textContent = isEnabled ? "Включено" : "Выключено";
  });

  toggle.addEventListener("change", () => {
    const isEnabled = toggle.checked;
    chrome.storage.sync.set({ hideEnabled: isEnabled });
    status.textContent = isEnabled ? "Включено" : "Выключено";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes("/vchat/conversation/")) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateState",
          hideEnabled: isEnabled,
        });
      }
    });
  });
});
