//

import UIKit

extension Toolbox
{
		class Event : NSObject
    {
        static let provider = NotificationCenter.default
        
        public typealias Listeners = [String: (NSNotification)->()]
        
        var listeners : Listeners = [:]
        
        func listen(_ listeners : [Notification.Name: (NSNotification)->()])
        {
            for (name,handler) in listeners {
                
                self.listeners[name.rawValue] = handler
                
                Event.provider.addObserver(
                    self,
                    selector: #selector(handle),
                    name: name,
                    object: nil
                )
            }
        }
        
        static func fire(name: Notification.Name, params: [String: Any]? = nil)
        {
            Event.provider.post(
                name: name, object: params
            )
        }
        
        func ignore(named : [Notification.Name])
        {
            for name in named {
                self.ignore(name)
            }
        }
        
        func ignore(_ name : Notification.Name)
        {
            self.listeners.removeValue(forKey: name.rawValue)
            
            Event.provider.removeObserver(
                self, name: name, object: nil
            )
        }
        
        func ignoreAll()
        {
            for (name,_) in self.listeners {
                self.ignore(Notification.Name(rawValue: name))
            }
        }
        
        func handle(notification: NSNotification)
        {
            let handler = self.listeners[
                notification.name.rawValue
            ]
          
            if handler == nil {
                return
            }
            
            handler!(notification)
        }
    }
    
}


