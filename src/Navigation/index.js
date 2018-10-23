// @flow

import React, {Component} from 'react'
import { View, Keyboard } from 'react-native'
import PropTypes from 'prop-types';
import {
    NavigationActions,
    createStackNavigator
} from "react-navigation"


// import Util from "./../Util"
// import Screen from './Screen'
import Root from './../Root'
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

        this.config = new Config();
        console.log("NAV INIT -> ", this.config);
        console.log("NAV INIT -> ", this.config.shared);
    }

    build = () => {
        // this.start = initialRouteName;

        // this.routes = this.generateRoutes();
        const { routes, initialRouteName } = this.props;

        let NavigationComponent = createStackNavigator(routes, {
            headerMode: 'float',
            initialRouteName: initialRouteName,
        });

        return (
            <NavigationComponent />
        );
    };

    generateRoutes() {
        let { config } = this.props;
        let routes = {};
        for (let [parentKey, screens] of Object.entries(config.Navigation.routes)) {

            for (let screenConfig of screens) {
                // 'App@ScreenClassName'
                let screen = Screen.make(this, screenConfig).options();
                screenConfig.component.constructor.Route = screenConfig.route;
                routes[`${parentKey}@${screenConfig.route}`] = screen;
            }
        }

        return routes;
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
        console.log("NAV COMP CONFIG -> ", Config);
        console.log("NAV COMP CONFIG -> ", Config.shared);

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