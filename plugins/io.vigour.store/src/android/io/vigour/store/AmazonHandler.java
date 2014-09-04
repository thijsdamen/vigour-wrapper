package io.vigour.store;

import android.util.Log;

import com.amazon.device.iap.PurchasingListener;
import com.amazon.device.iap.PurchasingService;
import com.amazon.device.iap.model.ProductDataResponse;
import com.amazon.device.iap.model.PurchaseResponse;
import com.amazon.device.iap.model.PurchaseUpdatesResponse;
import com.amazon.device.iap.model.UserDataResponse;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;

/**
 * Created by andrej on 03/09/14.
 */
public class AmazonHandler extends StoreHandler implements PurchasingListener
{
    private static String TAG = AmazonHandler.class.getSimpleName();

    private String currentUserId = null;
    private String currentMarketplace = null;

    public AmazonHandler(VigourIoStore ioStore) {
        super(ioStore);
    }

    @Override
    void getType(final CallbackContext callbackContext) throws Exception
    {
        callbackContext.success("{\"type\":3}");
    }

    @Override
    void init(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        PurchasingService.registerListener(ioStore.cordova.getActivity().getApplicationContext(), this);
        Log.i(TAG, "init: sandbox mode is:" + PurchasingService.IS_SANDBOX_MODE);

        PurchasingService.getUserData();
    }

    @Override
    void getProductDetails(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
    }

    @Override
    void buy(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
    }

    @Override
    void subscribe(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
    }

    @Override
    void getPurchases(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
    }

    @Override
    public void onResume()
    {
        PurchasingService.getUserData();
    }

    @Override
    public void onUserDataResponse(UserDataResponse response)
    {
        Log.d(TAG, "onUserDataResponse");

        final UserDataResponse.RequestStatus status = response.getRequestStatus();

        switch(status) {
            case SUCCESSFUL:
                currentUserId = response.getUserData().getUserId();
                currentMarketplace = response.getUserData().getMarketplace();
                callbackContext.success();
                break;

            case FAILED:
            case NOT_SUPPORTED:
                callbackContext.error("Failed to get user data.");
                break;
        }

    }

    @Override
    public void onProductDataResponse(ProductDataResponse productDataResponse) {

    }

    @Override
    public void onPurchaseResponse(PurchaseResponse purchaseResponse) {

    }

    @Override
    public void onPurchaseUpdatesResponse(PurchaseUpdatesResponse purchaseUpdatesResponse) {

    }
}
