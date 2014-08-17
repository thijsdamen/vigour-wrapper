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



@implementation VigourIoStore


- (void)fetch:(CDVInvokedUrlCommand*)command
{
    NSString *productId = (NSString*) [command.arguments objectAtIndex:0];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"jeppert"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


@end