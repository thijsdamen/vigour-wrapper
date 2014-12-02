cordova.define("io.vigour.google-cast.VigourIoGoogleCast", function(require, exports, module) { "use strict";
               
var GoogleCast = {
	
	//event dispatcher, received from native layer
  dispatchEvent: function (eventType, args) {

    switch(eventType) {
    case 'deviceDidComeOnline': {
               console.log(args.id, args.friendlyName)
    break;
    }
    case 'deviceDidGoOffline': {
               console.log(args.id, args.friendlyName)
    break;
    }
    case  'deviceManagerDidConnect': {
               console.log(args.receiverAppID)
    break;
    }
       case 'didConnectToCastApplication': {
               console.log(args.sessionID)
       }
               case 'didDisconnectWithError': {
                console.log(args.error)
               }
    }
    
  },
	
    connectToDevice: function(deviceID, cb) {
        cordova.exec(cb, cb, "VigourIoGoogleCast", "connectToDevice", [deviceID]);
    },
	startScanForDevices: function(appId, cb) {
        cordova.exec(cb, cb, "VigourIoGoogleCast", "startScanForDevices", [appId]);

	},
   castMedia: function(contentID, metaDataTitle, metaDataSubTitle, metaDataImageUrl, cb) {
               var args = {};
               if(!contentID)
               return;
               
               args["contentID"]=contentID;
               
               if(metaDataTitle)
                args["metaDataTitle"]=metaDataTitle;
               if(metaDataSubTitle)
                args["metaDataSubTitle"]=metaDataSubTitle;
               if(metaDataImageUrl)
                args["metaDataImageUrl"]=metaDataImageUrl;
               
        cordova.exec(cb, cb, "VigourIoGoogleCast", "castMedia", [args]);

   }
	
};

GoogleCast.PLUGIN_ID = 'VigourIoGoogleCast';

module.exports = exports = GoogleCast;


});
