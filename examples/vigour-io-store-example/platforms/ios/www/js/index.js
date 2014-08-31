
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
initializeStore: function() {
    app.clearOutput();
    
},
initAppPurchases: function() {

    app.clearOutput();
    Store.init(function(data) {

               var elem = document.createElement("div");
               if(data.err)
                    elem.innerHTML = data.err;
               else {
                elem.innerHTML = "store initialized";
               }
               document.getElementById('results').appendChild(elem);
    });
},
storeType: function() {
    app.clearOutput();
    Store.getType(function(data) {
                  var elem = document.createElement("div");
                  if(data.err)
                    elem.innerHTML = data.err;
                  else {
  
                  elem.innerHTML = "store of type: " + data;
 
                  }
                                   document.getElementById('results').appendChild(elem);
                  });
},
fetchProducts: function(args) {
    app.clearOutput();
    Store.fetch(args, function(data) {
                var elem = document.createElement("div");
                
                if(data.err)
                elem.innerHTML = data.err;
                else {
                var ul = document.createElement("ul");
                for(var index in data.validProducts) {
                var product = data.validProducts[index];
                var li = document.createElement("li");
                li.innerHTML = 'title:' + product['localizedTitle'] + " description: " + product.localizedDescription + " price: " + product.price + ' id: ' + product.productIdentifier;
                ul.appendChild(li);
                
                }
                elem.appendChild(ul);
                }
                
                document.getElementById('results').appendChild(elem);
                
                });
},
triggerError: function() {
    app.clearOutput();
    Store.fetch([], function(data) {
app.clearOutput();
                var elem = document.createElement("div");
                elem.innerHTML = data.err;
                document.getElementById('results').appendChild(elem);
                });
},
buy:function(args) {
    app.clearOutput();
    Store.buy(args, function(data) {
              var elem = document.createElement("div");
                 if(data.err)
                 elem.innerHTML = data.err;
                 else {
                 
                 elem.innerHTML = data;
                 
                 }
                  document.getElementById('results').appendChild(elem);
                 });
},
restore:function() {
    Store.restore(function(data) {
                  app.clearOutput();
                  var elem = document.createElement("div");
              if(data.err)
              elem.innerHTML = data.err;
              else {
              
              elem.innerHTML = data;
              
              }
              document.getElementById('results').appendChild(elem);
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