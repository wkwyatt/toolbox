import React, {Component} from "react"
import {Text} from "react-native"

import { Util } from "../Helpers"
import DefaultConfig from '../DefaultConfig';

export default class Config
{
    static userConfig = undefined;
    static defaultConfig = DefaultConfig;

    static get(key)
    {
        const config = { ...this.defaultConfig, ...this.userConfig } || {};

        return Util.get(
            config, key
        );
    }

    static getDefault(key)
    {
        return Util.get(
            this.defaultConfig, key
        );
    }

    static boot()
    {
        if (__DEV__) {
            // If ReactNative's yellow box warnings are too much, it is possible to turn
            // it off, but the healthier approach is to fix the warnings.  =)
            console.disableYellowBox = true
        }

        // Allow/disallow font-scaling in app
        Text.defaultProps.allowFontScaling = true
    }
}