// @flow

import React, {Component} from "react"
import {StatusBar, View, Linking} from "react-native"
import {MenuProvider} from 'react-native-popup-menu'

import Navigation from './Navigation';
import Config from "./Config";
import DefaultConfig from "./DefaultConfig";

// import App from "../App"
// import Splash from "./Splash"
// import Loader from "./loader"

class Root extends Component
{
    static alias = 'Toolbox.Root';

    constructor(props)
    {
        super(props);

        this.state = {
            isLoading: false,
            loadingText: 'Loading',
            // isBooting: true
        };

        Config.boot(this.props.config || DefaultConfig);
    }

    componentDidMount()
    {
        this._isMounted = true;
        // setTimeout(() => {
        //     App.Scoped.boot().then(app => {
        //         app.setLoading = this.setLoading.bind(this);
        //
        //         return this.middleware(app);
        //     });
        // }, 1000);
    }

    componentWillUnmount()
    {
        // Linking.removeEventListener("url", TB.app().handleUrl);
        this._isMounted = false;
    }

    middleware = () =>
    {
        // let routes = await app.scaffold();

        // let routes = rootConfig.routes;
        // let initialRouteName = rootConfig.initialRouteName;
        //
        // this.setState({
        //     // isBooting: false,
        //     Navigation: routes,
        // }, () => {
        //     // Linking.addEventListener("url", app.handleUrl);
        //     Linking.getInitialURL().then(url => {
        //         if (url) {
        //             Linking.openURL(url);
        //         }
        //     });
        // });
    };


    setLoading(isLoading, loadingText = 'Loading')
    {

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
                <StatusBar backgroundColor="#000"
                    barStyle='light-content'/>

                        {/*<Loader textContent={this.state.loadingText}*/}
                    {/*isVisible={this.state.isLoading}/>*/}

                <MenuProvider>
                    <Navigation routes={this.props.routes} initialRouteName={this.props.initialRouteName}/>
                </MenuProvider>
            </View>
        );
    }


}

export default Root;