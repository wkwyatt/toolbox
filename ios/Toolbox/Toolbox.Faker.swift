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
		class Faker : NSObject
		{
				static func numberBetween(_ first: Int, _ second: Int) -> Int
				{
						let lowerBound = min(first, second)
						let upperBound = max(first, second)
					
						return lowerBound + Int(arc4random()) % (upperBound - lowerBound)
				}
			
				static func randomBool() -> Bool
				{
						let number = (arc4random() % 30)+1
					
						return number % 5 == 0
				}
			
				static func randomPercent(_ min: Int = 0, _ max: Int = 100) -> Float
				{
						let formattedRndValue = Double(self.numberBetween(min, max)) * 0.01
					
						return Float(formattedRndValue) * 100
				}
		}
}
