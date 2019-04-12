chrome.browserAction.onClicked.addListener((tab) => {
  let index = chrome.runtime.getURL('./index.html')
  window.open(index, '_blank')
})