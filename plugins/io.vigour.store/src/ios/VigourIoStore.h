//
//  VigourIoStore.h
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import <Cordova/CDVPlugin.h>

@interface VigourIoStore : CDVPlugin {}

- (void)fetch:(CDVInvokedUrlCommand*)command;

@end