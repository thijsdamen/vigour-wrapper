//
//  VigourIoStore.h
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import <Cordova/CDVPlugin.h>

@class SKPaymentTransaction;

typedef void (^RequestProductsCompletionHandler) (BOOL success, NSArray * products, NSString *commandId);

typedef enum : NSUInteger {
    NoCallback = 0,
    StoreNotInitedCallback = 1,
    StoreNoPayments = 2,
    NoProductsSet = 3
} CDVCallbacks;

@interface VigourIoStore : CDVPlugin {}

- (void)setup:(CDVInvokedUrlCommand*)command;

- (void)fetch:(CDVInvokedUrlCommand*)command;

- (void)buy:(CDVInvokedUrlCommand*)command;

- (void)restore:(CDVInvokedUrlCommand*)command;

- (void)getType:(CDVInvokedUrlCommand*)command;

- (void)requestProductsWithCommand:(CDVInvokedUrlCommand *)command completionHandler:(RequestProductsCompletionHandler)completionHandler;

@end