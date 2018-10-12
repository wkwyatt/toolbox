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
  class Device : NSObject
  {
    static let current = Toolbox.Device()
    
    var brightness : CGFloat {
      get {
        return UIScreen.main.brightness
      }
      set(newValue) {
        UIScreen.main.brightness = newValue
      }
    }
    
    func isEmulator() -> Bool
    {
      var isEmulator = false
      #if arch(i386) || arch(x86_64)
        isEmulator = true
      #endif
      
      return isEmulator
    }
    
    var deviceId: String {
      return UUID().uuidString
    }
    
    var modelName: String {
      var systemInfo = utsname()
      uname(&systemInfo)
      let machineMirror = Mirror(reflecting: systemInfo.machine)
      let identifier = machineMirror.children.reduce("") { identifier, element in
        guard let value = element.value as? Int8, value != 0 else { return identifier }
        return identifier + String(UnicodeScalar(UInt8(value)))
      }
      
      switch identifier {
      case "iPod5,1":                                 return "iPod Touch 5"
      case "iPod7,1":                                 return "iPod Touch 6"
      case "iPhone3,1", "iPhone3,2", "iPhone3,3":     return "iPhone 4"
      case "iPhone4,1":                               return "iPhone 4s"
      case "iPhone5,1", "iPhone5,2":                  return "iPhone 5"
      case "iPhone5,3", "iPhone5,4":                  return "iPhone 5c"
      case "iPhone6,1", "iPhone6,2":                  return "iPhone 5s"
      case "iPhone7,2":                               return "iPhone 6"
      case "iPhone7,1":                               return "iPhone 6 Plus"
      case "iPhone8,1":                               return "iPhone 6s"
      case "iPhone8,2":                               return "iPhone 6s Plus"
      case "iPhone9,1", "iPhone9,3":                  return "iPhone 7"
      case "iPhone9,2", "iPhone9,4":                  return "iPhone 7 Plus"
      case "iPhone8,4":                               return "iPhone SE"
      case "iPhone10,1", "iPhone10,4":                return "iPhone 8"
      case "iPhone10,2", "iPhone10,5":                return "iPhone 8 Plus"
      case "iPhone10,3", "iPhone10,6":                return "iPhone X"
      case "iPad2,1", "iPad2,2", "iPad2,3", "iPad2,4":return "iPad 2"
      case "iPad3,1", "iPad3,2", "iPad3,3":           return "iPad 3"
      case "iPad3,4", "iPad3,5", "iPad3,6":           return "iPad 4"
      case "iPad4,1", "iPad4,2", "iPad4,3":           return "iPad Air"
      case "iPad5,3", "iPad5,4":                      return "iPad Air 2"
      case "iPad6,11", "iPad6,12":                    return "iPad 5"
      case "iPad2,5", "iPad2,6", "iPad2,7":           return "iPad Mini"
      case "iPad4,4", "iPad4,5", "iPad4,6":           return "iPad Mini 2"
      case "iPad4,7", "iPad4,8", "iPad4,9":           return "iPad Mini 3"
      case "iPad5,1", "iPad5,2":                      return "iPad Mini 4"
      case "iPad6,3", "iPad6,4":                      return "iPad Pro 9.7 Inch"
      case "iPad6,7", "iPad6,8":                      return "iPad Pro 12.9 Inch"
      case "iPad7,1", "iPad7,2":                      return "iPad Pro 12.9 Inch 2. Generation"
      case "iPad7,3", "iPad7,4":                      return "iPad Pro 10.5 Inch"
      case "AppleTV5,3":                              return "Apple TV"
      case "AppleTV6,2":                              return "Apple TV 4K"
      case "AudioAccessory1,1":                       return "HomePod"
      case "i386", "x86_64":                          return "Simulator"
      default:                                        return identifier
      }
    }
    
    func userAgent()-> String {
      let webView = UIWebView(frame: CGRect.zero)
      return webView.stringByEvaluatingJavaScript(from: "navigator.userAgent")!
    }
    
    var locale: String {
      let language: String = NSLocale.preferredLanguages[0]
      return language
    }
    
    var country: String? {
      return (Locale.current as NSLocale).object(forKey: .countryCode) as? String
    }
    
    var timezone: String {
      let currentTimeZone = NSTimeZone.local
      return currentTimeZone.identifier
    }
    
    func isTablet() -> Bool {
      return UIDevice.current.userInterfaceIdiom == .pad
    }
    
    func info() -> [AnyHashable: Any]
    {
      let currentDevice = UIDevice.current
      let info : [AnyHashable: Any] = [
        "systemName": currentDevice.systemName,
        "systemVersion": currentDevice.systemVersion,
        "model": self.modelName,
        "brand": "Apple",
        "name": currentDevice.name,
        "locale": self.locale,
        "country": self.country != nil ? self.country! : "",
        "uniqueId": self.deviceId,
        "bundleId": Bundle.main.object(forInfoDictionaryKey: "CFBundleIdentifier") != nil ? self.country! : "",
        "appVersion": Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") != nil ? self.country! : "",
        "buildNumber": Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") != nil ? self.country! : "",
        "systemManufacturer": "Apple",
        //        "userAgent": self.userAgent(),
        "timezone": self.timezone,
        "isEmulator": self.isEmulator(),
        "isTablet": self.isTablet()
      ]
      
      return info
    }
    
    //        @objc(notify:)
    //        func notify(_ message: String)
    //        {
    //            UIApplication.shared.registerUserNotificationSettings(
    //                UIUserNotificationSettings(
    //                    types: [.badge, .alert, .sound],
    //                    categories: nil
    //                )
    //            )
    //
    //            var calendar = NSCalendar.current
    //            var calendarComponents = DateComponents()
    //            calendarComponents.hour = 7
    //            calendarComponents.second = 0
    //            calendarComponents.minute = 0
    //            calendar.timeZone = NSTimeZone.default
    //            let dateToFire = calendar.date(from: calendarComponents)
    //
    //            let notification = UILocalNotification()
    //            notification.timeZone = NSTimeZone.default
    //            notification.fireDate = Date()
    //            notification.alertBody = message
    //            notification.alertAction = "Open"
    //            notification.fireDate = dateToFire
    //            notification.soundName = UILocalNotificationDefaultSoundName
    //
    //            UIApplication.shared.scheduleLocalNotification(notification)
    //        }
    
    /*
     |--------------------------------------------------------------------------
     | Device Battery
     |--------------------------------------------------------------------------
     */
    
    let battery = Battery()
    
    class Battery : NSObject
    {
      let events = Toolbox.Event()
      
      var onChangeHandler : ((Battery?)->())!
      
      public private(set) var isCharging : Bool
      {
        get {
          return UIDevice.current.batteryState == .charging
        }
        set(newValue) {}
      }
      
      public private(set) var isUnplugged : Bool
      {
        get {
          return UIDevice.current.batteryState == .unplugged
        }
        set(newValue) {}
      }
      
      public private(set) var level : Float
      {
        get {
          return UIDevice.current.batteryLevel
        }
        set(newValue) {}
      }
      
      func percent() -> Int
      {
        if self.level == -1 {
          return Int(self.level)
        }
        
        return Int(self.level * 100)
      }
      
      func startMonitoring(_ onChange: @escaping (Battery?)->())
      {
        self.onChangeHandler = onChange
        
        UIDevice.current.isBatteryMonitoringEnabled = true
        
        self.events.listen([
          .UIDeviceBatteryLevelDidChange: self.levelChanged,
          .UIDeviceBatteryStateDidChange: self.levelChanged,
          ])
      }
      
      func levelChanged(notification: NSNotification?)
      {
        if self.onChangeHandler != nil {
          self.onChangeHandler(self)
        }
      }
      
      func stopMonitoring()
      {
        self.events.ignore(named: [
          .UIDeviceBatteryLevelDidChange,
          .UIDeviceBatteryStateDidChange,
          ])
        
        UIDevice.current.isBatteryMonitoringEnabled = false
        
        self.onChangeHandler = nil
      }
      
      func info() -> [String:Any]
      {
        return [
          "isCharging": self.isCharging,
          "isUnplugged": self.isUnplugged,
          "level": self.level,
          "percent": self.percent(),
        ]
      }
    }
  }
}

