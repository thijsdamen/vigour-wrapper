var Store = require('vigour-purchase')
/* Needs testing
	Store.ProductInfo = function (productId, productType, title, description, price, localizedPrice, downloadURL)

	Store.PurchaseInfo = function (transactionId, purchaseTime, purchaseState, productId, quantity)

	Store.getStoreType = function ();

	Store.requestInit = function (parameters);

	Store.start = function ();

	Store.isAvailable = function ();

	Store.fetchProducts = function (productIds);

	Store.endPurchase = function (transactionId)

	Store.consumePurchase = function (transactionId, productId)

	Store.purchaseProduct = function (productId)

	Store.stopRenewal = function (productId)

	Store.puchaseProductModal = function (productId)

	Store.isProductPurchased = function (productId)

	Store.restorePurchases = function ()

	Store.restorePurchasesModal = function ()

	Store.cancelPurchase = function (transactionId)	// TESTING ONLY

	Store.refundPurchase = function (transactionId)	// TESTING ONLY

	Store.expirePurchase = function (transactionId)

	EVENTS

	productsFetchStarted
	productsFetchCompleted
	productsFetchFailed
	productPurchaseStarted
	productPurchaseVerificationRequestReceived
	productPurchaseCompleted
	productPurchaseFailed
	restorePurchasesStarted
	restorePurchasesCompleted
	restorePurchasesFailed
	consumePurchaseStarted
	consumePurchaseCompleted
	consumePurchaseFailed
	cancelAutomaticPurchaseRenewallStarted
	cancelAutomaticPurchaseRenewallCompleted
	cancelAutomaticPurchaseRenewallFailed
*/

Store.isAvailable(function (err, available) {
	if (err) {
		console.log("Error getting store availability: ", err)
	} else {
		if (available) {
			console.log("Store available")
			Store.getType(function (err, storeType) {
				if (err) {
					console.log("Error getting store type: ", err)
				} else {
					console.log("Native store implementation: ", storeType)
				}
			})

			Store.on('fetch', function () {
				console.log("Fetch operation started")
			})

			Store.on('buy', function (productId) {
				console.log("Buy operation started for product of id ", productId)
			})

			Store.on('buyModal', function (productId) {
				console.log("Buy (modal) operation started for product of id ", productId)
			})

			Store.on('restore', function () {
				console.log("Restore operation started")
			})

			Store.on('restored', function (productId) {
				console.log("Product restoration complete for product of id ", productId)
			})

			Store.on('consume', function (transactionId) {
				console.log("Consume operation started for transaction of id ", transactionId)
			})

			Store.on('unsubscribe', function (productId) {
				console.log("Unsubscribe operation started for product of id ", productId)
			})

			Store.on('verif', function (productId, data) {
				console.log("Store want to verify purchase of product of id ". productId)
				console.log("--> data: ", data)
			})

			Store.init(null, function (err) {
				if (err) {
					console.log("Error initializing store: ", err)
				} else {
					console.log("Store initialized")
				}
			})

			Store.start(function (err) {
				if (err) {
					console.log("Error starting store services: ", err)
				} else {
					console.log("Store services started")
				}
			})

			Store.fetch(['someProductId', 'consumableProductId'], function (err, validProducts) {
				var l, i
				if (err) {
					console.log("Error fetching products: ", err)
				} else {
					l = validProducts.length
					for (i = 0; i < l; i += 1) {
						console.log("Fecthed product ProductInfo: ", JSON.stringify(validProducts[i]))
					}
				}
			})

			Store.buy('someProductId', function (err, info) {
				if (err) {
					console.log("Error purchasing product: ", err)
				} else {
					console.log("Product purchase complete. PurchaseInfo: ", JSON.stringify(info))
				}
			})

			Store.buyModal('consumableProductId', function (err, info) {
				if (err) {
					console.log("Error purchasing product: ", err)
				} else {
					console.log("Product purchase complete. PurchaseInfo: ", JSON.stringify(info))
					Store.comsume(info.transactionId, info.productId, function (err) {
						if (err) {
							console.log("Error consuming purchase: ", err)
						} else {
							console.log("Purchase consumption completed")
						}
					})
				}
			})

			Store.unsubscribe('someProductId', function (err) {
				if (err) {
					console.log("Error unsubscribing: ", err)
				} else {
					console.log("Unsubscription successful")
				}
			})

			Store.isPurchased('someProductId', function (err, purchased) {
				if (err) {
					console.log("Error checking the purchased status of 'someProductId'")
				} else {
					if (purchased) {
						console.log("'someProductId' is already purchased")
					} else {
						console.log("'someProductId' is not already purchased")
					}
				}
			})

			Store.restore(function (err) {
				if (err) {
					console.log("Error restoring purchases")
				} else {
					console.log("Purchases restored")
				}
			})

			Store.restoreModal(function (err) {
				if (err) {
					console.log("Error restoring purchases")
				} else {
					console.log("Purchases restored")
				}
			})
		} else {
			console.log("Store unavailable")
		}
	}
})