import {AsyncStorage} from "react-native"
import {Log, Util} from "../Helpers"

export default class Storage
{
    static boot(app)
    {
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem('TB').then(result => {
                let storage = new Storage();
                if(!result) {
                    AsyncStorage.setItem('TB', JSON.stringify({}), ()=>{
                        resolve(storage);
                    });
                } else {
                    storage.cache = JSON.parse(result);
                    resolve(storage)
                }
            }).catch(e => {
                console.warn('Storage @ boot', e);
                reject(e);
            });
        });
    }

    constructor(props)
    {
        this.cache = {};
    }

    static cached(keyPath)
    {
        let parts = keyPath.split('.');
        let value = this.cache;
        for (let i = 0; i < parts.length; i++) {
            value = value[parts[i]];
        }

        return value;
    }

    static has(keyPath)
    {
        let storage = this;
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem('TB').then(result => {
                let flattenedValue = storage.flatten(JSON.parse(result));
                resolve(flattenedValue.hasOwnProperty(keyPath));
            }).catch(e => {
                console.warn('Storage @ has', e);
                reject(e);
            });
        });
    }

    static forget(keyPath)
    {
        return this.put(keyPath);
    }

    static all()
    {
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem('TB').then(result => {
                resolve(JSON.parse(result));
            }).catch(e => {
                console.warn('Storage @ all', e);
                reject(e);
            });
        });

    }

    static log()
    {
        AsyncStorage.getItem('TB').then(result => {
            Log.object('Storage Update', JSON.parse(result));
        }).catch(e => {
            console.warn('Storage @ log', e);
            reject(e);
        });
    }

    static put(keyPath, value)
    {
        let storage = this;
        return new Promise((resolve,reject)=>{
            AsyncStorage.getItem('TB').then(result => {
                let parsedResult = JSON.parse(result);
                let flattenedValue = storage.flatten(parsedResult);
                flattenedValue[keyPath] = value;

                if (value === undefined) {
                    delete flattenedValue[keyPath];
                }

                let updated = this.unflatten(flattenedValue);
                AsyncStorage.setItem('TB', JSON.stringify(updated), ()=>{
                    this.cache = updated;
                    resolve(value);
                });
            }).catch(e => {
                console.warn('Storage @ put', e);
                reject(e);
            });
        });
    }

    static get(keyPath, defaultValue)
    {
        let storage = this;

        return new Promise((resolve,reject) => {
            AsyncStorage.getItem('TB').then(result => {
                let parts = keyPath.split('.');

                let parsedResult = JSON.parse(result);
                let value = parsedResult;
                for (let i = 0; i < parts.length; i++) {
                    if (value && value[parts]) {
                        value = value[parts[i]];
                    }
                }

                if (value) {
                    return resolve(value);
                }

                storage.put(keyPath, defaultValue).then(()=>{
                    resolve(defaultValue);
                });
            }).catch(e => {
                reject(e);
            });
        });
    }

    static unflatten(data)
    {
        if (Object(data) !== data || Array.isArray(data))
            return data;
        var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
            resultholder = {};
        for (var p in data) {
            var cur = resultholder,
                prop = "",
                m;
            while (m = regex.exec(p)) {
                cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
                prop = m[2] || m[1];
            }
            cur[prop] = data[p];
        }
        return resultholder[""] || resultholder;
    }

    static flatten(data)
    {
        var result = {};
        function recurse (cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                for(var i=0, l=cur.length; i<l; i++)
                    recurse(cur[i], prop + "[" + i + "]");
                if (l == 0)
                    result[prop] = [];
            } else {
                var isEmpty = true;
                for (var p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop+"."+p : p);
                }
                if (isEmpty && prop)
                    result[prop] = {};
            }
        }
        recurse(data, "");
        return result;
    }

    static storage(keyOrMap, defaultValue)
    {
        if (Util.isString(keyOrMap)) {
            return this.get(keyOrMap, defaultValue);
        }
        else if (!Util.isUndefined(keyOrMap)) {
            let key = Util.head(
                Util.keys(keyOrMap)
            );

            return this.put(key, keyOrMap[key]);
        }

        return this;
    }
}