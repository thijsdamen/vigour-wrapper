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

#define NILABLE(obj) ((obj) != nil ? (NSObject *)(obj) : (NSObject *)[NSNull null])

@interface VigourIoStore() <SKProductsRequestDelegate, SKPaymentTransactionObserver>

@property(nonatomic, strong) NSMutableDictionary *commands;
@property(nonatomic, strong) NSMutableDictionary *products;

@property(nonatomic, copy) RequestProductsCompletionHandler requestProductsCompletionHandler;


@property (nonatomic, assign) BOOL purchaseInProgress;

- (void)jsCallback:(CDVInvokedUrlCommand*)command callbackType:(CDVCallbacks)type;
- (NSString *)commandIDForRequest:(SKRequest *)request;

@end

@implementation VigourIoStore {
    BOOL _setupDone;
}

-(void)dealloc
{

}

#pragma mark - Helpers

- (void)jsEval:(NSString *)callbackName withMessage:(NSArray *)arguments
{
    NSString* jsonString = @"";
    
    if(arguments)
    {
        NSData* jsonData = [NSJSONSerialization dataWithJSONObject:arguments options:1 error:nil];
        jsonString = [[NSString alloc] initWithBytes:[jsonData bytes] length:[jsonData length] encoding:NSUTF8StringEncoding];
    }
    
    NSString *js = [NSString stringWithFormat:@"Store.%@.apply(Store, %@);", callbackName, jsonString];
    [self.commandDelegate evalJs:js];
}

- (void)jsCallback:(CDVInvokedUrlCommand*)command callbackType:(CDVCallbacks)type
{
    CDVPluginResult* pluginResult = nil;
    
    switch (type)
    {
        case NoCallback:
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            break;
            
        case StoreNotInitedCallback:
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self storeNotInited]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            break;
            
        case StoreNoPayments:
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self noPaymentPossible]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            break;
            
        case NoProductsSet:
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:[self noProductsSet]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            break;
            
        default:
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            break;
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}

-(NSString *)commandIDForRequest:(SKRequest *)request
{
    NSString *commandID = @"";
    for (NSString *cID in self.commands) {
        SKRequest *activeRequest = self.commands[cID];
        if([activeRequest isEqual:request]) {
            commandID = cID;
            break;
        }
    }
    return commandID;
}


- (void)requestProductsWithCommand:(CDVInvokedUrlCommand *)command completionHandler:(RequestProductsCompletionHandler)completionHandler
{
    SKProductsRequest *request = [[SKProductsRequest alloc]
                                  initWithProductIdentifiers:
                                  [NSSet setWithArray:command.arguments]];
    request.delegate = self;
    
    self.commands[command.callbackId] = request;
    
    self.requestProductsCompletionHandler = [completionHandler copy];
    
    [request start];
}

#pragma mark - API

- (void)setup:(CDVInvokedUrlCommand*)command
{
    
    if(_setupDone)
    {
        [self jsCallback:command callbackType:NoCallback];
        return;
    }
    
    if (![SKPaymentQueue canMakePayments]) {
        [self jsCallback:command callbackType:StoreNoPayments];
        return;
    }
    
    self.commands = [NSMutableDictionary new];
    self.products = [NSMutableDictionary new];
    
    [[SKPaymentQueue defaultQueue] addTransactionObserver:self];

    _setupDone = YES;
    
    [self jsCallback:command callbackType:NoCallback];

}

- (void)getType:(CDVInvokedUrlCommand*)command 
{
    if(!_setupDone)
    {
        [self jsCallback:command callbackType:StoreNotInitedCallback];
        return;
    }
    
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:0];
	[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)fetch:(CDVInvokedUrlCommand*)command
{
    
    if(!_setupDone)
    {
        [self jsCallback:command callbackType:StoreNotInitedCallback];
        return;
    }

	if(command.arguments.count==0)
	{
        [self jsCallback:command callbackType:NoProductsSet];
		return;
	}
    
    
    [self jsEval:@"fetch" withMessage:nil];
	
	if ([SKPaymentQueue canMakePayments])
	{
	    SKProductsRequest *request = [[SKProductsRequest alloc]
	                                  initWithProductIdentifiers:
	                                  [NSSet setWithArray:command.arguments]];
	    request.delegate = self;
        
        self.commands[command.callbackId] = request;
        
	    [request start];
	}

}


- (void)buy:(CDVInvokedUrlCommand*)command
{
    if(!_setupDone)
    {
        [self jsCallback:command callbackType:StoreNotInitedCallback];
        return;
    }
    
    if(command.arguments.count==0)
    {
        [self jsCallback:command callbackType:NoProductsSet];
        return;
    }
    
    self.purchaseInProgress = YES;

    __typeof(self) __weak weakSelf = self;
    [self requestProductsWithCommand:command
                              completionHandler:^(BOOL success, NSArray *products, NSString *commandID) {
                                  
        __strong __typeof(weakSelf) strongSelf = weakSelf;
                                  
        if(!success)
            return;
                                  
        for (SKProduct *product in products)
        {
            strongSelf.products[product.productIdentifier] = product;
            
            SKPayment * payment = [SKPayment paymentWithProduct:product];
            [[SKPaymentQueue defaultQueue] addPayment:payment];
        }
    }];
    
    [self jsCallback:command callbackType:NoCallback];
    
}

