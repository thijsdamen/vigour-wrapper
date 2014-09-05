var productIdList = [
	// From iTunes Connect
	'nonConsumable', 'autoRenewedSubscription', 'io.vigour.testNonConsumable', 'nonRenewingSubscription'

	// From Google Play Store
	, 'mtvtest_one_episode', 'mtvtest_one_month', 'mtvtest_one_year'

	// Invalid in both cases
	, 'invalidProductId'
],
	l = productIdList.length,
	nbBuysLeft = l,
	nbUnsubscribesLeft = l,
	i, j


function finishUnsubscribes() {
	if (nbUnsubscribesLeft === 0) {
		notify("All unsubscribes done")
	}
}

function notify() {
	var args = [].slice.call(arguments),
		l = args.length,
		i, str = "",
		text, p
	for (i = 0; i < l; i += 1) {
		try {
			str += JSON.stringify(args[i], null, " ")
		} catch (e) {
			notify("`JSON.stringify(args[i])` throws in function `notify`")
		}
	}
	text = document.createTextNode(str)
	p = document.createElement('p')
	p.appendChild(text)
	document.body.appendChild(p)
}

function finishBuys() {
	if (nbBuysLeft === 0) {
		notify("All buys done")
		Store.restore(function(err, response) {
			if (err) {
				notify("Store.restore(cb) error", err)
			} else {
				notify("Store restore(cb) response", response)
			}
			for (j = 0; j < l; j += 1) {
				(function(iter) {
					Store.unsubscribe(productIdList[iter], function(err, response) {
						nbUnsubscribesLeft -= 1
						if (err) {
							notify("Store.unsubscribe(" + productIdList[iter] + ", cb) error: ", err)
						} else {
							notify("Store.unsubscribe(" + productIdList[iter] + ", cb) response: ", response)
						}
						finishUnsubscribes()
					})
				}(j))
			}
		})
	}
}

function finishUnsubscribes() {
	if (nbUnsubscribesLeft === 0) {
		notify("All unsubscribes done")
	}
}

var app = {

	initialize: function() {
		this.bindEvents();
	},

	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},

	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},

	receivedEvent: function(id) {

		console.log('Received Event: ' + id);

		notify("Store.StoreTypeNames = ", Store.StoreTypeNames)

		Store.getType(function(err, response) {
			if (err) {
				notify("Store.getType(cb) error: ", err)
			} else {
				notify("Store.getType(cb) response: ", response)
				notify("Store type: ", Store.StoreTypeNames[response.storeType])
			}
		})

		Store.fetch(productIdList, function(err, response) {
			if (err) {
				notify("Store.fetch(productIdList, cb) error: ", err)
			} else {
				notify("Store.fetch(productIdList, cb) response: ", response)
			}
		})

		Store.fetch([], function(err, response) {
			if (err) {
				notify("Store.fetch([], cb) error: ", err)
			} else {
				notify("Store.fetch([], cb) response: ", response)
			}
		})
		
		for (i = 0; i < l; i += 1) {
			(function (iter) {
				Store.buy(productIdList[iter], function (err, response) {
					nbBuysLeft -= 1
					if (err) {
						notify("Store.buy(" + productIdList[iter] + ", cb) error: ", err)
					} else {
						notify("Store.buy(" + productIdList[iter] + ", cb) response", response)
					}
					finishBuys()
				})
			}(i))
		}

	}
};
