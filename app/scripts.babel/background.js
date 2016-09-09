let vsoShowing = false;
chrome.browserAction.onClicked.addListener(function (tab) {
  if (!vsoShowing) {
    _sendMessage(tab, "showVsoExtenstion", () => {
      vsoShowing = true;
      return true;
    });
  } else {
    _sendMessage(tab, "hideVsoExtenstion", () => {
      vsoShowing = false;
      return true;
    });
  }
});

chrome.runtime.onInstalled.addListener(details => {
  console.log("previousVersion", details);
});


const methods = {
  //this gets called from the content when user clicks close icon
  setState: (isShowing) => {
    vsoShowing = isShowing;
  }
};

chrome.runtime.onMessage.addListener(function (request) {
  if (methods.hasOwnProperty(request.method)) {
    methods[request.method](request.data);
  }
  return true;
});

function _sendMessage(tab, method, callback) {
  chrome.tabs.sendMessage(tab.id, { method: method }, callback);
}