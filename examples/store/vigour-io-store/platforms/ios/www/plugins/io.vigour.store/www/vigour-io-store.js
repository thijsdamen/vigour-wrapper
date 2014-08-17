cordova.define("io.vigour.store.VigourIoStore", function(require, exports, module) { "use strict";

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
});
