import React, {Component} from "react"
import {Text} from "react-native"

import Util from "./../Util"

export default class Config
{
    static shared;
    static config;

    static get(key)
    {
        console.log("Config File", this.config);
        return Util.get(
            this.config, key
        );
    }

    constructor(config) {
        this.config = config;
    }

    static boot(config)
    {
        // if (__DEV__) {
            // If ReactNative's yellow box warnings are too much, it is possible to turn
            // it off, but the healthier approach is to fix the warnings.  =)
            // console.disableYellowBox = true
        // }

        // Allow/disallow font-scaling in app
        Text.defaultProps.allowFontScaling = true;

        if (Config.shared) {
            return Config.shared;
        }

        Config.shared = new this(config);
        return Config.shared;
    }

}