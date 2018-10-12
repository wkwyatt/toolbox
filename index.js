
import { NativeModules, NativeEventEmitter } from 'react-native';
import Util from './src/Util';

const { RNToolbox, BatteryManager } = NativeModules;

// const TBBatteryManager = new NativeEventEmitter(BatteryManager);
const TB = Util.native('RNToolbox');
const TBBattery = Util.native('BatteryManager');

export default { RNToolbox, BatteryManager, TBBattery };
