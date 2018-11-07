import React from "react";
import {TouchableOpacity, View, PixelRatio} from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';

import { Theme } from '../../Theme';

import Login from "../components/Login";
// import ActiveConnection from "@salesforce/containers/active";
// import CustomConnection from "@salesforce/containers/custom";

const styles = {
    header: {
        backgroundColor: Theme.Current.color('greenSherpa'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: '200',
        tablet: {
            fontSize: 22
        },
        phone: {
            fontSize: 18,
        },
        marginTop: 0,
        color: Theme.Current.color('white'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    navButton: {
        flex: 1,
        marginTop: -5, marginRight: -5,
        width: Theme.Current.metric('navBarHeight'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    menu: {
        marginTop: 5
    },
    optionWrapper: {
        flex: 1,
        justifyContent: 'center',
        height: 50,
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: Theme.Current.color('separator')
    },
    optionText: {
        color: '#000000',
        fontSize: 14,
        paddingLeft: 10
    }
};

export default [
    {
        component: Login,
        route: 'Login',
        styles: styles,
        backButton: true
        // rightButton: (props) => <OAuthSettingsButton {...props}/>,
        // leftButton: (props) => <TestAccountLoginButton {...props}/>
    },
    // {
    //     component: ActiveConnection,
    //     route: 'Connections',
    //     styles: styles,
    //     backButton: true
    // },
    // {
    //     component: CustomConnection,
    //     route: 'Connections.Custom',
    //     styles: styles,
    //     backButton: true
    // }
];

//
// class OAuthSettingsButton extends TB.Component
// {
//     static alias = 'Salesforce.Navigation.OAuthSettingsButton';
//
//     constructor(props) {
//         super(props);
//         this.state = { opened: false };
//     }
//
//     toggleMenu(show, callback = () => true) {
//         this.setState({ opened: show }, callback);
//     }
//
//     navigateOption(route)
//     {
//         this.toggleMenu(false, () => {
//             TB.nav().goTo(route)
//         });
//     }
//
//     clearCookies()
//     {
//         TB.device().clearAllCookies().then(response => {
//             console.log(response)
//             this.reloadWebView();
//         }).catch(err => console.log(err));
//     }
//
//     reloadWebView()
//     {
//         this.toggleMenu(false, () => {
//             TB.event('Salesforce@ActiveConnectionSelected')
//         })
//     }
//
//     render()
//     {
//
//         return (<Menu
//                 style={styles.menu}
//                 opened={this.state.opened}
//                 onBackdropPress={() => this.toggleMenu(false)}>
//                 <MenuTrigger customStyles={
//                     {
//                         TriggerTouchableComponent: () => (
//                             <TouchableOpacity style={styles.navButton}
//                                               onPress={() => this.toggleMenu(true)}>
//                                 <Icon name='more-vert'
//                                       size={TB.metric('icons.md')}
//                                       color={TB.color('white')}
//                                 />
//                             </TouchableOpacity>
//                         )
//                     }
//                 } />
//                 <MenuOptions customStyles={{optionText: styles.optionText, optionWrapper: styles.optionWrapper}}>
//                     <MenuOption
//                         onSelect={this.navigateOption.bind(this, 'Salesforce@Connections')}
//                         text="Active Connections" />
//                     <MenuOption
//                         onSelect={this.navigateOption.bind(this, 'Salesforce@Connections.Custom')}
//                         text="Add Connection" />
//                     <MenuOption
//                         onSelect={this.reloadWebView.bind(this)}
//                         text="Reload" />
//                     <MenuOption
//                         onSelect={this.clearCookies.bind(this)}
//                         text="Clear Cookies" />
//
//                 </MenuOptions>
//             </Menu>
//
//
//
//         );
//     }
// }
//
// class TestAccountLoginButton extends TB.Component
// {
//     static alias = 'Salesforce.Navigation.TestAccountLoginButton';
//
//     render()
//     {
//         const TBAlert = TB.Alert;
//
//         if (!TB.app().environment.developerModeEnabled()) {
//             return <View/>;
//         }
//
//         let testAccounts = TB.config('Salesforce.testAccounts');
//
//         let accountUsernames = [];
//         for (let i in testAccounts) {
//             accountUsernames.push({
//                 label: testAccounts[i].username,
//                 value: i,
//             });
//         }
//
//         return (
//             <TouchableOpacity style={styles.navButton} onPress={()=> {
//                 if (this.refs.testAccountsAlert) {
//                     this.refs.testAccountsAlert.show();
//                 }
//             }}>
//                 <Icon name='account-circle'
//                       size={TB.metric('icons.md')}
//                       color={TB.color('white')}
//                 />
//
//                 <TBAlert ref='testAccountsAlert'
//                          title='Select Test Account'
//                          selections={accountUsernames}
//                          onSelectItem={accountIndex=>{
//                              TB.event(
//                                  'Salesforce@TestAccountSelected',
//                                  testAccounts[accountIndex]
//                              );
//                          }}
//                 />
//             </TouchableOpacity>
//         );
//     }
// }
//
