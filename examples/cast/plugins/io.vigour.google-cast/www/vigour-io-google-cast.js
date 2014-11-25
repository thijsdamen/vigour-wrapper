"use strict";
               
var GoogleCast = {
	
	//event dispatcher, received from native layer
  dispatchEvent: function (eventType, arguments) {
               switch(eventType) {
                    case 'deviceDidComeOnline':
                        console.log(eventType, arguments)
                    break;
                    case 'deviceDidGoOffline':
                        console.log(eventType, friendlyName, id, modelName)
                    break;
                    case  'deviceManagerDidConnect':
                    break;
               }
    
  },
	
	startScanForDevices: function(appId, cb) {
        cordova.exec(cb, cb, "VigourIoGoogleCast", "startScanForDevices", [appId]);

	}
	
};

GoogleCast.PLUGIN_ID = 'VigourIoGoogleCast';

module.exports = exports = GoogleCast;

