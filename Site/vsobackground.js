var vsoShowing = false;
chrome.browserAction.onClicked.addListener(function (tab) {
    if (!vsoShowing) {
        injectedMethod(tab, 'showVsoExtenstion', function(response) {
            vsoShowing = true;
            return true;
        });
    } else {
        injectedMethod(tab, 'hideVsoExtenstion', function (response) {
            vsoShowing = false;
            return true;
        });
    }

    var methods = {};

    methods.setState =function (isShowing) {
        vsoShowing = isShowing;
    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (methods.hasOwnProperty(request.method))
            methods[request.method](request.data);
        
        return true;
    });

});

function injectedMethod(tab, method, callback) {
    chrome.tabs.sendMessage(tab.id, { method: method }, callback);
}