
	/**
		* The data structure that represents the information of a product in the store.
		* @namespace
		* @constructor
		* @param {string} productId The id of the product.
		* @param {Store.ProductType} productType The product type @see Store.ProductType.
		* @param {string} title The title of the product.
		* @param {string} description The description of the product.
		* @param {string} price The price of the product.
		* @param {string} localizedPrice The localized price of the product.
		* @param {string} downloadURL The URL of the asset to be downloaded for this purchase.
		*/
	Store.ProductInfo = function(productId, productType, title, description, price, localizedPrice, downloadURL)

	/**
    * The predefined possible product types.
    * @namespace 
    */
	Store.ProductType = 
	{
		/**
			* A consumable product. Payment is required for every download
			*/
	  CONSUMABLE : 0,

		/**
			* A non-cunsumable product. Payment is required only once
			*/
	  NON_CONSUMABLE : 1,

	  /**
			* An auto-renewable subscription, automatically purchased periodically.
			*/
	  AUTO_RENEWABLE_SUBSCRIPTION : 2,

	  /**
			* A free subscription.
			*/
	  FREE_SUBSCRIPTION : 3,

	  /**
			* A non-renewable subscription.
			*/
	  NON_RENEWABLE_SUBSCRIPTION : 4
	};

	/**
    * The predefined possible store types.
    * @namespace 
    */
	Store.StoreType = 
	{
		/**
			* Apple AppStore
			*/
	  APP_STORE : 0,

    /**
	    * Android Play Store
	    */
	  PLAY_STORE : 1,

		/**
			* Mock Store
			*/
		MOCK_STORE : 2,

	  /**
	    * Amazon AppStore
	    */
	  AMAZON_STORE : 3
	};

	/**
		* The data structure that represents the information of a purchase.
		* @namespace
		* @constructor
		* @param {string} transactionId The transaction id of a purchase.
		* @param {string} purchaseTime The time when the purchase was done in seconds since 1970.
		* @param {Store.PurchaseState} purchaseState The state of the purchase. @see Store.PurchaseState
		* @param {string} productId The product id related to this purchase.
		* @param {number} quantity The number of products of the productId kind purchased in this transaction.
		*/
	Store.PurchaseInfo = function(transactionId, purchaseTime, purchaseState, productId, quantity)

	/**
    * The predefined possible states of a purchase.
    * @namespace 
    */
	Store.PurchaseState = 
	{
		/**
			* The product has been successfully purchased. The transaction has ended successfully.
			*/
	  PURCHASED : 0,

		/**
			* The purchase has been canceled.
			*/
	  CANCELED : 1,

	  /**
			* The purchase has been refunded.
			*/
	  REFUNDED : 2,

	  /**
			* The purchase (subscriptions only) has expired and is no longer valid.
			*/
	  EXPIRED : 3
	};

	/**
		* Gets the name of the native store implementation. 
		* @return {Store.StoreType} The store type
		* @function
		*/ 
	Store.getStoreType = function();

	/**
		* Initialize the service with service level initialization parameters.
		* @function
		* @param {object} parameters An object with the required initialization parameters for the service.
		*/
	Store.requestInitialization = function(parameters);

	/**
		* Starts the Store Service. 
		* This will make the system to initialize the Store Service. Store callbacks will probably start to be received after calling this method so event handlers will have to be set before calling this method.
		* @function
		*/ 
	Store.start = function();

	/**
		* This method allows you to check if the  Store service is available in this platform.
		* Not all iOS and Android devices will have the Store service available so availability should be checked before doing anything else.
		* @function
		* @return {boolean} True if the service is available and false otherwise.
		*/ 
	Store.canPurchase = function();

	/**
		* Fetches the products' information from the Store. 
		* The request is monitored using the {@link Store.onProductsFetchStarted}, {@link Store.onProductsFetchCompleted} and {@link Store.onProductsFetchFailed} event handlers.
		* @function
		* @param {array} productIds An array with the ids of the products to retrieve information for.
		* @see Store.onProductsFetchStarted
		* @see Store.onProductsFetchCompleted
		* @see Store.onProductsFetchFailed
		*/ 
	Store.fetchProductsFromStore = function(productIds);

	/**
		* Finish a purchase transaction and removes the transaction from the transaction queue. 
		* This method must be called after a purchase finishes successfully and the  {@link Store.onProductPurchaseCompleted} callback has been received. 
		* If the purchase includes some asset to download from an external server this method must be called after the asset has been successfully downloaded. 
		* If you do not finish the transaction because the asset has not been correctly downloaded the {@link Store.onProductPurchaseStarted} method will be called again later on.
		* @function
		* @param {string} transactionId The transactionId of the purchase to finish.
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		*/ 
	Store.finishPurchase = function(transactionId)

	/**
		* Consumes a purchase. This allows that product to be purchasable again. 
		* @function
		* @param {string} transactionId The transaction Id of the purchase to consume.
		* @param {string} productId The productId of the product to be consumed.
		*/ 
	Store.consumePurchase = function(transactionId, productId)

	/**
		* Request a product purchase given it's product id. 
		* The request is monitored using the {@link Store.onProductPurchaseStarted}, {@link onProductPurchaseCompleted} and {@link Store.onProductPurchaseFailed} event handlers.
		* @function
		* @param {string} productId The id of the product to be purchased.
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		* @see Store.onProductPurchaseFailed
		*/ 
	Store.purchaseProduct = function(productId)

	/**
		* Stop automatic renewall of a purchase for given product id. Only works for products which are of product type {@link Store.ProductType.AUTO_RENEWABLE_SUBSCRIPTION}.
		* The request is monitored using the {@link Store.onCancelAutomaticPurchaseRenewallStarted}, {@link onCancelAutomaticPurchaseRenewallCompleted} and {@link Store.onCancelAutomaticPurchaseRenewallFailed} event handlers.
		* @function
		* @param {string} productId The id of the product for which automatic purchase renewall should be stopped.
		* @see Store.onCancelAutomaticPurchaseRenewallStarted
		* @see Store.onCancelAutomaticPurchaseRenewallCompleted
		* @see Store.onCancelAutomaticPurchaseRenewallFailed
		*/ 
	Store.stopRenewall = function (productId)

	/**
		* Request a product purchase given it's product id showing a modal progress dialog. 
		* The request is monitored using the {@link Store.onProductPurchaseStarted}, {@link onProductPurchaseCompleted} and {@link Store.onProductPurchaseFailed} event handlers.
		* @function
		* @param {string} productId The id of the product to be purchased.
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		* @see Store.onProductPurchaseFailed
		*/ 
	Store.puchaseProductModal = function(productId)

	/**
		* Returns if a product has been already purchased or not. 
		* @function
		* @param {string} productId The product id of the product to be checked.
		* @returns {boolean} A flag that indicates whether the product has been already purchased (true) or not (false).
		*/
	Store.isProductPurchased = function(productId)

	/**
		* Restores all the purchases from the platform's market.
		* For each already purchased product {@link Store.onProductPurchaseStarted}, {@link Store.onProductPurchaseCompleted} and {@link Store.onProductPurchaseFailed} event handlers are called again.
		* The request can also be monitored using the {@link Store.onRestorePurchasesStarted}, {@link Store.onRestorePurchasesCompleted} and {@link Store.onRestorePurchasesFailed} event handlers.
		* @function
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		* @see Store.onProductPurchaseFailed
		* @see Store.onRestorePurchasesStarted
		* @see Store.onRestorePurchasesCompleted
		* @see Store.onRestorePurchasesFailed
		*/
	Store.restorePurchases = function()

	/**
		* Restores all the purchases from the platform's market showing a modal progress dialog. 
		* For each already purchased product {@link Store.onProductPurchaseStarted}, {@link Store.onProductPurchaseCompleted} and {@link Store.onProductPurchaseFailed} event handlers are called again.
		* The request can also be monitored using the {@link Store.onRestorePurchasesStarted}, {@link Store.onRestorePurchasesCompleted} and {@link Store.onRestorePurchasesFailed} event handlers.
		* @function
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		* @see Store.onProductPurchaseFailed
		* @see Store.onRestorePurchasesStarted
		* @see Store.onRestorePurchasesCompleted
		* @see Store.onRestorePurchasesFailed
		*/
	Store.restorePurchasesModal = function()

	/**
		* (TESTING ONLY) Simulate a purchase cancel. 
		* This method is not allowed in production services and will only work in Mocks. 
		* The request is monitored using the {@link Store.onProductPurchaseStarted}, {@link Store.onProductPurchaseCompleted} and {@link Store.onProductPurchaseFailed} event handlers.
		* @function
		* @param {string} transactionId The transactionId of the purchase to be canceled.
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		* @see Store.onProductPurchaseFailed
		*/
	Store.cancelPurchase = function(transactionId)

	/**
		* (TESTING ONLY) Simulate a purchase refundment. 
		* This method is not allowed in production services and will only work in Mocks. 
		* The request is monitored using the {@link Store.onProductPurchaseStarted}, {@link Store.onProductPurchaseCompleted} and {@link Store.onProductPurchaseFailed} event handlers.
		* @function
		* @param {string} transactionId The transactionId of the purchase to be refunded.
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		* @see Store.onProductPurchaseFailed
		*/
	Store.refundPurchase = function(transactionId)

	/**
		* (TESTING ONLY) Simulate a purchase expiration. 
		* This method is not allowed in production services and will only work in Mocks. 
		* The request is monitored using the {@link Store.onProductPurchaseStarted}, {@link Store.onProductPurchaseCompleted} and {@link Store.onProductPurchaseFailed} event handlers.
		* @function
		* @param {string} transactionId The transactionId of the purchase to be expired.
		* @see Store.onProductPurchaseStarted
		* @see Store.onProductPurchaseCompleted
		* @see Store.onProductPurchaseFailed
		*/
	Store.expirePurchase = function(transactionId)

	/**
    * This {@link EventHandler} object allows listening to events called when the products fetch has started.
    * The callback function receives no parameters.
    * @static
    * @event
    */
	Store.onProductsFetchStarted

  /**
    * This {@link EventHandler} object allows listening to events called when the products fetch has completed.
    * The callback function receives one parameter: an array of the valid products.
    * @static
    * @event
    * @param {array} validProducts An array of {@link Store.ProductInfo} objects representing all the valid fetched products.
    */
	Store.onProductsFetchCompleted

  /**
    * This {@link EventHandler} object allows listening to events called when the products fetch has failed.
    * The callback function receives one parameter: an error message.
    * @static
    * @event
    * @param {string} errorMessage The error message.
    */
	Store.onProductsFetchFailed

  /**
    * This {@link EventHandler} object allows listening to events called when the purchase of a product starts.
    * The callback function receives one parameter: the information of the purchased product {@see Store.ProductInfo}.
    * @static
		* @event
    * @param {Store.ProductInfo} productInfo The information of the purchased product.
    */
	Store.onProductPurchaseStarted

	/**
    * This {@link EventHandler} object allows listening to events called when a request for purchase verification has been received from the Store.
    * The callback function receives two parameters:
    *		1) the productId of the purchased product
    *		2) a JSON object containing the data to be verified
    * 		In Android this JSON object will containt two keys: signedData and signature. This information will be needed to verify the purchase against the backend server.
    * @static
    * @event
    * @param {string} productId The product id of the product to be verified.
    * @param {string} data The string with the data to be verified.
    */
	Store.onProductPurchaseVerificationRequestReceived

  /**
    * This {@link EventHandler} object allows listening to events called when the purchase of a product succeeds.
    * The callback function receives one parameter: the information of the purchase {@see Store.PurchaseInfo}.
    * @static
    * @event
    * @param {Store.PurchaseInfo} purchaseInfo The purchase info.
    */
	Store.onProductPurchaseCompleted

  /**
    * This {@link EventHandler} object allows listening to events called when the purchase of a product fails.
    * The callback function receives two parameters:
    *		1) the product id
    *		2) an error message
    * @static
    * @event
    * @param {string} productId The product id.
    * @param {string} errorMessage The error message.
    */
	Store.onProductPurchaseFailed

  /**
    * This {@link EventHandler} object allows listening to events called when the restore purchases operation has started.
    * The callback function receives no parameters.
    * @static
    * @event
    */
	Store.onRestorePurchasesStarted

  /**
    * This {@link EventHandler} object allows listening to events called when the restore purchases operation has completed.
    * The callback function receives no parameters.
    * @static
    * @event
    */
	Store.onRestorePurchasesCompleted

	/**
    * This {@link EventHandler} object allows listening to events called when the restore purchases operation has failed.
    * The callback function receives one parameter: an error message.
    * @static
    * @event
    * @param {string} errorMessage The error message.
    */
	Store.onRestorePurchasesFailed

	/**
    * This {@link EventHandler} object allows listening to events called when the consume purchase operation has started.
    * The callback function receives one parameter: the transaction id of the purchase being consumed.
    * @static
    * @event
    * @param {string} transactionId The transaction id of the purchase being consumed.
    */
	Store.onConsumePurchaseStarted

  /**
    * This {@link EventHandler} object allows listening to events called when the consume purchase operation has completed.
    * The callback function receives one parameter: the transaction id of the purchase being consumed.
    * @static
    * @event
    * @param {string} transactionId The transaction id of the consumed purchase.
    */
	Store.onConsumePurchaseCompleted

	/**
    * This {@link EventHandler} object allows listening to events called when the consume purchase operation has failed.
    * The callback function receives two parametera:
    	1) the transaction id of the purchase which couln't be consumed
    	2) an error message
    * @static
    * @event
    * @param {string} transactionId The transaction id of the purchase that couldn't be consumed.
    * @param {string} errorMessage The error message.
    */
	Store.onConsumePurchaseFailed

	/**
		* This {@link EventHandler} object allows listening to event called when an automatic purchase renewall cancellation operation has started.
		* The callback function receives one parameter: the product id of the product whose automatic purchase renewall is being canceled.
		* @static
		* @event
		* @param {string} productId the product id of the product whose automatic purchase renewall is being canceled.
		*/
	Store.onCancelAutomaticPurchaseRenewallStarted

	/**
		* This {@link EventHandler} object allows listening to event called when an automatic purchase renewall cancellation operation has completed.
		* The callback function receives one parameter: the product id of the product whose automatic purchase renewall has been successfully canceled.
		* @static
		* @event
		* @param {string} productId the product id of the product whose automatic purchase renewall has been successfully canceled.
		*/	
	Store.onCancelAutomaticPurchaseRenewallCompleted

	/**
		* This {@link EventHandler} object allows listening to event called when an automatic purchase renewall cancellation operation has failed.
		* The callback function receives two parameters:
		*		1) the product id of the product whose automatic purchase renewall cancellation has failed.
		*		2) An error message
		* @static
		* @event
		* @param {string} productId the product id of the product whose automatic purchase renewall cancellation has failed.
		* @param {string} errorMessage the error message
		*/	
	Store.onCancelAutomaticPurchaseRenewallFailed
