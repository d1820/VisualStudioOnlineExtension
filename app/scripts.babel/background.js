/* eslint no-undefined: off */
let vsoShowing = false;
chrome.pageAction.onClicked.addListener(function (tab) {
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

chrome.runtime.onInstalled.addListener(() => {
  //console.log("previousVersion", details);
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: ".visualstudio.com" }
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});


const methods = {
  //this gets called from the content when user clicks close icon
  setState: (isShowing) => {
    vsoShowing = isShowing;
  },
  openInNewTab: (data, sendResponse) => {
    chrome.tabs.create({ url: data.url });
    sendResponse({ status: "success" });
  }
};

chrome.runtime.onMessage.addListener(function (request) {
  if (methods.hasOwnProperty(request.action)) {
    methods[request.action](request.data);
  }
  return true;
});

function _sendMessage(tab, action, callback) {
  chrome.tabs.sendMessage(tab.id, { action: action }, callback);
}