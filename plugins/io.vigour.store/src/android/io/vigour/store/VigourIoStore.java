package io.vigour.store;

import android.content.Intent;
import android.util.Log;

import io.vigour.store.util.IabHelper;
import io.vigour.store.util.IabResult;
import io.vigour.store.util.Inventory;
import io.vigour.store.util.Purchase;
import io.vigour.store.util.SkuDetails;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class VigourIoStore extends CordovaPlugin
{
	private final Boolean ENABLE_DEBUG_LOGGING = true;
	private final String TAG = "VigourIoStore";


    // (arbitrary) request code for the purchase flow
    static final int RC_REQUEST = 10001;

    // The helper object
    IabHelper mHelper;

    // A quite up to date inventory of available items and purchase items
    Inventory myInventory;

    CallbackContext callbackContext;

	@Override
	/**
	 * Called by each javascript plugin function
	 */
	public boolean execute(String action, JSONArray data, final CallbackContext callbackContext)
    {
		this.callbackContext = callbackContext;
		// Check if the action has a handler
		Boolean isValidAction = true;
		
		try {
			// Action selector
			if ("init".equals(action))
            {
				final List<String> sku = new ArrayList<String>();
				if(data.length() > 0){
					JSONArray jsonSkuList = new JSONArray(data.getString(0));
					int len = jsonSkuList.length();
					Log.d(TAG, "Num SKUs Found: "+len);
	   			 for (int i=0;i<len;i++){
	    				sku.add(jsonSkuList.get(i).toString());
						Log.d(TAG, "Product SKU Added: "+jsonSkuList.get(i).toString());
	   			 }
				}

				init(sku);

			} else if ("getProductDetails".equals(action)) {
				JSONArray jsonSkuList = new JSONArray(data.getString(0));
				final List<String> sku = new ArrayList<String>();			
				int len = jsonSkuList.length();
				Log.d(TAG, "Num SKUs Found: "+len);
   			 for (int i=0;i<len;i++){
    				sku.add(jsonSkuList.get(i).toString());
					Log.d(TAG, "Product SKU Added: "+jsonSkuList.get(i).toString());
   			 }
				getProductDetails(sku);				
			} else {
				// No handler for the action
				isValidAction = false;
			}
		} catch (IllegalStateException e){
			callbackContext.error(e.getMessage());
		} catch (JSONException e){
			callbackContext.error(e.getMessage());
		}

		// Method not found
		return isValidAction;
	}

	// Initialize the plugin
	private void init(final List<String> skus){
		Log.d(TAG, "init start");
		// Some sanity checks to see if the developer (that's you!) really followed the
        // instructions to run this plugin
                int billingKey = cordova.getActivity().getResources().getIdentifier("billing_key", "string", cordova.getActivity().getPackageName());
                String base64EncodedPublicKey = cordova.getActivity().getString(billingKey);

	 	if (base64EncodedPublicKey.contains("CONSTRUCT_YOUR"))
	 		throw new RuntimeException("Please put your app's public key in InAppBillingPlugin.java. See ReadMe.");

	 	// Create the helper, passing it our context and the public key to verify signatures with
        Log.d(TAG, "Creating IAB helper.");
        mHelper = new IabHelper(cordova.getActivity().getApplicationContext(), base64EncodedPublicKey);

        // enable debug logging (for a production application, you should set this to false).
        mHelper.enableDebugLogging(ENABLE_DEBUG_LOGGING);

        // Start setup. This is asynchronous and the specified listener
        // will be called once setup completes.
        Log.d(TAG, "Starting setup.");

        mHelper.startSetup(new IabHelper.OnIabSetupFinishedListener() {
            public void onIabSetupFinished(IabResult result) {
                Log.d(TAG, "Setup finished. " + result);

                if (!result.isSuccess()) {
                    // Oh no, there was a problem.
                    callbackContext.error("Problem setting up in-app billing: " + result);
                    return;
                }
                
                // Have we been disposed of in the meantime? If so, quit.
                if (mHelper == null) {
                	callbackContext.error("The billing helper has been disposed");
                }

                // Hooray, IAB is fully set up. Now, let's get an inventory of stuff we own.
                if(skus.size() <= 0){
					Log.d(TAG, "Setup successful. Querying inventory.");
                	mHelper.queryInventoryAsync(mGotInventoryListener);
				}else{
					Log.d(TAG, "Setup successful. Querying inventory w/ SKUs.");
					mHelper.queryInventoryAsync(true, skus, mGotInventoryListener);
				}
            }			
        });
    }
	

	//Get SkuDetails for skus
	private void getProductDetails(final List<String> skus) {
        if (mHelper == null) {
            callbackContext.error("Billing plugin was not initialized");
            return;
        }

        Log.d(TAG, "Beginning Sku(s) Query!");
        mHelper.queryInventoryAsync(true, skus, mGotDetailsListener);
    }
	
	// Listener that's called when we finish querying the items and subscriptions we own
    IabHelper.QueryInventoryFinishedListener mGotInventoryListener = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result, Inventory inventory) {
        	Log.d(TAG, "Inside mGotInventoryListener");
        	if (hasErrorsAndUpdateInventory(result, inventory)) return;

            Log.d(TAG, "Query inventory was successful.");
            callbackContext.success();
            
        }
    };
    // Listener that's called when we finish querying the details
    IabHelper.QueryInventoryFinishedListener mGotDetailsListener = new IabHelper.QueryInventoryFinishedListener() {
        public void onQueryInventoryFinished(IabResult result, Inventory inventory) {
            Log.d(TAG, "Inside mGotDetailsListener");
            if (hasErrorsAndUpdateInventory(result, inventory)) return;

            Log.d(TAG, "Query details was successful.");

            List<SkuDetails> skuList = inventory.getAllProducts();
        
            // Convert the java list to json
            JSONArray jsonSkuList = new JSONArray();
            try {
                for (SkuDetails sku : skuList) {
                    Log.d(TAG, "SKUDetails: Title: "+sku.getTitle());
                    jsonSkuList.put(sku.toJson());
                }
            } catch (JSONException e) {
                callbackContext.error(e.getMessage());
            }
            callbackContext.success(jsonSkuList);
        }
    };

    // Check if there is any errors in the iabResult and update the inventory
    private Boolean hasErrorsAndUpdateInventory(IabResult result, Inventory inventory){
    	if (result.isFailure()) {
        	callbackContext.error("Failed to query inventory: " + result);
        	return true;
        }
        
        // Have we been disposed of in the meantime? If so, quit.
        if (mHelper == null) {
        	callbackContext.error("The billing helper has been disposed");
        	return true;
        }
        
        // Update the inventory
        myInventory = inventory;
        
        return false;
    }


    
    @Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d(TAG, "onActivityResult(" + requestCode + "," + resultCode + "," + data);

        // Pass on the activity result to the helper for handling
        if (!mHelper.handleActivityResult(requestCode, resultCode, data)) {
            // not handled, so handle it ourselves (here's where you'd
            // perform any handling of activity results not related to in-app
            // billing...
            super.onActivityResult(requestCode, resultCode, data);
        }
        else {
            Log.d(TAG, "onActivityResult handled by IABUtil.");
        }
    }
    
    /** Verifies the developer payload of a purchase. */
    boolean verifyDeveloperPayload(Purchase p) {
        @SuppressWarnings("unused")
		String payload = p.getDeveloperPayload();
        
        /*
         * TODO: verify that the developer payload of the purchase is correct. It will be
         * the same one that you sent when initiating the purchase.
         * 
         * WARNING: Locally generating a random string when starting a purchase and 
         * verifying it here might seem like a good approach, but this will fail in the 
         * case where the user purchases an item on one device and then uses your app on 
         * a different device, because on the other device you will not have access to the
         * random string you originally generated.
         *
         * So a good developer payload has these characteristics:
         * 
         * 1. If two different users purchase an item, the payload is different between them,
         *    so that one user's purchase can't be replayed to another user.
         * 
         * 2. The payload must be such that you can verify it even when the app wasn't the
         *    one who initiated the purchase flow (so that items purchased by the user on 
         *    one device work on other devices owned by the user).
         * 
         * Using your own server to store and verify developer payloads across app
         * installations is recommended.
         */
        
        return true;
    }
    
    // We're being destroyed. It's important to dispose of the helper here!
    @Override
    public void onDestroy() {
    	super.onDestroy();
    	
    	// very important:
    	Log.d(TAG, "Destroying helper.");
    	if (mHelper != null) {
    		mHelper.dispose();
    		mHelper = null;
    	}
    }
    
}
