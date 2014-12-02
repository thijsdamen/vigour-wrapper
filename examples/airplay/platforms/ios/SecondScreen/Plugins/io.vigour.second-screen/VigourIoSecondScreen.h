//
//  VigourIoSecondScreen.h
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import <Cordova/CDV.h>


@interface VigourIoSecondScreen : CDVPlugin {}

- (void)presentBrowserInSecondScreenWithUrl:(CDVInvokedUrlCommand*)command;

@end