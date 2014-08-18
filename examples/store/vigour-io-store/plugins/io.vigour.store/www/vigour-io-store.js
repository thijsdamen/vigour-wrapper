"use strict";

var Store = module.exports;
var PLUGIN_ID = "VigourIoStore";
               
               
/**
  * Possible product types.
  */
Store.ProductType = {
	/**
		* A consumable product. Payment is required for every download
		*/
  CONSUMABLE : 0
	/**
		* A non-cunsumable product. Payment is required only once
		*/
  , NON_CONSUMABLE : 1
  /**
		* An auto-renewable subscription, automatically purchased periodically.
		*/
  , AUTO_RENEWABLE_SUBSCRIPTION : 2
  /**
		* A free subscription.
		*/
  , FREE_SUBSCRIPTION : 3
  /**
		* A non-renewable subscription.
		*/
  , NON_RENEWABLE_SUBSCRIPTION : 4
};


/**
  * Possible store types.
  */
Store.StoreType = {
	/**
		* Apple AppStore
		*/
  APP_STORE : 0
  /**
    * Android Play Store
    */
  , PLAY_STORE : 1
	/**
		* Mock Store (for testing purposes)
		*/
	, MOCK_STORE : 2
  /**
    * Amazon AppStore
    */
  , AMAZON_STORE : 3
};

/**
  * The predefined possible states of a purchase.
  */
Store.PurchaseState = 
{
	/**
		* The product has been successfully purchased. The transaction has ended successfully.
		*/
  PURCHASED : 0
	/**
		* The purchase has been canceled.
		*/
  , CANCELED : 1
  /**
		* The purchase has been refunded.
		*/
  , REFUNDED : 2
  /**
		* The purchase (subscriptions only) has expired and is no longer valid.
		*/
  , EXPIRED : 3
};

/**
	* The data structure that represents the information of a product in the store.
	* @constructor
	* @param {string} productId The id of the product.
	* @param {Store.ProductType} productType The product type @see Store.ProductType.
	* @param {string} title The title of the product.
	* @param {string} description The description of the product.
	* @param {string} price The price of the product.
	* @param {string} localizedPrice The localized price of the product.
	* @param {string} downloadURL The URL of the asset to be downloaded for this purchase.
	*/
Store.ProductInfo = function (productId, productType, title, description, price, localizedPrice, downloadURL) {
	
}


/**
	* The data structure that represents the information of a purchase.
	* @constructor
	* @param {string} transactionId The transaction id of a purchase.
	* @param {string} purchaseTime The time when the purchase was done in seconds since 1970.
	* @param {Store.PurchaseState} purchaseState The state of the purchase. @see Store.PurchaseState
	* @param {string} productId The product id related to this purchase.
	* @param {number} quantity The number of products of the productId kind purchased in this transaction.
	*/
Store.PurchaseInfo = function (transactionId, purchaseTime, purchaseState, productId, quantity) {
	
}




/**
	* Gets the name of the native store implementation. 
	* The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	* 	storeType {Store.StoreType} The store type
	*/ 
Store.getType = function (callback) {
	
}


/**
	* Fetches information from the Store for products corresponding to the provided product ids. 
	* This method triggers the {@link fetch} event.
	* @param {array} productIds An array with the ids of the products to retrieve information for.
  * The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*		validProducts {array}	An array of {@link Store.ProductInfo} objects representing all the valid fetched products.
	*/ 
Store.fetch = function (productIds, callback) {
	if (!(productIds instanceof Array)) {
		productIds = [].push(productIds);
	}
	cordova.exec(callback, null, PLUGIN_ID, "fetch", productIds);
};