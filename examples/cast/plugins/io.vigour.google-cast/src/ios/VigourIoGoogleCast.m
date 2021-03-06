//
//  VigourIoGoogleCast.m
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//


#import "VigourIoGoogleCast.h"
#import <Cordova/CDV.h>
#import <Cordova/CDVViewController.h>
#import <GoogleCast/GoogleCast.h>

@interface VigourIoGoogleCast() <GCKDeviceScannerListener, GCKDeviceManagerDelegate, GCKMediaControlChannelDelegate>

@property GCKMediaControlChannel *mediaControlChannel;
@property GCKApplicationMetadata *applicationMetadata;
@property GCKDevice *selectedDevice;
@property(nonatomic, strong) GCKDeviceScanner *deviceScanner;
@property(nonatomic, strong) GCKDeviceManager *deviceManager;
@property(nonatomic, readonly) GCKMediaInformation *mediaInformation;
@property(nonatomic, strong) NSString *receiverAppID;

@end

@implementation VigourIoGoogleCast {

}


#pragma mark - API


-(void)startScanForDevices:(CDVInvokedUrlCommand*)command
{

  CDVPluginResult* pluginResult = nil;
  
    if ([command.arguments firstObject])
    {
        self.receiverAppID = command.arguments.firstObject;
    }
    else
    {
        self.receiverAppID = kGCKMediaDefaultReceiverApplicationID;
    }
	
    self.deviceScanner = [[GCKDeviceScanner alloc] init];

    [self.deviceScanner addListener:self];
    [self.deviceScanner startScan];

    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"scanning started"];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


#pragma	mark - Lazy properties



#pragma mark - GCKDeviceScannerListener

- (void)deviceDidComeOnline:(GCKDevice *)device
{
    [self jsEval:@"dispatchEvent" withMessage:@[@"deviceDidComeOnline",
                                                @{@"friendlyName":device.friendlyName, @"id":device.deviceID, @"modelName":device.modelName}]
     ];
}

- (void)deviceDidGoOffline:(GCKDevice *)device
{
    [self jsEval:@"dispatchEvent" withMessage:@[@"deviceDidGoOffline",
                                                @{@"friendlyName":device.friendlyName, @"id":device.deviceID, @"modelName":device.modelName}]
     ];
}

#pragma mark - GCKDeviceManagerDelegate

- (void)deviceManagerDidConnect:(GCKDeviceManager *)deviceManager
{
    [self.deviceManager launchApplication:self.receiverAppID ];
    [self jsEval:@"dispatchEvent" withMessage:@[@"deviceManagerDidConnect", self.receiverAppID]];
}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didConnectToCastApplication:(GCKApplicationMetadata *)applicationMetadata
                      sessionID:(NSString *)sessionID
            launchedApplication:(BOOL)launchedApplication {

  NSLog(@"application has launched");
  self.mediaControlChannel = [[GCKMediaControlChannel alloc] init];
  self.mediaControlChannel.delegate = self;
  [self.deviceManager addChannel:self.mediaControlChannel];
  [self.mediaControlChannel requestStatus];

}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didFailToConnectToApplicationWithError:(NSError *)error
{
    
}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didFailToConnectWithError:(GCKError *)error
{
}

- (void)deviceManager:(GCKDeviceManager *)deviceManager didDisconnectWithError:(GCKError *)error
{
  NSLog(@"Received notification that device disconnected");

  if (error != nil) {

  }

}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didReceiveStatusForApplication:(GCKApplicationMetadata *)applicationMetadata
{
  self.applicationMetadata = applicationMetadata;
}

- (void)dealloc
{

}

- (void)jsEval:(NSString *)callbackName withMessage:(NSArray *)arguments
{
    NSString* jsonString = @"";
    
    if(arguments)
    {
        NSData* jsonData = [NSJSONSerialization dataWithJSONObject:arguments options:1 error:nil];
        jsonString = [[NSString alloc] initWithBytes:[jsonData bytes] length:[jsonData length] encoding:NSUTF8StringEncoding];
    }
    
    NSString *js = [NSString stringWithFormat:@"GoogleCast.%@.apply(GoogleCast, %@);", callbackName, jsonString];
    [self.commandDelegate evalJs:js];
}

@end