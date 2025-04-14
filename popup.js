const searchMy = "my.websoft.ru";
const searchClients = "clients.websoft.ru";
const searchConversation = "conversation";

const onButton = document.querySelector("#on");
const offButton = document.querySelector("#off");

onButton.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  const isTargetUrl =
    url.includes(searchMy) ||
    (url.includes(searchClients) && url.includes(searchConversation));
  // не корректно работает условие, отрабатывает на любой странице my или clients, подумать чтобы отрабатывало только с conversation
  console.log(isTargetUrl);
});

document.addEventListener("DOMContentLoaded", isLoaded);

function isLoaded() {
  console.log("loaded");
}

// сделать получение активной страницы
// если это нужная страница, то запускать скрипт
// сделать разные переключатели для тикетов
