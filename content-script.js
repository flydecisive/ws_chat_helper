class ChatbotHider {
  constructor() {
    this.observer = null;
    this.init();
  }

  async init() {
    this.state = await this.getHideState();
    this.setupObserver();
    this.hideExistingElements();
    this.setupUrlChangeListener();
  }

  async getHideState() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "getState" }, (response) => {
        resolve(response?.hideEnabled ?? true);
      });
    });
  }

  hideExistingElements() {
    if (!this.state) return;

    document.querySelectorAll('[ws-chatbot-speaking="true"]').forEach((el) => {
      el.style.display = "none";
    });
  }

  setupObserver() {
    this.observer = new MutationObserver((mutations) => {
      if (!this.state) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.hasAttribute("ws-chatbot-speaking")) {
              node.style.display = "none";
            }
            node
              .querySelectorAll('[ws-chatbot-speaking="true"]')
              .forEach((el) => {
                el.style.display = "none";
              });
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  setupUrlChangeListener() {
    let lastUrl = location.href;

    setInterval(() => {
      const currentUrl = location.href;
      if (
        currentUrl !== lastUrl &&
        currentUrl.includes("/vchat/conversation/")
      ) {
        lastUrl = currentUrl;
        this.hideExistingElements();
      }
    }, 500);
  }

  updateState(newState) {
    this.state = newState;
    if (newState) {
      this.hideExistingElements();
    } else {
      document
        .querySelectorAll('[ws-chatbot-speaking="true"]')
        .forEach((el) => {
          el.style.display = "";
        });
    }
  }
}

const hider = new ChatbotHider();

// Обработчик сообщений для обновления состояния
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateState") {
    hider.updateState(request.hideEnabled);
  }
});
