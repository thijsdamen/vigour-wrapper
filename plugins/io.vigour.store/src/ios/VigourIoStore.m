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

- (void)fetch:(CDVInvokedUrlCommand*)command
{
    NSString *productId = (NSString*) [command.arguments objectAtIndex:0];
    for (NSString *productId in command.arguments) {
        //get Product, create dict and send back
    }
    if ([SKPaymentQueue canMakePayments])
    {
        SKProductsRequest *request = [[SKProductsRequest alloc]
                                      initWithProductIdentifiers:
                                      [NSSet setWithObject:productId]];
        request.delegate = self;
        
        [request start];
    }
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:@[@"a",@"b"]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
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
    
    products = response.invalidProductIdentifiers;
    
    for (SKProduct *product in products)
    {
        NSLog(@"Product not found: %@", product);
    }
}

-(void)request:(SKRequest *)request didFailWithError:(NSError *)error
{
    NSLog(@"ERROR %@", [error localizedDescription]);
}

@end