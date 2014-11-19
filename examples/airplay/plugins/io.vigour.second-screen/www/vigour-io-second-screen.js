"use strict";

var SecondScreen = {
    presentBrowserInSecondScreenWithUrl: function (urlString, cb) {
        cordova.exec(cb, cb, "VigourIoSecondScreen", "presentBrowserInSecondScreenWithUrl", [urlString]);
    }
};

// module.exports = SecondScreen;

module.exports = exports = SecondScreen;

SecondScreen.PLUGIN_ID = 'VigourIoSecondScreen';