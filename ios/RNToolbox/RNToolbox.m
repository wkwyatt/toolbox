
#import "RNToolbox.h"
#import <LocalAuthentication/LocalAuthentication.h>

@implementation RNToolbox

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(isAvailable: (RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
    LAContext *context = [[LAContext alloc] init];
    if ([context canEvaluatePolicy:kLAPolicyDeviceOwnerAuthenticationWithBiometrics error: NULL]) {
        resolve(@(YES));
    } else {
        resolve(@(NO));
    }
}

@end
  
