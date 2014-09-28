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

@property(nonatomic, strong) NSMutableDictionary *payments;

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
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_IO_EXCEPTION messageAsDictionary:[self noProductsSet]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            break;
            
        default:
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            break;
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
}


- (void)requestProductsWithCommand:(CDVInvokedUrlCommand *)command completionHandler:(RequestProductsCompletionHandler)completionHandler
{
    SKProductsRequest *request = [[SKProductsRequest alloc]
                                  initWithProductIdentifiers:
                                  [NSSet setWithArray:command.arguments]];
    request.delegate = self;
    
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
    
    self.payments = [NSMutableDictionary new];
    
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
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"storeType":[NSNumber numberWithInt:0]}];
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
    
    
    //    [self jsEval:@"fetch" withMessage:nil];
    
    if ([SKPaymentQueue canMakePayments])
    {
        
        __typeof(self) __weak weakSelf = self;
        [self requestProductsWithCommand:command
                       completionHandler:^(NSError *error, NSArray *products, NSArray *invalid) {
                           
                           __strong __typeof(weakSelf) strongSelf = weakSelf;
                           
                           if(error)
                           {
                               
                               
                               CDVPluginResult *pluginResult = [CDVPluginResult
                                                                resultWithStatus:CDVCommandStatus_ERROR
                                                                messageAsDictionary:@{@"err":[error localizedDescription]}];
                               [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                               
                               return;
                           }
                           
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
                           }
                           
                           NSDictionary *validProductsObject = @{@"validProducts":validProducts, @"invalidProducts":invalid};
                           
                           CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:validProductsObject];
                           [strongSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                           
                           
                       }];
        
        SKProductsRequest *request = [[SKProductsRequest alloc]
                                      initWithProductIdentifiers:
                                      [NSSet setWithArray:command.arguments]];
        request.delegate = self;
        
        
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
                   completionHandler:^(NSError *error, NSArray *products, NSArray *invalid) {
                       
                       __strong __typeof(weakSelf) strongSelf = weakSelf;
                       
                       if(error)
                           return;
                       
                       for (SKProduct *product in products)
                       {
                           
                           SKPayment * payment = [SKPayment paymentWithProduct:product];
                           [[SKPaymentQueue defaultQueue] addPayment:payment];
                           
                           strongSelf.payments[payment.productIdentifier] = command.callbackId;
                           
                       }
                   }];
    
    //[self jsCallback:command callbackType:NoCallback];
    
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


#pragma mark - SKProductsRequestDelegate

-(void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response
{
    NSArray *products = response.products;
    
    if (products.count != 0)
    {
        
        if(self.requestProductsCompletionHandler)
            self.requestProductsCompletionHandler(nil, products, response.invalidProductIdentifiers);
        
    }
    
    self.requestProductsCompletionHandler = nil;
    
}

-(void)request:(SKRequest *)request didFailWithError:(NSError *)error
{
    
    
    if(self.requestProductsCompletionHandler)
        self.requestProductsCompletionHandler(error, nil, nil);
    
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
                break;
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
    
    
    self.purchaseInProgress = NO;
    
    NSString *transactionReceipt = [transaction.transactionReceipt base64EncodedString];
    
    CDVPluginResult* pluginResult = [
                                     CDVPluginResult
                                     resultWithStatus:CDVCommandStatus_OK
                                     messageAsDictionary:@{
                                                           @"completeTransaction":@{
                                                                   @"transactionIdentifier":NILABLE(transaction.transactionIdentifier),
                                                                   @"transactionReceipt":NILABLE(transactionReceipt),
                                                                   @"productIdentifier":NILABLE(transaction.payment.productIdentifier)
                                                                   }
                                                           }
                                     ];
    
    if(self.payments && [self.payments valueForKeyPath:@"transaction.payment.productIdentifier"])
    {
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.payments[transaction.payment.productIdentifier]];
        [self.payments removeObjectForKey:transaction.payment.productIdentifier];
    }
    
}

- (void)restoreTransaction:(SKPaymentTransaction *)transaction
{
    
    NSLog(@"restoreTransaction...");
    [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
    
    
    self.purchaseInProgress = NO;
    
    NSString *transactionReceipt = [transaction.transactionReceipt base64EncodedString];
    
    CDVPluginResult* pluginResult = [
                                     CDVPluginResult
                                     resultWithStatus:CDVCommandStatus_OK
                                     messageAsDictionary:@{
                                                           @"restoreTransaction":@{
                                                                   @"transactionIdentifier":NILABLE(transaction.transactionIdentifier),
                                                                   @"transactionReceipt":NILABLE(transactionReceipt),
                                                                   @"productIdentifier":NILABLE(transaction.payment.productIdentifier)
                                                                   }
                                                           }
                                     ];
    
    if(self.payments && [self.payments valueForKeyPath:@"transaction.payment.productIdentifier"])
    {
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self.payments[transaction.payment.productIdentifier]];
        [self.payments removeObjectForKey:transaction.payment.productIdentifier];
    }
    
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
    
    CDVPluginResult* pluginResult = [
                                     CDVPluginResult
                                     resultWithStatus:CDVCommandStatus_ERROR
                                     messageAsDictionary:error
                                     ];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self.payments[transaction.payment.productIdentifier]];
    [self.payments removeObjectForKey:transaction.payment.productIdentifier];
    
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