package io.vigour.store;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import io.vigour.store.util.IabHelper;
import io.vigour.store.util.IabResult;
import io.vigour.store.util.Inventory;
import io.vigour.store.util.Purchase;
import io.vigour.store.util.SkuDetails;

/**
 * Created by andrej on 03/09/14.
 */
public class PlayStoreHandler extends StoreHandler
{
    private static String TAG = PlayStoreHandler.class.getSimpleName();
    private final Boolean ENABLE_DEBUG_LOGGING = true;

    // (arbitrary) request code for the purchase flow
    static final int RC_REQUEST = 10001;

    private List<String> skus = new ArrayList<String>();

    // The helper object
    IabHelper mHelper;

    // A quite up to date inventory of available items and purchase items
    Inventory myInventory;

    public PlayStoreHandler(VigourIoStore ioStore)
    {
        super(ioStore);
    }

    @Override
    void getType(final CallbackContext callbackContext) throws Exception
    {
        callbackContext.success("{\"type\":1}");
    }

    @Override
    void init(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        final List<String> skus = new ArrayList<String>();
        for (int i=0;i<data.length();i++){
            skus.add(data.get(i).toString());
            Log.d(TAG, "Product SKU Added: "+data.get(i).toString());
        }

        Log.d(TAG, "init start");
        // Some sanity checks to see if the developer (that's you!) really followed the
        // instructions to run this plugin

        Activity activity = ioStore.cordova.getActivity();
        int resId = activity.getResources().getIdentifier("billing_key", "string", activity.getPackageName());
        String base64EncodedPublicKey = activity.getString(resId);
        if (base64EncodedPublicKey == null || base64EncodedPublicKey.isEmpty())
        {
            callbackContext.error("Failed to read billing_key from strings.xml");
            return;
        }

        // Create the helper, passing it our context and the public key to verify signatures with
        Log.d(TAG, "Creating IAB helper.");
        mHelper = new IabHelper(ioStore.cordova.getActivity().getApplicationContext(), base64EncodedPublicKey);

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

    @Override
    void getProductDetails(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        for (int i=0;i<data.length();i++){
            skus.add(data.get(i).toString());
            Log.d(TAG, "Product SKU Added: "+data.get(i).toString());
        }

        if (mHelper == null) {
            callbackContext.error("Billing plugin was not initialized");
            return;
        }

        Log.d(TAG, "Beginning Sku(s) Query!");
        mHelper.queryInventoryAsync(true, skus, mGotDetailsListener);
    }

    @Override
    void buy(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        final String sku = data.getString(0);

        /* TODO: for security, generate your payload here for verification. See the comments on
         *        verifyDeveloperPayload() for more info. Since this is a sample, we just use
         *        an empty string, but on a production app you should generate this. */
        final String payload = "";

        if (mHelper == null){
            callbackContext.error("Billing plugin was not initialized");
            return;
        }

        ioStore.cordova.setActivityResultCallback(ioStore);

        mHelper.launchPurchaseFlow(ioStore.cordova.getActivity(), sku, RC_REQUEST,
                mPurchaseFinishedListener, payload);
    }

    @Override
    void subscribe(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        final String sku = data.getString(0);

        if (mHelper == null){
            callbackContext.error("Billing plugin was not initialized");
            return;
        }
        if (!mHelper.subscriptionsSupported()) {
            callbackContext.error("Subscriptions not supported on your device yet. Sorry!");
            return;
        }

		/* TODO: for security, generate your payload here for verification. See the comments on
         *        verifyDeveloperPayload() for more info. Since this is a sample, we just use
         *        an empty string, but on a production app you should generate this. */
        final String payload = "";

        ioStore.cordova.setActivityResultCallback(ioStore);
        Log.d(TAG, "Launching purchase flow for subscription.");

        mHelper.launchPurchaseFlow(ioStore.cordova.getActivity(), sku, IabHelper.ITEM_TYPE_SUBS, RC_REQUEST, mPurchaseFinishedListener, payload);
    }

    @Override
    void getPurchases(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        if (myInventory == null) {
            callbackContext.error("Billing plugin was not initialized");
            return;
        }

        // Convert the java list to json
        JSONArray skus = new JSONArray();
        for (Purchase p : myInventory.getAllPurchases()) {

            JSONObject jsonSku = new JSONObject();
            jsonSku.put(p.getSku(), new JSONObject(p.getOriginalJson()));
            skus.put(jsonSku);
        }

        // Call the javascript back
        callbackContext.success(skus);
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


    IabHelper.OnIabPurchaseFinishedListener mPurchaseFinishedListener = new IabHelper.OnIabPurchaseFinishedListener() {
        public void onIabPurchaseFinished(IabResult result, Purchase purchase) {
            Log.d(TAG, "Purchase finished: " + result + ", purchase: " + purchase);

            // Have we been disposed of in the meantime? If so, quit.
            if (mHelper == null) {
                callbackContext.error("The billing helper has been disposed");
            }

            if (result.isFailure() ) {
                callbackContext.error("Error purchasing: " + result);
                return;
            }

            if (!verifyDeveloperPayload(purchase)) {
                callbackContext.error("Error purchasing. Authenticity verification failed.");
                return;
            }

            Log.d(TAG, "Purchase successful.");

            // add the purchase to the inventory
            myInventory.addPurchase(purchase);

            try {
                callbackContext.success(new JSONObject(purchase.getOriginalJson()));
            } catch (JSONException e) {
                callbackContext.error("Could not create JSON object from purchase object");
            }
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

            JSONObject jResponse = new JSONObject();
            // Convert the java list to json
            JSONArray jsonSkuList = new JSONArray();
            try {
                for (SkuDetails sku : skuList) {
                    Log.d(TAG, "SKUDetails: Title: "+sku.getTitle());
                    JSONObject jsonSku = new JSONObject();
                    jsonSku.put(sku.getSku(), sku.toJson());
                    skus.remove(sku.getSku());
                    jsonSkuList.put(jsonSku);
                }

                jResponse.put("validProducts", jsonSkuList);

                JSONArray invalidSkus = new JSONArray();
                for (String invalidSku: skus) {
                    invalidSkus.put(invalidSku);
                }

                jResponse.put("invalidProducts", invalidSkus);
            } catch (JSONException e) {
                callbackContext.error(e.getMessage());
            }

            callbackContext.success(jResponse);
        }
    };

    public void onDestroy()
    {
        // very important:
        Log.d(TAG, "Destroying helper.");
        if (mHelper != null) {
            mHelper.dispose();
            mHelper = null;
        }
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
}
