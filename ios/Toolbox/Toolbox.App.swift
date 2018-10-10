//
//  Toolbox.Faker.swift
//  TBBatteryMonitor
//
//  Created by Larkin Whitaker on 2/2/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit

extension Toolbox
{
    class App : NSObject
    {
        static let shared : Toolbox.App = Toolbox.App()
        
        enum SettingType : String
        {
            case LocationServices = "LOCATION_SERVICES"
        }
        
        // @discardableResult func openSettings(ofType: SettingType? = nil) -> Bool  // Changed to comply with App Store for release
        @discardableResult func openSettings() -> Bool
        {
          
          guard let settingsUrl = URL(string: UIApplicationOpenSettingsURLString) else { return false }
            
            if !UIApplication.shared.canOpenURL(settingsUrl) {
                return false
            }
            
            UIApplication.shared.openURL(settingsUrl)
            
            return true
        }
      
        func keepAwake()
        {
            UIApplication.shared.isIdleTimerDisabled = true
        }
        
        func letSleep()
        {
            UIApplication.shared.isIdleTimerDisabled = false
        }
        
        var state : State
        {
            return State()
        }
        
        class State : NSObject
        {
            var type : UIApplicationState {
                return UIApplication.shared.applicationState
            }
            
            var typeName : String {
                switch self.type {
                case .background : return "background"
                case .active : return "active"
                case .inactive : return "inactive"
                }
            }
            
            var info : [String:Any] {
                return ["type": ["name": self.typeName, "code": self.type.rawValue], "time_left": self.timeLeft, "can_refresh": self.canRefreshStatus]
            }
            
            var canRefreshStatus : Bool {
                return UIApplication.shared.backgroundRefreshStatus == .available
            }
            
            var timeLeft : Double {
                return UIApplication.shared.backgroundTimeRemaining
            }
        }
    } 
}
