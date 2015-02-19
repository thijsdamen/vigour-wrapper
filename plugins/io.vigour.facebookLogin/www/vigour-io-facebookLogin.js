cordova.define("io.vigour.facebookLogin.VigourIoFacebookLogin", function(require, exports, module) { "use strict";

    var FB = {}
	    , queue = []
	    , waiting = false

module.exports = exports = FB

FB.PLUGIN_ID = 'VigourIoFacebookLogin'

FB.init = function (cb) {
    exec({
        fn: 'init'
        , args: []
        , cb: cb
    })
}

FB.login = function (cb, options) {
	exec({
		fn: 'login'
		, args: [options.scope]
		, cb: cb
	})
} 

function exec (opts) {
	queue.push(opts)
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
				error = new Error('Facebook login plugin returns unstringifyable value')
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
		, FB.PLUGIN_ID
		, opts.fn
		, args)
}

function next() {
    var nextUp
    if (!waiting) {
        waiting = true
        nextUp = queue.shift()
        if (nextUp) {
            execute(nextUp)
        } else {
            waiting = false
        }
    }
}
});
