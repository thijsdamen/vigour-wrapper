//
//  VigourIoStore.m
//  Vigour.io
//
//  Created by Alexander van der Werff on 16/14/14.
//
//

#import "VigourIoSecondScreen.h"
#import <Cordova/CDV.h>
#import <Cordova/CDVViewController.h>
//#import <WebKit/WebKit.h>



@interface VigourIoSecondScreen() <UIWebViewDelegate>

@property (nonatomic, strong) UIWindow *secondWindow;
@property (nonatomic, strong) UIWebView *browser;
@property (nonatomic, strong) NSString *urlString;

@end

@implementation VigourIoSecondScreen {

}

- (CDVPlugin *)initWithWebView:(UIWebView *)theWebView
{
    if(self = [super initWithWebView:theWebView])
    {
        [self setUpScreenConnectionNotificationHandlers];
    }
    return self;
}


- (void)presentBrowserInSecondScreenWithUrl:(CDVInvokedUrlCommand*)command
{
    
    CDVPluginResult* pluginResult = nil;
    
    if (![command.arguments firstObject] || [command.arguments count] > 2)
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }
    else
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        self.urlString = [command.arguments firstObject];
        [self checkForExistingScreenAndInitializeIfPresent];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)checkForExistingScreenAndInitializeIfPresent
{
    if ([[UIScreen screens] count] > 1)
    {
        UIScreen *secondScreen = [[UIScreen screens] objectAtIndex:1];
        CGRect screenBounds = secondScreen.bounds;
        
        self.secondWindow = [[UIWindow alloc] initWithFrame:screenBounds];
        self.secondWindow.screen = secondScreen;
        
        [self presentWebView];
    }
}

- (void)setUpScreenConnectionNotificationHandlers
{
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    
    [center addObserver:self selector:@selector(handleScreenDidConnectNotification:)
                   name:UIScreenDidConnectNotification object:nil];
    [center addObserver:self selector:@selector(handleScreenDidDisconnectNotification:)
                   name:UIScreenDidDisconnectNotification object:nil];
}


#pragma mark - Handling screen connection and disconnection notifications

- (void)handleScreenDidConnectNotification:(NSNotification*)aNotification
{
    UIScreen *newScreen = [aNotification object];
    CGRect screenBounds = newScreen.bounds;
    
    if (!self.secondWindow)
    {
        self.secondWindow = [[UIWindow alloc] initWithFrame:screenBounds];
        self.secondWindow.layer.contentsGravity = kCAGravityResizeAspect;
        self.secondWindow.screen = newScreen;
        [self presentWebView];
    }
}

- (void)handleScreenDidDisconnectNotification:(NSNotification*)aNotification
{
    if (self.secondWindow)
    {
        self.secondWindow.hidden = YES;
        self.secondWindow = nil;
    }
    
}

#pragma mark - UIWebViewDelegate

-(void)webViewDidFinishLoad:(UIWebView *)webView
{
    NSLog(@"req loaded");
}

- (void)presentWebView
{
    //        if ([NSProcessInfo instancesRespondToSelector:@selector(isOperatingSystemAtLeastVersion:)]) {
    //            self.webView = [[WKWebView alloc] initWithFrame:screenBounds];
    //        } else {
    //            self.webView = [[UIWebView alloc] initWithFrame:screenBounds];
    //        }
    
    if(!self.urlString)
    {
        return;
    }
    
    if(!self.browser)
    {
        self.browser = [[UIWebView alloc] initWithFrame:self.secondWindow.screen.bounds];
        UIViewController *controller = [UIViewController new];
        self.secondWindow.rootViewController = controller;
        [controller.view addSubview:self.browser];
        self.browser.delegate = self;
    }
    
    NSURLRequest *theRequest=[NSURLRequest requestWithURL:[NSURL URLWithString:self.urlString] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:60];

    [self.browser loadRequest:theRequest];
    
    self.secondWindow.hidden = NO;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

@end