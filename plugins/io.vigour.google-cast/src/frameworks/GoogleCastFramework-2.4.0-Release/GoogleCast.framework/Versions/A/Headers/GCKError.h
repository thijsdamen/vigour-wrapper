// Copyright 2013 Google Inc.

#import <Foundation/Foundation.h>

#import "GCKDefines.h"

/** @file GCKError.h
 *  @brief Error codes
 */

/**
 * @enum GCKErrorCode
 * @brief Description of error codes
 */
typedef NS_ENUM(NSInteger, GCKErrorCode) {

  /**
   * Error code indicating a network I/O error.
   */
  GCKErrorCodeNetworkError = 1,

  /**
   * Error code indicating that an operation has timed out.
   */
  GCKErrorCodeTimeout = 2,

  /**
   * Error code indicating an authentication error.
   */
  GCKErrorCodeDeviceAuthenticationFailure = 3,

  /**
   * Error code indicating that an invalid request was made.
   */
  GCKErrorCodeInvalidRequest = 4,

  /**
   * Error code indicating that an in-progress request has been cancelled, most likely because
   * another action has preempted it.
   */
  GCKErrorCodeCancelled = 5,

  /**
   * Error code indicating that a request has been replaced by another request of the same type.
   */
  GCKErrorCodeReplaced = 6,

  /**
   * Error code indicating that the request was disallowed and could not be completed.
   */
  GCKErrorCodeNotAllowed = 7,

  /**
   * Error code indicating that a request could not be made because the same type of request is
   * still in process.
   */
  GCKErrorCodeDuplicateRequest = 8,

  /**
   * Error code indicating that a requested application could not be found.
   */
  GCKErrorCodeApplicationNotFound = 20,

  /**
   * Error code indicating that a requested application is not currently running.
   */
  GCKErrorCodeApplicationNotRunning = 21,

  /**
   * Error code indicating that the application session ID was not valid.
   */
  GCKErrorCodeInvalidApplicationSessionID = 22,

  /**
   * Error code indicating that a media load failed on the receiver side.
   */
  GCKErrorCodeMediaLoadFailed = 30,

  /**
   * Error code indicating that a media media command failed because of the media player state.
   */
  GCKErrorCodeInvalidMediaPlayerState = 31,

  /**
   * Error code indicating the app entered the background.
   */
  GCKErrorCodeAppDidEnterBackground = 91,

  /**
   * Error code indicating a disconnection occurred during the request.
   */
  GCKErrorCodeDisconnected = 92,

  /**
   * Error code indicating that an unknown, unexpected error has occurred.
   */
  GCKErrorCodeUnknown = 99,
};

/**
 * The key for the customData JSON object associated with the error in the userInfo dictionary.
 */
GCK_EXTERN NSString *const kGCKErrorCustomDataKey;

/**
 * The class for all GCK framework errors.
 *
 * @ingroup Utilities
 */
GCK_EXPORT
@interface GCKError : NSError

/**
 * Returns the name of the enum value for a given error code.
 */
+ (NSString *)enumDescriptionForCode:(GCKErrorCode)code;

@end
