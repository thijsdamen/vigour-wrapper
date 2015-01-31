var Promise = require('promise')
	, appName = "MTV Play"
	, monthly = "mtvplay_subscription_monthly"
	, annualy = "mtvplay_subscription_annual"
	, single = "mtvplay_single_episode"

document.addEventListener("deviceready", start, false)

function start () {
	handle("gettype", window.Store.getType)
		.then(function () {
			return handle("fetch"
				, window.Store.fetch
				, [monthly, annualy, single])
		})
		.then(function () {
			return handle("buysingle"
				, window.Store.buy
				, single)
		})
		.then(function () {
			return handle("buymonthly"
				, window.Store.buy
				, monthly)
		})
		.then(function () {
			return handle("buyannualy"
				, window.Store.buy
				, annualy)
		})
		.catch(function (reason) {
			alert("unhandled error")
			alert(reason)
		})
}

function handle (tag, fn) {
	var args = [].slice.call(arguments)
		, extras = args.slice(2)

	return new Promise(function (resolve, reject) {
		var cb = function (err, results) {
			if (err) {
				alert("err:")
				alert(err)
				reject(err)
			}
			try {
				alert(tag + " results: " + JSON.stringify(results))
				resolve(JSON.stringify(results))
			} catch (e) {
				alert("JSON.stringify(results) throws")
				alert(e)
				reject(e)
			}
		}
		alert(tag + "(" + extras + ")")
		extras.push(cb)
		fn.apply(this, extras)
	})
}