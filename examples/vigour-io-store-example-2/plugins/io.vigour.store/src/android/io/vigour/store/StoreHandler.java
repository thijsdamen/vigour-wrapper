package io.vigour.store;

import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;

/**
 * Created by andrej on 03/09/14.
 */
public abstract class StoreHandler
{
    protected VigourIoStore ioStore;
    protected CallbackContext callbackContext;

    public StoreHandler(VigourIoStore ioStore) {
        this.ioStore = ioStore;
    }

    abstract void getType(final CallbackContext callbackContext) throws Exception;
    abstract void init(JSONArray data, final CallbackContext callbackContext) throws Exception;
    abstract void getProductDetails(JSONArray data, final CallbackContext callbackContext) throws Exception;
    abstract void buy(JSONArray data, final CallbackContext callbackContext) throws Exception;
    abstract void subscribe(JSONArray data, final CallbackContext callbackContext) throws Exception;
    abstract void getPurchases(JSONArray data, final CallbackContext callbackContext) throws Exception;

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    }

    public void onDestroy() { }

    public void onResume() { }
}
