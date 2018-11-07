import React, {Component} from "react"
import {TouchableOpacity, View} from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

import { Util } from '../Helpers'
import TBComponent from '../TBComponent'
import { Theme } from '../Theme'

import Header from "./Header"

const DefaultConfig = {

    parent: 'App',
    component: TBComponent,
    path: null,

    styles: {},

    logo: Theme.Current.image('logo'),

    leftButton: false,
    backButton: false,
    backScreen: null,
    hideChevron: false,

    rightButton: false,
    settingsButton: false,
    closeButton: false,
    settingsScreen: null
};


export default class Screen
{
    constructor(navigator, config)
    {
        this.navigator = navigator;

        this.config = {...DefaultConfig, ...config};

        this.config.styles = Theme.Current.stylesheet(
            this.config.styles
        );
    }

    header()
    {
        // if (!this.config.component.shouldShowNav() || this.config.hideHeader) {
        if (this.config.hideHeader) {
            return null;
        }

        return (
            <View navigation={this.navigation}>
                <Header title={this.config.component.getTitle()}
                        renderLeftButton={this.leftNavbarButton()}
                        renderRightButton={this.rightNavbarButton()}
                        styles={this.config.styles}
                        hideChevron={false}
                        logo={this.config.logo}/>
            </View>
        );
    }

    leftNavbarButton()
    {
        if (this.config.backButton) {
            let props = {
                navigation: this.navigation,
                onPress: () => {
                    this.navigator.back()
                },
            };

            if (this.config.backButtonOnPress) {
                props.onPress = () => {
                    this.config.backButtonOnPress();
                }
            }

            return () => this.backButton(props);
        }

        return this.barButton(
            this.config.leftButton
        );
    }


    rightNavbarButton()
    {
        if (this.config.settingsButton)
        {
            let props = {
                navigation: this.navigation,
                onPress: () => this.navigator.goTo(
                    this.config.settings || "App@Settings"
                )
            };

            if (this.config.settingsButtonOnPress) {
                props.onPress = this.config.settingsButtonOnPress;
            }

            return () => this.settingsButton(props);
        }
        else if (this.config.closeButton) {
            let props = {
                navigation: this.navigation,
                onPress: () => this.navigator.goTo(
                    this.navigator.back()
                )
            };

            if (this.config.settingsButtonOnPress) {
                props.onPress = this.config.settingsButtonOnPress;
            }

            return () => this.closeButton(props);
        }

        return this.barButton(
            this.config.rightButton
        );
    }

    barButton(config)
    {
        if (!config) {
            return;
        }

        if (Util.isFunction(config)) {
            return config;
        }

        if (Util.isObject(config)) {
            return (
                <IconButtonComponent
                    navigation={this.navigation}
                    {...config}/>
            );
        }
    }


    backButton(props)
    {
        return (
            <IconButtonComponent
                {...props}
                hideChevron={false}
                icon="chevron-left"
                iconColor={Theme.Current.color('white')}/>
        )
    }

    settingsButton(props)
    {
        return (
            <IconButtonComponent
                {...props}
                hideChevron={false}
                icon="settings"
                iconColor={Theme.Current.color('white')}/>
        )
    }

    closeButton(props)
    {
        return (
            <IconButtonComponent
                {...props}
                hideChevron={false}
                icon="close"
                iconColor={Theme.Current.color('white')}/>
        )
    }

    options()
    {
        let screen = this;
        return {
            screen: screen.config.component,
            middleware: screen.config.middleware,
            navigationOptions: ({navigation}) => {
                screen.navigation = navigation;
                return {
                    header: () => screen.header(),
                };
            }
        };
    }

    static make(navigator, config)
    {
        return new this(navigator, config);
    }
}


class IconButtonComponent extends Component
{
    render()
    {
        return (
            <TouchableOpacity style={{
                flex: 1,
                width: Theme.Current.metric('navBarHeight'),
                alignItems: 'center',
                justifyContent: 'center'
            }} onPress={() => {
                return this.props.onPress()
            }}>

                <Icon name={this.props.icon}
                      size={Theme.Current.metric('icons.md')}
                      color={this.props.iconColor || '#ffffff'}
                      hideChevron={false}/>

            </TouchableOpacity>
        )
    }
}
