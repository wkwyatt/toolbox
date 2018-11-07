// @flow

import React, {Component} from 'react'
import { View, Keyboard } from 'react-native'
import PropTypes from 'prop-types';
import {
    NavigationActions,
    createStackNavigator
} from "react-navigation"

import SFRoutes from '../SalesForce/Navigation';

// import Util from "./../Util"
import Screen from './Screen';
import Root from './../Root';
import Config from './../Config';
import TestRoute from "./TestRoute";

class Navigation extends Component
{
    static alias = 'Toolbox.Navigation';

    constructor(props)
    {
        super(props);

        this.state = {

        };

    }

    build = () => {
        // this.start = initialRouteName;

        let routes = this.generateRoutes();
        console.log('TBNAV @ build -> routes:', routes);

        const { initialRouteName } = this.props;

        let NavigationComponent = createStackNavigator(routes, {
            headerMode: 'float',
            initialRouteName: initialRouteName,
        });

        return (
            <NavigationComponent />
        );
    };

    generateRoutes() {

        let routes = this.props.routes;
        if (this.props.sfLogin) {
            routes = {...routes, Salesforce: [...SFRoutes]}
        }
        let generatedRoutes = {};
        console.log('TBNAV @ generateRoutes -> routes:', routes);
        for (let [parentKey, screens] of Object.entries(routes)) {

            for (let screenConfig of screens) {
                console.log('TBNAV @ generateRoutes -> parentKey:', parentKey);
                console.log('TBNAV @ generateRoutes -> screenConfig:', screenConfig);

                // 'App@ScreenClassName'
                let screen = Screen.make(this, screenConfig).options();
                console.log('TBNAV @ generateRoutes -> screen:', screen);
                screenConfig.component.constructor.Route = screenConfig.route;
                generatedRoutes[`${parentKey}@${screenConfig.route}`] = screen;
            }
        }

        console.log('TBNAV @ generateRoutes -> routes RETURN:', generatedRoutes);
        return generatedRoutes;
    }

    render()
    {
        // if ( the app is loading ) return the Splash screen
        /*
        if (false)
        {
            const SplashComponent = this.constructor.Splash
                ? this.constructor.Splash : Splash;

            return <SplashComponent/>;
        }
        */

        return (
            <View style={{flex: 1}}>
                {this.build()}
            </View>
        );
    }


}

Navigation.propTypes = {
    config: PropTypes.object
};

Navigation.defaultProps = {
    config: {
        App: {},
        Navigation: {}
    },
};

export default Navigation;