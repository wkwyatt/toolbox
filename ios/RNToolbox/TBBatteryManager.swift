//
//  TBBattery.swift
//  TBBatteryMonitor
//
//  Created by Larkin Whitaker on 2/2/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation


@objc(TBBatteryManager)
class TBBatteryManager: RCTEventEmitter
{
    override func supportedEvents() -> [String]!
    {
        return ["BatteryStatusChange"]
    }
    
    override init()
    {
        super.init()
        
        Toolbox.Device.current.battery.startMonitoring{_ in
            self.batteryLevelChanged()
        }
    }
    
    @objc(getBatteryInfo:)
    func getBatteryInfo(getBatteryInfo: @escaping RCTResponseSenderBlock)
    {
        getBatteryInfo([self.getBatteryStatus()])
    }
    
    func getBatteryStatus() -> NSDictionary
    {
        return Toolbox.Device.current.battery.info() as NSDictionary
    }
    
    func batteryLevelChanged()
    {
        self.sendEvent(
            withName: "BatteryStatusChange",
            body: self.getBatteryStatus()
        )
    }
    
    @objc(ignore)
    func ignore()
    {
        Toolbox.Device.current.battery.stopMonitoring()
    }
}
