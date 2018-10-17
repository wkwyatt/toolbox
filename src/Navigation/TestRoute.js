import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class TestRoute extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{textAlign: 'center'}}>Please setup your Toolbox Config.</Text>
            </View>
        );
    }
}
