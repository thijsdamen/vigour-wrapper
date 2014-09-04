"use strict";

var Store = module.exports;
var PLUGIN_ID = "VigourIoStore";

Store.StoreType = {
	"APP_STORE": 0,
	"PLAY_STORE": 1,
	"MOCK_STORE": 2,
	"AMAZON_STORE": 3
};


Store.init = function(callback) {
	cordova.exec(callback, callback, "VigourIoStore", "setup", []);
}

Store.getType = function(callback) {
	cordova.exec(callback, callback, PLUGIN_ID, "getType", []);
}

Store.fetch = function(productIds, callback) {
	cordova.exec(callback, callback, PLUGIN_ID, "fetch", productIds);
};

Store.buy = function(productId, callback) {
	var productIds = [];
	if (!(productId instanceof Array)) {
		productIds.push(productId);
	} else {
		productIds = productId;
	}
	cordova.exec(callback, callback, PLUGIN_ID, "buy", productIds);
}

Store.restore = function(callback) {
	cordova.exec(callback, callback, PLUGIN_ID, "restore", []);
}

Store.updatedTransactionCallback = function(state, transactionIdentifier, productId, error) {
	switch (state) {
		case "PaymentTransactionStatePurchased":
			alert('purchased: ' + transactionIdentifier + ' ' + productId);
			return;
		case "PaymentTransactionStateFailed":
			alert(error.description + ' ' + error.code);
			return;
		case "PaymentTransactionStateRestored":
			alert('resored ' + transactionIdentifier + ' ' + productId);
			return;
		case "PaymentTransactionStateFinished":
			alert('finished ' + transactionIdentifier + ' ' + productId);
			return;
	}
};
