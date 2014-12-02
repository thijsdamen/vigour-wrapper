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

- (void)connectToDevice:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult* pluginResult = nil;
    
    if (![command.arguments firstObject])
    {
        self.receiverAppID = command.arguments.firstObject;
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"no id provided"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    NSString *deviceIdentifier = command.arguments.firstObject;
    for (GCKDevice *device in self.deviceScanner.devices) {
        
        if ([deviceIdentifier isEqualToString:device.deviceID])
        {
            NSLog(@"device found for connection: %@", device);
            
            self.selectedDevice = device;
            NSDictionary *info = [[NSBundle mainBundle] infoDictionary];
            self.deviceManager = [[GCKDeviceManager alloc] initWithDevice:self.selectedDevice clientPackageName:[info objectForKey:@"CFBundleIdentifier"]];
            self.deviceManager.delegate = self;
            [self.deviceManager connect];
        }
    }
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"will connect"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)updateStatsFromDevice
{
    
    if (self.mediaControlChannel && self.isConnected) {
        _mediaInformation = self.mediaControlChannel.mediaStatus.mediaInformation;
    }
}

- (BOOL)isConnected
{
    return self.deviceManager.isConnected;
}

//Cast video
-(void)castMedia:(CDVInvokedUrlCommand*)command
{
    
    CDVPluginResult* pluginResult = nil;
    
    //Show alert if not connected
    if (!self.deviceManager || !self.deviceManager.isConnected) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Not Connected!"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    if(![command.arguments firstObject])
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"we need params!"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
    //Define Media metadata
    GCKMediaMetadata *metadata = [[GCKMediaMetadata alloc] init];
    
    NSDictionary *params = command.arguments.firstObject;

    if([params objectForKey:@"metaDataTitle"])
    {
        [metadata setString:[params objectForKey:@"metaDataTitle"] forKey:kGCKMetadataKeyTitle];
    }
    
    if([params objectForKey:@"metaDataSubTitle"])
    {
        [metadata setString:[params objectForKey:@"metaDataSubTitle"] forKey:kGCKMetadataKeySubtitle];
    }
    
    if([params objectForKey:@"metaDatamageUrl"])
    {
        [metadata addImage:[[GCKImage alloc]
                            initWithURL:[[NSURL alloc] initWithString:[params objectForKey:@"metaDatamageUrl"]]
                            width:480
                            height:360]];
    }
    
    if([params objectForKey:@"contentID"])
    {
        //define Media information
        GCKMediaInformation *mediaInformation =
        [[GCKMediaInformation alloc] initWithContentID:
         [params objectForKey:@"contentID"]
                                            streamType:GCKMediaStreamTypeNone
                                           contentType:@"text/html"
                                              metadata:metadata
                                        streamDuration:0
                                            customData:nil];
        
        //cast media
        [self.mediaControlChannel loadMedia:mediaInformation autoplay:TRUE playPosition:0];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"will cast"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        
    }
    else
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"No content id!"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
        return;
    }
    
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
    [self jsEval:@"dispatchEvent" withMessage:@[@"deviceManagerDidConnect", @{@"receiverAppID":self.receiverAppID}]];
}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didConnectToCastApplication:(GCKApplicationMetadata *)applicationMetadata
                      sessionID:(NSString *)sessionID
            launchedApplication:(BOOL)launchedApplication {

    [self jsEval:@"dispatchEvent" withMessage:@[@"didConnectToCastApplication", @{@"sessionID":sessionID, @"launchedApplication":@(launchedApplication)}]];
    
  self.mediaControlChannel = [[GCKMediaControlChannel alloc] init];
  self.mediaControlChannel.delegate = self;
  [self.deviceManager addChannel:self.mediaControlChannel];
  [self.mediaControlChannel requestStatus];

}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didFailToConnectToApplicationWithError:(NSError *)error
{
    [self jsEval:@"dispatchEvent" withMessage:@[@"didFailToConnectToApplicationWithError", @{@"error":error.localizedDescription}]];
}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didFailToConnectWithError:(GCKError *)error
{
    [self jsEval:@"dispatchEvent" withMessage:@[@"didFailToConnectWithError", @{@"error":error.localizedDescription}]];
}

- (void)deviceManager:(GCKDeviceManager *)deviceManager didDisconnectWithError:(GCKError *)error
{
  NSLog(@"Received notification that device disconnected");

  if (error != nil) {
      [self jsEval:@"dispatchEvent" withMessage:@[@"didDisconnectWithError", @{@"error":error.localizedDescription}]];
  }

}

- (void)deviceManager:(GCKDeviceManager *)deviceManager
    didReceiveStatusForApplication:(GCKApplicationMetadata *)applicationMetadata
{
  self.applicationMetadata = applicationMetadata;
    [self jsEval:@"dispatchEvent" withMessage:@[@"didReceiveStatusForApplication", @{@"":@""}]];
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