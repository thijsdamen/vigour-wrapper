package io.vigour.store;

import android.util.Log;

import com.amazon.device.iap.PurchasingListener;
import com.amazon.device.iap.PurchasingService;
import com.amazon.device.iap.model.Product;
import com.amazon.device.iap.model.ProductDataResponse;
import com.amazon.device.iap.model.PurchaseResponse;
import com.amazon.device.iap.model.PurchaseUpdatesResponse;
import com.amazon.device.iap.model.RequestId;
import com.amazon.device.iap.model.UserDataResponse;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by andrej on 03/09/14.
 */
public class AmazonHandler extends StoreHandler implements PurchasingListener
{
    private static String TAG = AmazonHandler.class.getSimpleName();

    private String currentUserId = null;
    private String currentMarketplace = null;

    private RequestId requestId;


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

        requestId = PurchasingService.getUserData();
    }

    @Override
    void getProductDetails(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        final Set<String> skus = new HashSet<String>();
        for (int i=0; i<data.length(); i++){
            skus.add(data.get(i).toString());
            Log.d(TAG, "Product SKU Added: "+data.get(i).toString());
        }

        requestId = PurchasingService.getProductData(skus);
    }

    @Override
    void buy(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

        final String sku = data.getString(0);
        requestId = PurchasingService.purchase(sku);
    }

    @Override
    void subscribe(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

    }

    @Override
    void getPurchases(JSONArray data, final CallbackContext callbackContext) throws Exception
    {
        this.callbackContext = callbackContext;

    }

    @Override
    public void onResume()
    {
        PurchasingService.getUserData();
    }

    @Override
    public void onUserDataResponse(UserDataResponse response)
    {
        //Log.v("MYTEST", "onUserDataResponse " + response.getRequestId() + " " + requestId);

        final UserDataResponse.RequestStatus status = response.getRequestStatus();

        switch(status) {
            case SUCCESSFUL:

                currentUserId = response.getUserData().getUserId();
                currentMarketplace = response.getUserData().getMarketplace();

                if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                    callbackContext.success();
                }

                break;

            case FAILED:
            case NOT_SUPPORTED:

                if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                    callbackContext.error("Failed to get user data.");
                }

                break;
        }

    }

    @Override
    public void onProductDataResponse(ProductDataResponse response)
    {
        // Log.v("MYTEST", "onProductDataResponse " + response.getRequestId() + " " + requestId);

        try {

            switch (response.getRequestStatus())
            {
                case SUCCESSFUL:
                    for (final String s : response.getUnavailableSkus()) {
                        Log.v(TAG, "Unavailable SKU:" + s);
                    }

                    final Map<String, Product> products = response.getProductData();
                    JSONArray jProducts = new JSONArray();
                    for (final String key : products.keySet())
                    {
                        Product product = products.get(key);

                        JSONObject jProduct = new JSONObject();
                        jProduct.put("title", product.getTitle());
                        jProduct.put("type", product.getProductType());
                        jProduct.put("price", product.getPrice());
                        jProduct.put("sku", product.getSku());
                        jProduct.put("description", product.getDescription());

                        jProducts.put(new JSONObject().put(key, jProduct));

                        Log.v(TAG, String.format("Product: %s\n Type: %s\n SKU: %s\n Price: %s\n Description: %s\n", product.getTitle(), product.getProductType(), product.getSku(), product.getPrice(), product.getDescription()));
                    }

                    if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                        callbackContext.success(jProducts);
                    }

                    break;

                case FAILED:

                    if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                        callbackContext.error(response.toString());
                    }

                    Log.v(TAG, "ProductDataRequestStatus: FAILED");
                    break;
            }

        }
        catch(JSONException e)
        {
            if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                callbackContext.error(e.getMessage());
            }
        }
    }

    @Override
    public void onPurchaseResponse(PurchaseResponse response)
    {
        // Log.v("MYTEST", "onPurchaseResponse " + response.getRequestId() + " " + requestId);

        final PurchaseResponse.RequestStatus status = response.getRequestStatus();

        try {
            if (status == PurchaseResponse.RequestStatus.SUCCESSFUL)
            {
                JSONObject jResponse = new JSONObject();
                jResponse.put("sku", response.getReceipt().getSku());
                jResponse.put("receiptId", response.getReceipt().getReceiptId());
                jResponse.put("userId", response.getUserData().getUserId());

                if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                    callbackContext.success(new JSONObject().put(response.getReceipt().getSku(), jResponse));
                }
            }
            else
            {
                if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                    callbackContext.error(response.getRequestStatus().toString());
                }
            }
        }
        catch (JSONException e)
        {
            if (requestId.toString().equalsIgnoreCase(response.getRequestId().toString())) {
                callbackContext.error(e.getMessage());
            }
        }
    }

    @Override
    public void onPurchaseUpdatesResponse(PurchaseUpdatesResponse response)
    {
        //Log.v("MYTEST", "onPurchaseUpdatesResponse " + response.getRequestId() + " " + requestId);
    }
}
