chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getText") {
    const text = document.body.innerText || "";
    sendResponse(text);
  }
  
  if (msg.type === "extractJobDesc") {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      chrome.storage.local.set({ 
        lastExtractedJob: {
          text: selectedText,
          title: document.title,
          url: window.location.href,
          extractedAt: Date.now()
        }
      });
    }
  }
});
