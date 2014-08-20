cordova.define("io.vigour.store.VigourIoStore", function(require, exports, module) { "use strict";

var Store = module.exports;
var PLUGIN_ID = "VigourIoStore";
                
Store.StoreType = {
  "APP_STORE" : 0
  , "PLAY_STORE" : 1
	, "MOCK_STORE" : 2
  , "AMAZON_STORE" : 3
};

Store.getType = function (callback) {
	cordova.exec(callback, callback, PLUGIN_ID, "getType", null);
}

Store.fetch = function (productIds, callback) {
	if (!(productIds instanceof Array)) {
		productIds = [].push(productIds);
	}
	cordova.exec(callback, callback, PLUGIN_ID, "fetch", productIds);
};
});
