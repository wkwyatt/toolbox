// @flow

import React from "react"

import TBComponent from "../TBComponent"

import { Util } from "../Helpers"

export default class Screen extends TBComponent
{
    static alias = 'Toolbox.Screen';

    static showsNavbar = true;

    static getTitle()
    {
        if (!this.title) {
            return '';
        }

        if (Util.isFunction(this.title)) {
            return this.title();
        }

        return this.title;
    }

    static shouldShowNav()
    {
        if (Util.isFunction(this.showsNavbar)) {
            return this.showsNavbar();
        }

        return this.showsNavbar;
    }

    // route()
    // {
    //     return this.props.navigation.state.routeName;
    // }
}