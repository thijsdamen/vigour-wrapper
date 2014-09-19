"use strict";

var Store = {}
	, queue = []
	, ready = false
	, initCalled = false
	, initError = false
	, waiting = false

module.exports = exports = Store

Store.PLUGIN_ID = 'VigourIoStore'

Store.StoreTypeNames = {
	0: 'APP_STORE'
	, 1: 'PLAY_STORE'
	, 2: 'MOCK_STORE'
	, 3: 'AMAZON_STORE'
	, 4: 'WINDOWS_STORE'
}

Store.getType = function(cb) {
	exec({
		fn: 'getType'
		, cb: cb
	})
}

Store.fetch = function(productIds, cb) {
	exec({
		fn: 'fetch'
		, args: productIds
		, cb: cb
	})
}

Store.buy = function(productId, cb) {
	exec({
		fn: 'buy'
		, args: [productId]
		, cb: cb
	})
}

Store.restore = function(cb) {
	exec({
		fn: 'restore'
		, cb: cb
	})
}

function exec (opts) {
	var needsInit = (opts.needsInit === undefined) ? true : opts.needsInit
	queue.push(opts)
	if (needsInit && !ready) {
		if (!initCalled) {
			initCalled = true
			queue.unshift({
				fn: 'setup'
				, cb: function (err) {
					if (err) {
						err.isStoreInitErr = true
						initError = err
					} else {
						initError = false
						ready = true
					}
				}
			})
		}
	}
	next()
}

function execute (opts) {
	var args = (opts.args === undefined) ? [] : opts.args
	cordova.exec(
		function (response) {
			var returnValue
				, error
			try {
				returnValue = JSON.parse(response)
			} catch (e) {
				// alert('Error parsing response')
				error = new Error('Store plugin return value unparsable as JSON')
			}
			if (error) {
				// opts.cb(error, response)
				opts.cb(null, response)
			} else {
				opts.cb(null, returnValue)
			}
			
			waiting = false
			next()
		}
		, function (err) {
			opts.cb(err)
			waiting = false
			next()
		}
		, Store.PLUGIN_ID
		, opts.fn
		, args)
}

function next () {
	var nextUp
	if (!waiting) {
		waiting = true
		nextUp = queue.shift()
		if (nextUp) {
			if (initError) {
				waiting = false
				nextUp.cb(initError)
				next()
			} else {
				execute(nextUp)
			}
		} else {
			waiting = false
		}
	}
}

// The following will be removed as soon as another solution is implemented natively
Store.updatedTransactionCallback = function(state, transactionIdentifier, productId, error) {
	switch (state) {
		case 'PaymentTransactionStatePurchased':
			alert("purchased: " + transactionIdentifier + " " + productId)
			break
		case 'PaymentTransactionStateFailed':
			alert(error.description + " " + error.code)
			break
		case 'PaymentTransactionStateRestored':
			alert("restored " + transactionIdentifier + " " + productId)
			break
		case 'PaymentTransactionStateFinished':
			alert("finished " + transactionIdentifier + " " + productId)
			break
		default:
			alert("unhandled updatedTransactionCallback state: " + state)
	}
}
