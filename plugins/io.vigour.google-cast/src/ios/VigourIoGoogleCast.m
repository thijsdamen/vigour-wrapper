//
//  VigourIoGoogleCast.h
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import <Cordova/CDV.h>


@interface VigourIoGoogleCast : CDVPlugin {}

-(void)startScanForDevices:(CDVInvokedUrlCommand*)command;
-(void)connectToDevice:(CDVInvokedUrlCommand*)command;
-(void)castMedia:(CDVInvokedUrlCommand*)command;

@end