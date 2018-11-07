'use strict';

import React from "react";
import {
    AppState,
    Dimensions,
    NativeModules,
    PixelRatio,
    Platform,
    StyleSheet
} from "react-native";

import Config from "../Config"
import { Log, Util } from "../Helpers";

import Network from "./Network";

export default class Device
{
    /**
     * @return Device
     */
    constructor()
    {
        this.native = {
            // device: Util.native('ToolboxDevice'),
            // battery: Util.native('BatteryManager'),
        };

        try {
            // this.native.cookies = Util.native('CookieManager');
        }
        catch (e) {

        }

        if (this.native.device && this.native.device.module) {
            this.native.device.module.info(info => {
                this.about = info;
            });
        }

        this.batteryMonitor = {
            initial: false,
            mostRecent: {},
        };

        this.network = new Network(this);
    }


    /*
    |--------------------------------------------------------------------------
    | Device Info
    |--------------------------------------------------------------------------
    */

    /**
     * @return Object
     */
    info()
    {
        if (!this.about) {
            return {};
        }

        return {
            vendorIdentifier       : this.about.uniqueId,
            operatingSystem        : this.about.systemName,
            operatingSystemVersion : this.about.systemVersion,
            model                  : this.about.model,
            locale                 : this.about.locale ? this.about.locale.toString().split('-')[0]: "en",
            platform               : Platform.OS,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Local Notification
    |--------------------------------------------------------------------------
    */

    notify(message)
    {

        if (!this.native.device || !this.native.device.module || !this.native.device.module.notify) {
            return;
        }

        if (Config.get('Toolbox.log.device.notification')) {
            Log.object('Device - Local Notification', {
                message: message,
            });
        }

        this.native.device.module.notify(message);
    }

    /*
    |--------------------------------------------------------------------------
    | Device Utils
    |--------------------------------------------------------------------------
    */

    pixelDensity()
    {
        return PixelRatio.get();
    }

    screenDimensons()
    {
        let { width, height } = Dimensions.get('window');

        return {
            width: width,
            height: height,
        };
    }

    selectType(devices)
    {
        return this.isPhone() ? devices.phone : devices.tablet;
    }

    screenAspectRatio()
    {
        let dimensions = this.screenDimensons();

        return dimensions.width / dimensions.height;
    }

    pixelDensity()
    {
        return PixelRatio.get();
    }

    pixelHeight()
    {
        return this.screenDimensons().height * this.pixelDensity();
    }

    pixelWidth()
    {
        return this.screenDimensons().width * this.pixelDensity();
    }

    isTablet()
    {
        let adjustedWidth = this.pixelWidth(),
            adjustedHeight = this.pixelHeight();

        if (this.pixelDensity() < 2) {
            return adjustedWidth >= 1000 || adjustedHeight >= 1000;
        }

        if (this.pixelDensity() == 2) {
            return adjustedWidth >= 1920 || adjustedHeight >= 1920;
        }

        return false;
    }

    isPhone()
    {
        return !this.isTablet();
    }

    /**
     * @return Boolean
     */
    isiPhoneX()
    {
        let dimensions = this.screenDimensons();

        return this.isApple()
            && !Platform.isPad
            && !Platform.isTVOS
            && (dimensions.height === 812 || dimensions.width === 812);
    }

    screenAspectRatio()
    {
        let dimensions = this.screenDimensons();

        return dimensions.width / dimensions.height;
    }

    stylesheet(styles)
    {
        const styleKeys = Object.keys(styles);
        const keptStyles = {};

        let device = this;
        styleKeys.forEach((key) => {
            const { ios, android, tablet, phone, ...style } = styles[key];

            keptStyles[key] = {
                ...style,
                ...device.selectPlatform({ ios, android }),
                ...device.selectType({ tablet, phone })
            };
        });

        return StyleSheet.create(keptStyles);
    }

    selectPlatform(devices)
    {
        return Platform.select(devices);
    }

    /**
     * @return String
     */
    platform()
    {
        return Platform.OS;
    }

    /**
     * @return Boolean
     */
    isAndroid()
    {
        return this.platform() === 'android';
    }

    /**
     * @return Boolean
     */
    isApple()
    {
        return this.platform() === 'ios';
    }

    /**
     * @return Device
     * @param comment
     * @param params
     */
    log(comment = '', params = {})
    {
        params.info = Util.copy(this.info());

        params.batteryMonitor = Util.copy(this.batteryMonitor);

        comment = 'Device - ' + comment;

        Log.object(comment, params);

        return this;
    }

    /*
    |--------------------------------------------------------------------------
    | Cookie Manager
    |--------------------------------------------------------------------------
    */

    setCookie(targetUrl, cookieString)
    {
        if (!this.native.cookies) {
            return;
        }

        return new Promise((resolve) => {
            this.native.cookies.module.set(targetUrl, cookieString, resolve)
        });
    }

    getCookies(targetUrl)
    {
        if (!this.native.cookies) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.native.cookies.module.get(targetUrl, (err, res) => {
                resolve(res)
            })
        })
    }

