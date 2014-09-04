"use strict";

var Store = {}
	, queue = []
	, ready = false
	, initCalled = false
	, initError = false

module.exports = exports = Store

Store.PLUGIN_ID = 'VigourIoStore'

Store.StoreTypeNames = {
	0: 'APP_STORE'
	, 1: 'PLAY_STORE'
	, 2: 'MOCK_STORE'
	, 3: 'AMAZON_STORE'
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
		, args: [productIds]
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

Store.unsubscribe = function (productId, cb) {
	exec({
		fn: 'unsubscribe'
		, args: [productId]
		, cb: cb
	})
}

function exec (opts) {
	var needsInit = (opts.needsInit === undefined) ? true : opts.needsInit
	if (needsInit && !ready) {
		queue.push(opts)
		if (!initCalled) {
			initCalled = true
			execute({
				fn: 'setup'
				, cb: function (err) {
					if (err) {
						err.info = "This action requires store initialization, but store initialization fails, producing this error."
						initError = err
					} else {
						initError = false
						ready = true
					}
					next()
				}
			})
		}
	} else {
		if (queue.length === 0) {
			execute(opts)
		} else {
			queue.push(opts)
		}
	}
}

function execute (opts) {
	var args = (opts.args === undefined) ? [] : opts.args
	cordova.exec(
		function (response) {
			opts.cb(null, response)
			next()
		}
		, function (err) {
			opts.cb(err)
			next()
		}
		, Store.PLUGIN_ID
		, opts.fn
		, args)
}

function next () {
	var next = queue.shift()
	if (next) {
		if (initError) {
			next.cb(initError)
		} else {
			execute(next)
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
