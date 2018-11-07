// flow

import React from "react"
import { NetInfo } from "react-native"

import Config from "../Config"
import { Event, Log, Util } from "../Helpers"


export default class Network
{
    constructor(device)
    {
        this.device = device;

        this.reach = undefined;
        this.isConnected = true;

        this.onChange = undefined;

        NetInfo.fetch().done((reach) => {
            console.log('Network @ constructor -> reach', reach);
            if (reach.toLowerCase() === 'none') {
                this.handle("isConnected", false)
            }
            this.handle("reach", reach);
        });

        // NetInfo.reach is depricated: Below is refactored code
        //
        // NetInfo.getConnectionInfo().done(({ type }) => {
        //     if (type.toLowerCase() === 'none') {
        //         this.handle("isConnected", false)
        //     }
        //     this.handle("reach", reach);
        // });

        this.watch();
    }

    watch()
    {
        NetInfo.addEventListener('connectionChange', value => {
            this.handle('reach', value);
        });

        NetInfo.isConnected.addEventListener('connectionChange', value => {
            this.handle('isConnected', value);
        });
    }

    log()
    {
        if (!Config.get('Toolbox.log.device.network')) {
            return;
        }

        Log.object('Device - Network', {
            'reach': this.reach,
            'isConnected': this.isConnected,
        });
    }

    handle(prop, value)
    {
        let currentValue = this[prop];

        this[prop] = value;

        if (this.onChange) {
            this.onChange(this);
        }

        if(currentValue !== value)
        {
            Event.fire(
                'Network@ConnectionChange', {
                    'reach': this.reach,
                    'isConnected': this.isConnected,
                }
            );
            this.log();
        }
    }

    ignore()
    {
        NetInfo.removeEventListener('connectionChange');
        NetInfo.isConnected.removeEventListener('connectionChange');
    }
}
