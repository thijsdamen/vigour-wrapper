var Promise = require('promise')
	, appName = "MTV Play"
	, monthly = "mtvplay_subscription_monthly"
	, annualy = "mtvplay_subscription_annual"
	, single = "mtvplay_single_episode"

//document.addEventListener("deviceready", start, false)
document.getElementById('thebutton').addEventListener("click", start)
function start () {
	handle("gettype", window.Store.getType)
		//.then(function () {
		//	return handle("fetch"
		//		, window.Store.fetch
		//		, [monthly, annualy, single])
		//})
		.then(function () {
			return handle("buysingle"
				, window.Store.buy
				, single)
		})
		//.then(function () {
		//	return handle("buymonthly"
		//		, window.Store.buy
		//		, monthly)
		//})
		//.then(function () {
		//	return handle("buyannualy"
		//		, window.Store.buy
		//		, annualy)
		//})
		.catch(function (reason) {
			alerty("unhandled error")
			alerty(reason)
		})
}

function handle (tag, fn) {
	var args = [].slice.call(arguments)
		, extras = args.slice(2)

	return new Promise(function (resolve, reject) {
		var cb = function (err, results) {
			if (err) {
				alerty("err:")
				try {
					alerty(JSON.stringify(err))
				} catch (e) {
					alerty("JSON.stringify(err) throws")
					alerty(e)
				}
				reject(err)
			}
			try {
				alerty(tag + " results: " + JSON.stringify(results))
				resolve(JSON.stringify(results))
			} catch (e) {
				alerty("JSON.stringify(results) throws")
				alerty(e)
				reject(e)
			}
		}
		alerty(tag + "(" + extras + ")")
		extras.push(cb)
		fn.apply(this, extras)
	})
}

function alerty(msg) {
	document.getElementsByTagName('body')[0].appendChild(document.createTextNode(msg))
	document.getElementsByTagName('body')[0].appendChild(document.createElement('br'))
	document.getElementsByTagName('body')[0].appendChild(document.createElement('br'))
}