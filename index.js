
import { NativeModules, NativeEventEmitter } from 'react-native';
import Util from './src/Util';

const { TBBatteryManager } = NativeModules;

// const TBBatteryManager = new NativeEventEmitter(BatteryManager);
// const TB = Util.native('RNToolbox');
// const TBBattery = Util.native('BatteryManager');

export default { TBBatteryManager };
