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
import Config from './../Config'
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

    build = (initialRouteName) => {
        // this.start = initialRouteName;

        // this.routes = this.generateRoutes();
        let { config } = this.props;
        let routes = config && (config.routes || {Home: TestRoute});
        let initialRoute = config.initialRouteName || 'Home';

        let NavigationComponent = createStackNavigator(routes, {
            headerMode: 'float',
            initialRouteName: initialRoute,
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