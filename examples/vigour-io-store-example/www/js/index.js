
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
		storeType: function() {
			app.clearOutput();
			Store.getType(function(type) {
				var elem = document.createElement("div");
				elem.innerHTML = "store of type: " + type;
				window.getComputedStyle(elem).opacity;
				document.getElementById('results').appendChild(elem);
			});
		},
		fetchProducts: function(args) {
			app.clearOutput();
			Store.fetch(args, function(products) {
				consoe.log(products)
				for(var prod in products) {
					var elem = document.createElement("div");
					elem.innerHTML = 'product: ';
					document.getElementById('results').appendChild(elem);
				}
			});			
		},
		clearOutput:function() {
			var node = document.getElementById("results");
			while (node.firstChild) {
			    node.removeChild(node.firstChild);
			}
		},
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
