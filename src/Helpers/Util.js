import Lodash from 'lodash'
import Moment from "moment"
import {
    Alert,
    NativeEventEmitter,
    NativeModules
} from "react-native"

export default class Util extends Lodash
{
    static moment = Moment;

    static alert(title, message, actions)
    {
        Alert.alert(title, message, actions);
    }

    static copy(cloneable)
    {
        let cloneableCopy;
        try {
            cloneableCopy = {...cloneable};
        } catch (e) {
            cloneableCopy = cloneable;
        }

        return cloneableCopy;
    }

    static native(module)
    {
        return {
            module: NativeModules[module],
            events: new NativeEventEmitter(NativeModules[module]),
        };
    }

    static promise(callback)
    {
        return new Promise((resolve, reject) => {
            if (!callback) {
                return resolve();
            }

            callback(resolve, reject);
        });
    }

    static wait(seconds)
    {
        return new Promise(resolve => {
            setTimeout(() => resolve(), seconds * 1000);
        });
    }

    static waitAtleast(time, process)
    {
        return new Promise((resolve,reject) => {
            let processesFinished = 0,
                processResult;

            process.then(result => {
                processResult = result;
                processesFinished++;
                if (processesFinished == 2) {
                    resolve(processResult);
                }
            }).catch(e => reject(e));

            Util.wait(time).then(() => {
                processesFinished++;
                if (processesFinished == 2) {
                    resolve(processResult);
                }
            });
        });
    }

    static overwrite(original, overrides)
    {
        if (!original) {
            original = {};
        }

        Util.forEach(overrides, (value, name) => {
            if (!Util.isObject(value)) {
                original[name] = value;
            }
            else {
                original[name] = this.overwrite(
                    original[name], value
                );
            }
        });

        return original;
    }
}