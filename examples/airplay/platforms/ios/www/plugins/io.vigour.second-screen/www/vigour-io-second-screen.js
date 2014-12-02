cordova.define("io.vigour.second-screen.VigourIoSecondScreen", function(require, exports, module) { "use strict";

var SecondScreen = {
    presentBrowserInSecondScreenWithUrl: function (urlString, cb) {
        cordova.exec(cb, cb, "VigourIoSecondScreen", "presentBrowserInSecondScreenWithUrl", [urlString]);
    }
};

module.exports = exports = SecondScreen;

SecondScreen.PLUGIN_ID = 'VigourIoSecondScreen';
});