- (void)restore:(CDVInvokedUrlCommand *)command
{
    
    if(!_setupDone)
    {
        [self jsCallback:command callbackType:StoreNotInitedCallback];
        return;
    }
    
    [[SKPaymentQueue defaultQueue] restoreCompletedTransactions];
}


- (BOOL)canMakePurchases
{
    return [SKPaymentQueue canMakePayments];
}

- (BOOL)allowedToPurchase
{
    if (![self canMakePurchases]) return NO;
    if (self.purchaseInProgress) return NO; return YES;
}

#pragma mark - SKProductsRequestDelegate

-(void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSArray *products = response.products;
    // products = response.invalidProductIdentifiers;
    
    if (products.count != 0)
    {
        NSMutableArray *validProducts = @[].mutableCopy;
        
        for (SKProduct *product in products)
        {
            validProducts[validProducts.count] = @{
              @"localizedTitle":product.localizedTitle,
              @"localizedDescription":product.localizedDescription,
              @"price":product.price,
              @"priceLocale":[product.priceLocale localeIdentifier],
                  @"productIdentifier":product.productIdentifier
              };
            
            self.products[product.productIdentifier] = product;

        }
        
        NSDictionary *validProductsObject = @{@"validProducts":validProducts.copy};
     
        NSString *commandID = [self commandIDForRequest:request];
        if(commandID && commandID.length>0)
        {
            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:validProductsObject];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:commandID];
            [self.commands removeObjectForKey:commandID];
        }
        
        
        if(self.requestProductsCompletionHandler)
            self.requestProductsCompletionHandler(YES, products, commandID);
    
    }
    
    self.requestProductsCompletionHandler = nil;
    
}

-(void)request:(SKRequest *)request didFailWithError:(NSError *)error
{
    
    NSString *commandID = [self commandIDForRequest:request];
    if(commandID && commandID.length>0)
    {
        CDVPluginResult *pluginResult = [CDVPluginResult
                                         resultWithStatus:CDVCommandStatus_ERROR
                                         messageAsDictionary:@{@"err":[error localizedDescription]}];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:commandID];
        [self.commands removeObjectForKey:commandID];
    }
    
    if(self.requestProductsCompletionHandler)
        self.requestProductsCompletionHandler(NO, nil, commandID);
    
    self.requestProductsCompletionHandler = nil;
    
}


#pragma mark - SKPaymentTransactionObserver

-(void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions
{
    for (SKPaymentTransaction * transaction in transactions) {
        switch (transaction.transactionState) {
            case SKPaymentTransactionStatePurchasing:
                break;
            case SKPaymentTransactionStatePurchased:
            {
                [self completeTransaction:transaction];
                break;
            }
            case SKPaymentTransactionStateFailed:
            {
                [self failedTransaction:transaction];
                break;
            }
            case SKPaymentTransactionStateRestored:
            {
                [self restoreTransaction:transaction];
            }
            default:
                break;
        }
    }
}

- (void)completeTransaction:(SKPaymentTransaction *)transaction
{
    NSLog(@"completeTransaction...");
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
    
    [self jsEval:@"updatedTransactionCallback"
     withMessage:@[@"PaymentTransactionStatePurchased",
                   NILABLE(transaction.transactionIdentifier),
                   NILABLE(transaction.payment.productIdentifier),
                   NILABLE(@{})
                   ]
     ];
    
}

- (void)restoreTransaction:(SKPaymentTransaction *)transaction
{

    NSLog(@"restoreTransaction...");
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];

    [self jsEval:@"updatedTransactionCallback"
     withMessage:@[@"PaymentTransactionStateRestored",
                   NILABLE(transaction.transactionIdentifier),
                   NILABLE(transaction.payment.productIdentifier),
                   NILABLE(@{})
                   ]
     ];
}
- (void)failedTransaction:(SKPaymentTransaction *)transaction
{
    NSDictionary *error = @{
                            @"description" : @"Transaction failed",
                            @"code": [NSNumber numberWithInteger:transaction.error.code]
                        };
    
    if (transaction.error.code != SKErrorPaymentCancelled) {
        NSLog(@"Transaction error: %@", transaction.error.localizedDescription);
        error = @{
                  @"description" : transaction.error.localizedDescription,
                  @"code": [NSNumber numberWithInteger:transaction.error.code]
                };
    }
    //SKProduct * product = self.products[transaction.payment.productIdentifier];
  
    self.purchaseInProgress = NO;
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
    
//    state, transactionIdentifier, productId, error
    [self jsEval:@"updatedTransactionCallback"
        withMessage:@[@"PaymentTransactionStateFailed",
                      NILABLE(transaction.transactionIdentifier),
                      NILABLE(transaction.payment.productIdentifier),
                      error
                      ]
     ];

}



#pragma mark - Constants

- (NSDictionary *)noPaymentPossible {
    static NSDictionary *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = @{
                     @"err": @"No payments possible"
                     };
    });
    return instance;
}

- (NSDictionary *)noProductsSet {
    static NSDictionary *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = @{
                     @"err": @"No products where set"
                     };
    });
    return instance;
}

- (NSDictionary *)storeNotInited {
    static NSDictionary *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = @{
                     @"err": @"Store is not initialized"
                     };
    });
    return instance;
}

@end