    clearAllCookies()
    {
        return new Promise((resolve, reject) => {
            // if (!this.native.cookies) {
            return NativeModules['Networking'].clearCookies(response => {
                resolve(response)
            });
            // }

            // this.native.cookies.module.clearAll((err, res) => {
            //     resolve(err)
            // })
        })
    }

    /*
    |--------------------------------------------------------------------------
    | Battery Monitoring
    |--------------------------------------------------------------------------
    */

    /**
     * @return Battery
     */
    getBattery()
    {
        let device = this;
        return new Promise((resolve, reject) => {
            if (AppState.currentState === 'active' && this.isApple()) {
                device.registerBatteryMonitory();
            }
            else {
                return resolve(device.batteryMonitor.mostRecent);
            }

            device.native.battery.module.getBatteryInfo(info => {
                if (!device.batteryMonitor.initial) {
                    device.batteryMonitor.initial = info;
                }
                device.batteryMonitor.mostRecent = info;
                if (Config.get('Toolbox.log.device.battery')) {
                    device.log('Battery Status');
                }

                resolve(info);

                this.unregisterBatteryMonitory();
            });
        });
    }

    /**
     * @return Device
     */
    startMonitoringBattery(onChange = null)
    {
        this.registerBatteryMonitory();

        if (this.batteryMonitorSubscription) {
            this.native.battery.events.removeSubscription(
                this.batteryMonitorSubscription
            );
            this.batteryMonitorSubscription = undefined;
        }

        let device = this;
        this.batteryMonitorSubscription = this.native.battery.events.addListener(
            'BatteryStatusChange', info => {
                if (!device.batteryMonitor.initial) {
                    device.batteryMonitor.initial = info;
                }
                device.batteryMonitor.mostRecent = info;
                if (Config.get('Toolbox.log.device.battery')) {
                    device.log('Battery Status Change');
                }

                if (onChange) {
                    onChange(info);
                }
            }
        );

        this.getBattery().then(battery => {
            if (onChange) {
                onChange(battery);
            }
        });
    }

    /**
     * @return Device
     */
    stopMonitoringBattery()
    {
        if ( !this.batteryMonitorSubscription ) {
            return;
        }

        this.unregisterBatteryMonitory();

        this.batteryMonitorSubscription.remove();

        return this;
    }

    /**
     * @return Device
     */
    registerBatteryMonitory()
    {
        if ( this.native.battery.module.registerBatteryStateReceiver ) {
            this.native.battery.module.registerBatteryStateReceiver();
        }

        return this;
    }

    /**
     * @return Device
     */
    unregisterBatteryMonitory()
    {
        if ( this.native.battery.module.unregisterBatteryStateReceiver ) {
            this.native.battery.module.unregisterBatteryStateReceiver();
        }

        return this;
    }

    static current()
    {
        if (!Device.Current) {
            Device.Current = new Device();
        }

        return Device.Current;
    }
}
