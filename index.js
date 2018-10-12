
import { NativeModules, NativeEventEmitter } from 'react-native';

const { RNToolbox, BatteryManager } = NativeModules;

const TBBatteryManager = new NativeEventEmitter(BatteryManager);

export default { RNToolbox, TBBatteryManager };
