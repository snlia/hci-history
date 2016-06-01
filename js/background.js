var b = {
    keyVersion: "version",
    contextMenuId: undefined,
    // A generic onclick callback function.
    userOnClick: function (info, tab) {
        var url = "../Level1/index.html";
        chrome.tabs.create({ url: url });
        //chrome.tabs.executeScript(null, { file: "js/content-script.js" });
    },

    initBrowserAction: function () {
        chrome.browserAction.onClicked.addListener(function (tab) {
            b.userOnClick();
        });
    }
};


b.initBrowserAction();