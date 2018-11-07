import React, {Component} from "react"
import {Image, Text, View} from "react-native"

import { Theme } from '../Theme'
import styles from "./styles"


export default class Header extends Component 
{
    constructor(props) 
    {
        super(props);

        this.state = {
            ...props
        };
    }

    renderMiddle() 
    {
        if (this.props.title) {
            return <Text style={[styles.title, this.props.styles.title]} 
                numberOfLines={1}>{this.props.title}</Text>
        }

        return (
            <Image resizeMode='contain' 
                style={[styles.logo, this.props.styles.logo]} 
                source={this.props.logo || Theme.Current.image('logo')}/>
        );
    }

    renderRightButtons() 
    {
        return (
            <View style={[styles.rightButtons, this.props.styles.rightButton]}>
                {this.props.renderRightButton ? this.props.renderRightButton() : <View/>}
            </View>
        );
    }


    renderLeftButtons() 
    {
        return (
            <View style={[styles.leftButtons, this.props.styles.leftButton]}>
                {this.props.renderLeftButton ? this.props.renderLeftButton() : <View/>}
            </View>
        );
    }

    render() 
    {
        return (
            <View style={[styles.container, this.props.styles.header]}>
                {this.renderLeftButtons()}
                {this.renderMiddle()}
                {this.renderRightButtons()}
            </View>
        );
    }
}