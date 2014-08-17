//
//  VigourIoStore.h
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import <Cordova/CDVPlugin.h>

typedef enum : NSUInteger {
    CONSUMABLE = 0,
    NON_CONSUMABLE,
    AUTO_RENEWABLE_SUBSCRIPTION,
    FREE_SUBSCRIPTION,
    NON_RENEWABLE_SUBSCRIPTION
} ProductType;

typedef enum : NSUInteger {
    APP_STORE = 0,
    PLAY_STORE,
    MOCK_STORE,
    AMAZON_STORE
} StoreType;

typedef enum : NSUInteger {
    PURCHASED = 0,
    CANCELED,
    REFUNDED,
    EXPIRED
} PurchaseState;

@interface VigourIoStore : CDVPlugin {}

- (void)fetch:(CDVInvokedUrlCommand*)command;

@end