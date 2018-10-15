//
//  TBBatteryManager.m
//  Toolbox
//
//  Created by Larkin Whitaker on 2/2/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridge.h>
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(TBBatteryManager, NSObject)

RCT_EXTERN_METHOD(getBatteryInfo:(RCTResponseSenderBlock)success);
RCT_EXTERN_METHOD(ignore);

@end
