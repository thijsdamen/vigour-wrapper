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
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
	
				window.SecondScreen.presentBrowserInSecondScreenWithUrl("http://www.google.com", function() {alert("back from native")});
    },
		setUrl: function(url) {
			window.SecondScreen.presentBrowserInSecondScreenWithUrl(url, function(d) {alert(d)});
		}
};
