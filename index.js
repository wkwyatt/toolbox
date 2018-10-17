
import { NativeModules, NativeEventEmitter } from 'react-native';
import Util from './src/Util';
import Root from './src/Root';

const { TBBatteryManager } = NativeModules;

// const TBBatteryManager = new NativeEventEmitter(BatteryManager);
// const TB = Util.native('RNToolbox');
// const TBBattery = Util.native('BatteryManager');

export { TBBatteryManager, Root };
