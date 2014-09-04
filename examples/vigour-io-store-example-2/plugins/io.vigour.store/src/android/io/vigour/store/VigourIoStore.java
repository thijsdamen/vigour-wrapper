package io.vigour.store;

import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;

public class VigourIoStore extends CordovaPlugin
{
    public static boolean isKindleFire()
    {
        // https://developer.amazon.com/appsandservices/solutions/devices/kindle-fire/specifications/01-device-and-feature-specifications
        return android.os.Build.MANUFACTURER.equals("Amazon")
                && (android.os.Build.MODEL.equals("Kindle Fire")
                || android.os.Build.MODEL.startsWith("KF"));
    }

    private StoreHandler handler;

    public VigourIoStore()
    {
        super();

        handler = isKindleFire() ? new AmazonHandler(this) : new PlayStoreHandler(this);
    }

	@Override
	public boolean execute(String action, JSONArray data, final CallbackContext callbackContext)
    {
		// Check if the action has a handler
		Boolean isValidAction = true;
		
		try
        {
            if ("getType".equals(action)) {
                handler.getType(callbackContext);
            }
			else if ("init".equals(action) || "setup".equals(action)) {
                handler.init(data, callbackContext);
			}
            else if ("getProductDetails".equals(action) || "fetch".equals(action)) {
                handler.getProductDetails(data, callbackContext);
            }
            else if ("buy".equals(action)) {
                handler.buy(data, callbackContext);
            }
            else if ("subscribe".equals(action)) {
                handler.subscribe(data, callbackContext);
            }
            else if ("getPurchases".equals(action)) {
                handler.getPurchases(data, callbackContext);
            }
            else {
                isValidAction = false;
            }
		} catch (Exception e){
			callbackContext.error(e.getMessage());
		}

		return isValidAction;
	}
    
    @Override
	public void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        handler.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onDestroy()
    {
    	super.onDestroy();
        handler.onDestroy();
    }

    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
        handler.onResume();
    }
}
