"use strict";

var Store = module.exports;
var PLUGIN_ID = "VigourIoStore";
                
Store.StoreType = {
  "APP_STORE" : 0
  , "PLAY_STORE" : 1
	, "MOCK_STORE" : 2
  , "AMAZON_STORE" : 3
};


Store.init = function (callback) {
    cordova.exec(callback, callback, "VigourIoStore", "setup", []);
}

Store.getType = function (callback) {
	cordova.exec(callback, callback, PLUGIN_ID, "getType", null);
}

Store.fetch = function (productIds, callback) {
	if (!(productIds instanceof Array)) {
		productIds = [].push(productIds);
	}
	cordova.exec(callback, callback, PLUGIN_ID, "fetch", productIds);
};
               
Store.buy = function (productId, callback) {
	cordova.exec(callback, callback, PLUGIN_ID, "buy", productIds);
}