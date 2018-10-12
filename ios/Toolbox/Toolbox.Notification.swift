//
//  Toolbox.Faker.swift
//  TBBatteryMonitor
//
//  Created by Larkin Whitaker on 2/2/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit
import UserNotifications

extension Toolbox
{
    class UINotification : NSObject
    {
        let title : String
        let message : String!
        
        var action : String!
        
        var fireAt : DateComponents!
        
        init(title: String, message: String? = nil)
        {
            self.title = title
            self.message = message
        }
        
        func action(_ title: String) -> Self
        {
            self.action = action
            
            return self
        }
        
        func notifyAt(hour: Int = 0, minute: Int = 0, second: Int = 0) -> Self
        {
            self.fireAt = DateComponents()
            self.fireAt.hour = hour
            self.fireAt.minute = minute
            self.fireAt.second = second
            
            return self
        }
        
        static func askPermission()
        {
            if #available(iOS 10.0, *) {
                let center = UNUserNotificationCenter.current()
                center.requestAuthorization(options: [.alert, .badge, .sound]) { (granted, error) in
                    if granted {
                        print("Yay!")
                    } else {
                        print("D'oh")
                    }
                }
            }
            else {
                UIApplication.shared.registerUserNotificationSettings(
                    UIUserNotificationSettings(
                        types: [.badge, .alert, .sound],
                        categories: nil
                    )
                )
            }
        }
        
        func alert()
        {
            UINotification.askPermission()
            
            var calendar = NSCalendar.current
            calendar.timeZone = NSTimeZone.default
            let defaultFireDate = NSDate(timeIntervalSinceNow: 5) as Date
            
            if #available(iOS 10.0, *)
            {
                let content = UNMutableNotificationContent()
                content.title = self.title
                if self.message != nil {
                    content.body = self.message
                }
                content.categoryIdentifier = "alarm"
                content.sound = UNNotificationSound.default()
                
            
                var dateComponents = calendar.dateComponents(
                    [.hour, .minute, .second], from: defaultFireDate
                )
                if self.fireAt != nil {
                    dateComponents = self.fireAt
                }
                
                let trigger = UNCalendarNotificationTrigger(
                    dateMatching: dateComponents, repeats: false
                )
                let request = UNNotificationRequest(
                    identifier: UUID().uuidString,
                    content: content,
                    trigger: trigger
                )
                UNUserNotificationCenter.current().add(request)
                
            } else {
                
                // ios 9
                let notification = UILocalNotification()
                
                if self.fireAt != nil {
                    notification.fireDate = calendar.date(from: self.fireAt)
                }
                else {
                    notification.fireDate = defaultFireDate
                }
                
                notification.alertBody = "\(self.title)"
                if self.message != nil {
                    notification.alertBody = notification.alertBody!
                        + "\r\n\(self.message)"
                }
                
                if self.action != nil {
                    notification.alertAction = self.action
                }
                
                notification.soundName = UILocalNotificationDefaultSoundName
                UIApplication.shared.scheduleLocalNotification(notification)
            }
        }
    }
}
