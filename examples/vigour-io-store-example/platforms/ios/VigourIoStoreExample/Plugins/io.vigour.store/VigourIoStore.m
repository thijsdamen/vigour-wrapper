//
//  VigourIoStore.m
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import "VigourIoStore.h"
#import <Cordova/CDV.h>
#import <Cordova/CDVViewController.h>
#import <StoreKit/StoreKit.h>

@interface VigourIoStore() <SKProductsRequestDelegate>

@end

@implementation VigourIoStore


#pragma mark -
#pragma mark API

- (void)getType:(CDVInvokedUrlCommand*)command 
{
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:0];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)fetch:(CDVInvokedUrlCommand*)command
{

	if(command.arguments.count==0)
	{
		CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No products where set"];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		return;
	}
	
	if ([SKPaymentQueue canMakePayments])
	{
	    SKProductsRequest *request = [[SKProductsRequest alloc]
	                                  initWithProductIdentifiers:
	                                  [NSSet setWithArray:command.arguments]];
	    request.delegate = self;
    
	    [request start];
	}

}

#pragma mark -
#pragma mark SKProductsRequestDelegate

-(void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSArray *products = response.products;
    if (products.count != 0)
    {
//        _product = products[0];
//        _buyButton.enabled = YES;
//        _productTitle.text = _product.localizedTitle;
//        _productDescription.text = _product.localizedDescription;
    } else {
//        _productTitle.text = @"Product not found";
    }
    // products = response.invalidProductIdentifiers;
    
    
    for (SKProduct *product in products)
    {
        NSLog(@"Product not found: %@", product);
        @property(nonatomic, readonly) NSString *localizedDescription NS_AVAILABLE_IOS(3_0);
        
        @property(nonatomic, readonly) NSString *localizedTitle NS_AVAILABLE_IOS(3_0);
        
        @property(nonatomic, readonly) NSDecimalNumber *price NS_AVAILABLE_IOS(3_0);
        
        @property(nonatomic, readonly) NSLocale *priceLocale NS_AVAILABLE_IOS(3_0);
        
        @property(nonatomic, readonly) NSString *productIdentifier NS_AVAILABLE_IOS(3_0);
    }
		
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:products];
//		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		

}

-(void)request:(SKRequest *)request didFailWithError:(NSError *)error
{
    NSLog(@"ERROR %@", [error localizedDescription]);
}

@end