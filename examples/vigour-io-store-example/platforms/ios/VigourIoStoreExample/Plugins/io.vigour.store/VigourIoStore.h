//
//  VigourIoStore.h
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import <Cordova/CDVPlugin.h>

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

- (void)getType:(CDVInvokedUrlCommand*)command;

@end