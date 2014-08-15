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
Store.ProductInfo = function (productId, productType, title, description, price, localizedPrice, downloadURL)


/**
	* The data structure that represents the information of a purchase.
	* @constructor
	* @param {string} transactionId The transaction id of a purchase.
	* @param {string} purchaseTime The time when the purchase was done in seconds since 1970.
	* @param {Store.PurchaseState} purchaseState The state of the purchase. @see Store.PurchaseState
	* @param {string} productId The product id related to this purchase.
	* @param {number} quantity The number of products of the productId kind purchased in this transaction.
	*/
Store.PurchaseInfo = function (transactionId, purchaseTime, purchaseState, productId, quantity)




/**
	* Gets the name of the native store implementation. 
	* The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	* 	storeType {Store.StoreType} The store type
	*/ 
Store.getType = function (callback);


/**
	* Initialize the service with service level initialization parameters.
	* @param {object} parameters An object with the required initialization parameters for the service.  If `null` is passed, sensible defaults should be used.
	* The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*/
Store.init = function (parameters, callback);


/**
	* Starts the Store Service. 
	* Initializes the Store Service. Store events may now be emitted, so some event handlers will have to be set before calling this method.
	* The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*/ 
Store.start = function (callback);


/**
	* This method allows you to check if the Store service is available in this platform.
	* Not all iOS and Android devices will have the Store service available so availability should be checked before doing anything else.
	* The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	* 	available {boolean} True if the service is available and false otherwise.
	*/ 
Store.isAvailable = function (callback);


/**
	* Fetches information from the Store for products corresponding to the provided product ids. 
	* This method triggers the {@link fetch} event.
	* @param {array} productIds An array with the ids of the products to retrieve information for.
  * The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*		validProducts {array}	An array of {@link Store.ProductInfo} objects representing all the valid fetched products.
	*/ 
Store.fetch = function (productIds, callback)


/**
	* Request a product purchase given it's product id. 
	* This method triggers the {@link buy} event.
	* @param {string} productId The id of the product to be purchased.
  * The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*		info {Store.PurchaseInfo} The information of the purchase.
	*/ 
Store.buy = function (productId, callback)


/**
	* Request a product purchase given it's product id, using native modal progress dialog. 
	* This method triggers the {@link buyModal} event.
	* @param {string} productId The id of the product to be purchased.
  * The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*		info {Store.PurchaseInfo} The information of the purchase.
	*/ 
Store.buyModal = function (productId, callback)


/**
	* Consumes a purchased product. This allows that consumable product to be purchasable again. Only works with Consumable products.
	* @param {string} transactionId The transaction Id of the purchase to consume.
	* @param {string} productId The productId of the product to be consumed.
	* The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*/ 
Store.consume = function (transactionId, productId, callback)


/**
	* Stop automatic renewall of a purchase (unsubscribe from a renewable subscription). Only works for products which are of product type {@link Store.ProductType.AUTO_RENEWABLE_SUBSCRIPTION}.
	* This method triggers the {@link unsubscribe} event.
	* @param {string} productId The id of the product to unsubscribe from.
  * The callback function receives the following parameters:
	* 	err {object} An error object or `null` if the operation terminated successfully
	*/ 
Store.unsubscribe = function (productId, callback)


/**
	* Tells if a product has been already purchased or not.
	* @param {string} productId The id of the product.
  * The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*		purchased {boolean} A flag that indicates whether the product has been already purchased (true) or not (false).
	*/
Store.isPurchased = function (productId, callback)


/**
	* Restores all the purchases from the platform's market (for cases where the user deleted them or switched devices).
	* This method triggers the {@link restore} event and the {@link restored} event for every product that was indeed restored.
  * The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*		restored {array} An array or ids of the products that were indeed restored
	*/
Store.restore = function (callback)


/**
	* Restores all the purchases from the platform's market (for cases where the user deleted them or switched devices), using native modal progress dialog.
	* This method triggers the {@link restore} event and the {@link restored} event for every product that was indeed restored.
  * The callback function receives the following parameters:
	*		err {object} An error object or `null` if the operation terminated successfully
	*		restored {array} An array or ids of the products that were indeed restored
	*/
Store.restoreModal = function (callback)


/**
	* (INTENDED FOR TESTING ONLY) Simulate a purchase cancel. 
	* @param {string} transactionId The transactionId of the purchase to be canceled.
	*/
Store.cancelPurchase = function (transactionId)


/**
	* (INTENDED FOR TESTING ONLY) Simulate a purchase refundment.
	* @param {string} transactionId The transactionId of the purchase to be refunded.
	*/
Store.refundPurchase = function (transactionId)


/**
	* (INTENDED FOR TESTING ONLY) Simulate a purchase expiration. 
	* @param {string} transactionId The transactionId of the purchase to be expired.
	*/
Store.expirePurchase = function (transactionId)


// Store should use the same event emitter we use in vigour-js [EventEmitter3](https://www.npmjs.org/package/eventemitter3) to provide `Store.on`, `Store.off`, etc., allowing one to listen to the following events:


/**
  * This event is triggered when the fetch method starts.
	* The callback function is called without parameters.
  */
Store.on('fetch', callback)


/**
  * This event is triggered when the purchase of a product starts.
  * The callback function receives the following parameters:
	*		productId {string} The id of the purchased product.
  */
Store.on('buy', callback)


/**
  * This event is triggered when the restore purchases operation has started.
  * The callback function is called without parameters.
  */
Store.on('restore', callback)

/**
	* This event is triggered when the restore purchase operation restored a purchase.
	* The callback function receives the following parameters:
	* 	productId {string} The id of the product which was restored
  */
Store.on('restored', callback)


/**
  * This event is triggered when the consume purchase operation has started.
  * The callback function receives the following parameters:
  *		transactionId {string} the transaction id of the purchase being consumed.
  */
Store.on('consume', callback)


/**
	* This event is triggered when automatic purchase renewall cancellation (unsubscription) starts.
  * The callback function receives the following parameters:
	*		productId {string} the product id of the product whose automatic purchase renewall is being canceled.
	*/
Store.on('unsubscribe', callback)

/**
	* This event is triggered when a store ask for a product purchase to be verified.
	* The callback function receives the following parameters:
	*		productId {string} the product id of the product whose purchase should be verified
	*		data {object} the data provided by the store
	*/
Store.on('verif', callback)
