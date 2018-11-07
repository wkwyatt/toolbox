import React from "react"
import {
    StyleSheet
} from "react-native"

import Config from "../Config"
import { Util } from "../Helpers"
import Device from "../Modules/Device"

import Color from "./Color"
import Font from "./Font"
import Metric from "./Metric"

class Theme
{
	constructor(name, config) 
	{
		this.name = name,
			this.config = config;

	  	this.Colors = new Color();
	  	if (config.colors) {
			Util.forEach(config.colors, (value, name) => {
				this.Colors[name] = value;
			});
		}

        this.Metrics = Util.overwrite(
            Metric,
            config.metrics
        );

        this.Fonts = Font;
        if (config.fonts) {
            Util.forEach(config.fonts, (value, name) => {
                this.Fonts[name] = value;
            });
        }

        this.Images = config.images ? config.images : {};

		this.Resources = config.resources ? config.resources : {};
    }

    stylesheet(styles)
    {
        const styleKeys = Object.keys(styles);
        const keptStyles = {};

        let device = Device.current();
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

    color(keyPath)
    {
        let colors = this.Colors;
        if (!colors.has(keyPath)) {
            throw new Error(
                `Color with key path '${keyPath}' not found in app/config/Theme`
            );
        }

        return colors[keyPath];
    }

    font(keyPath)
    {
        let fonts = this.Fonts;
        if (!fonts.has(keyPath)) {
            throw new Error(
                `Font with key path '${keyPath}' not found in app/config/Theme`
            );
        }

        return fonts[keyPath];
    }

    fonts()
    {
        return this.config.fonts || {}
    }

    metric(keyPath)
    {
        let metric = Util.get(
            this.Metrics, keyPath
        );

        if (metric === undefined) {
            throw new Error(
                `Metric with key path '${keyPath}' not found in app/config/Theme`
            );
        }

        return metric;
    }

    resource(keyPath)
    {
        let resource = Util.get(
            this.Resources, keyPath
        );

        if (!resource) {
            try {
                resource = require('@resources/'+keyPath+'.png');
            }
            catch (e) {
                console.log(e);
            }
        }

        if (!resource) {
            throw new Error(
                `Resource with key path '${keyPath}' not found in app/config/Theme`
            );
        }

        return resource;
    }

    image(keyPath)
    {
        let image = Util.get(
            this.Images, keyPath
        );

        if (!image) {
        	try {
        		image = require('@resources/images/'+keyPath+'.png');
        	}
        	catch (e) {
                console.log(e);
        	}
        }

        if (!image) {
            throw new Error(
                `Image with key path '${keyPath}' not found in app/config/Theme`
            );
        }

        return image;
    }

	static settings()
	{
		return Config.get('Theme');
	}

	static boot()
	{
		let settings = this.settings();

		if (!settings || !Util.isObject(settings)) {
			settings = {
                default: {}
            };
		}

		Util.forEach(settings, (config, name) => {
			this[name] = new this(name, config);
		});

		if (!this.default) {
			throw new Error(
				'default theme not configured, app/config/Theme.default {colors: {}, metrics: {}}'
			);
		}

		if (!this.Current) {
			this.Current = this.default;
		}

		return this;
	}
}

if (!Theme.Current) {
    Theme.boot();
}

export default Theme;