var Promise = require('promise')
	, appName = "MTV Play"
	, monthly = "mtvplay_subscription_monthly"
	, annualy = "mtvplay_subscription_annual"
	, single = "mtvplay_single_episode"

//document.addEventListener("deviceready", start, false)
document.getElementById('thebutton').addEventListener("click", start)
function start() {
	handle("gettype", window.Store.getType)
		.then(function () {
			return handle("fetch"
				, window.Store.fetch
				, [monthly, annualy, single])
		})
		.catch(function (reason) {
			return true
		})
		.then(function () {
			return handle("buysingle"
				, window.Store.buy
				, single)
		})
		.catch(function (reason) {
			return true
		})
		// .then(function () {
		// 	return handle("buymonthly"
		// 		, window.Store.buy
		// 		, monthly)
		// })
		// .catch(function (reason) {
		// 	return true
		// })
		.then(function () {
			return handle("buyannualy"
				, window.Store.buy
				, annualy)
		})
		.catch(function (reason) {
			msg("unhandled error")
			try {
				msg(JSON.stringify(reason, null, 2))
			} catch (e) {
				msg(e)
			}
		})
}

function handle(tag, fn) {
	var args = [].slice.call(arguments)
		, extras = args.slice(2)

	return new Promise(function (resolve, reject) {
		var cb = function (err, results) {
			if (err) {
				msg("err:")
				try {
					msg(JSON.stringify(err))
				} catch (e) {
					msg("JSON.stringify(err) throws")
					msg(e)
				}
				reject(err)
			} else {
				try {
					msg(tag + " results: " + JSON.stringify(results))
					resolve(JSON.stringify(results))
				} catch (e) {
					msg("JSON.stringify(results) throws")
					msg(e)
					reject(e)
				}
			}
		}
		msg(tag + "(" + extras + ")")
		extras.push(cb)
		fn.apply(this, extras)
	})
}

function msg(txt) {
	document.getElementsByTagName('body')[0].appendChild(document.createTextNode(txt))
	document.getElementsByTagName('body')[0].appendChild(document.createElement('br'))
	document.getElementsByTagName('body')[0].appendChild(document.createElement('br'))
}