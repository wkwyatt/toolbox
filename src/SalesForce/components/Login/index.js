import React from "react"
import {ActivityIndicator, Linking, Text, TouchableOpacity, View, WebView} from "react-native"

import Connection from '../../Connection';
import Screen from '../../../Screen';
import Device from '../../../Modules/Device';
import DB from '../../../DB';
import { Path } from '../../../Helpers';
import { Theme } from '../../../Theme';

import styles from "./styles";
import KeyboardSpacer from "../../../Components/KeyboardSpacer";
import Salesforce from "../../SalesForce";


/**
 * [Notes]
 *
 * @class Login
 */
export default class Login extends Screen
{
    /**
     * [Notes]
     *
     * @property {object}
     */
    static events = {
        'Salesforce@TestAccountSelected': async(component, testAccount) => {
            await Connection.activateWithNickname(
                testAccount.connection
            );

            await component.loadSalesforceLoginForm();

            let runJavascript = `
                LoginHint.useNewIdentity();
                LoginHint.clearExistingIdentity();
                document.getElementById("username").value = "${testAccount.username}";
                document.getElementById("password").value = "${testAccount.password}";
                document.getElementById("rememberUn").checked = true;
                setTimeout(function(){
                    document.getElementById("Login").click();
                }, 1000);
            `;

            component.setState({
                injectedJavaScript: `${runJavascript}`,
            });
        },
        'Salesforce@ActiveConnectionSelected': (component, activeConnection) => {
            console.log('Salesforce@ActiveConnectionSelected');
            component.loadSalesforceLoginForm();
        },
        'Network@Change':(component, network) => {

            // component.setState({
            //     networkIsConnected: network.isConnected,
            // });

            component.loadSalesforceLoginForm();
        },
    };

    /**
     * [Constructor]
     *
     * @param Object props
     * @return Login
     */
    constructor(props)
    {
        super(props);

        this.checkOAuthErrorScripts = `
            (function(){
                "use strict";

                if (!RNToolboxOAuth) {
                    var RNToolboxOAuth = {

                    };
                }

                RNToolboxOAuth.didFail = function() 
                {
                    return document.body.innerText.includes(
                        "OAuth Error"
                    );
                };

                RNToolboxOAuth.checkDidFail = function() 
                {
                    if (RNToolboxOAuth.failureCheckTimeout) {
                        clearTimeout(RNToolboxOAuth.failureCheckTimeout);
                        RNToolboxOAuth.failureCheckTimeout = undefined;
                    }

                    RNToolboxOAuth.failureCheckTimeout = setTimeout(function(){
                        if (RNToolboxOAuth.didFail()) {
                            window.open("rn-toolbox-oauth://error");
                        }
                        else {
                            RNToolboxOAuth.checkDidFail();
                        }
                    }, 1000);
                };

                RNToolboxOAuth.checkDidFail();

            })();
        `;

        this.state = {
            loading: true,
            loginRoute: '',
            injectedJavaScript: '',
            loadErrorMessage: false,
            currentDomain: '',
            networkIsConnected: Device.current().network.isConnected,
        };

        this.setupSFEnv();
        //  TODO: Create new Auth
        //  TODO: Create SF object to login

    }

    async setupSFEnv() {
        this.salesforce = Salesforce.boot(this, {
            onLogin: (userDetails) => {
                return new Promise(async(resolve,reject) => {
                    // await Event.truncate();

                    let user = await User.login(userDetails);

                    // TB.nav().resetToScene('App@Mobile');
                    console.log('App@Mobile');
                    console.log('User @ onLogin');

                    resolve(user);
                });
            },
            onLogout: async(user) => {
                // await App.shared.storeDefaultLinkingPreference().catch(console.error);
                //
                // await User.handleLogout().catch(console.error);
            },
        });

        await DB.boot(null, {
            models: [Connection]
        });
    }

    componentDidMount()
    {
        super.componentDidMount();

        console.log('Login @ componentDidMount');

        this.isUsingSSO = false;

        try {
            this.loadSalesforceLoginForm();
        }
        catch (e) {
            console.warn('this.loadSalesforceLoginForm()', e);
        }
    }

    async loadSalesforceLoginForm(loginRoute)
    {
        try {
            await this.promiseState({
                loading: true,
                networkIsConnected: Device.current().network.isConnected,
            });
            await this.clearError();

            await Connection.checkIfLoaded();

            if (!loginRoute) {
                loginRoute = await this.defaultLoginPath(Salesforce);
            }
            if (!loginRoute) {
                return;
            }

            this.activeConnection = await Connection.active();
            // console.log('Login @ activeConnection', this.activeConnection);

            await this.promiseState({
                loading: false,
                loginRoute: loginRoute,
                injectedJavaScript: '',
            });

            if (this.refs.webView) {
                this.refs.webView.reload();
            }
        }
        catch (e) {
            console.warn('Salesforce.Login @ loadSalesforceLoginForm', e);
        }
    }

    async defaultLoginPath(sf)
    {
        console.log('Login @ defaultLoginPath -> sf', sf);
        console.log('Login @ defaultLoginPath -> Salesforce', this.salesforce);
        console.log('Login @ defaultLoginPath -> Salesforce', this.salesforce.auth);
        let url = await this.salesforce.auth.loginPath();
        // let url = await sf.auth.loginPath();
        if (!this._isMounted) {
            return false;
        }

        let loginRoute = Path.parse(url);

        this.currentDomain = this.parseUrlForSalesforceDomain(loginRoute);

        return loginRoute.toString();
    }

    clearError()
    {
        this.loadErrorMessage = false;
        return this.promiseState({loadErrorMessage: false});
    }

    renderNoNetworkError()
    {
        return this.renderError(
            "No Network Connection.\nPlease check your settings or try again later.",
            false
        );
    }

    renderError(message, showRetryButton)
    {
        if (!message) {
            message = "An Unexpected Error Occurred.\nPlease try again.";
        }

        return (
            <View style={styles.loadingContainer}>
                <Text style={{textAlign: 'center', padding: 20}}
                      color={Theme.Current.color('primary')}>
                    {message}
                </Text>

                {showRetryButton &&
                <TouchableOpacity style={{
                    paddingVertical: 10,
                    paddingHorizontal: 40,
                    margin: 20,
                    backgroundColor: Theme.Current.color('primary'),
                    borderRadius: 5
                }} onPress={()=>{
                    this.loadSalesforceLoginForm();
                }}>

                    <Text style={{color: 'white'}}>
                        RETRY
                    </Text>

                </TouchableOpacity>
                }

            </View>
        );
    }

    /**
     * [Notes]
     *
     * @return Component
     */
    render()
    {
        // console.log(this.state);
        let loginView = <View style={styles.loadingContainer}>
            <ActivityIndicator
                animating={true}
                style={styles.loadingIndicator}
                size="large"
                color={Theme.Current.color('primary')}/>
        </View>

        console.warn('Login @ render -> loading, loginRoute', this.state.loading, this.state.loginRoute)
        if (!this.state.networkIsConnected) {
            loginView = this.renderNoNetworkError();
        }

        else if (this.state.loadErrorMessage) {
            loginView = this.renderError(
                this.state.loadErrorMessage,
                true
            );
        }

        else if (!this.state.loading && this.state.loginRoute)
        {

            loginView = <WebView ref="webView"
                                 style={styles.webview}
                                 bounces={false}
                                 source={{uri: this.state.loginRoute}}
                                 thirdPartyCookiesEnabled={true}
                                 injectedJavaScript={this.state.injectedJavaScript}
                                 domStorageEnabled={true}
                                 onError={event => {
                                     let specificMessage = '';
                                     if (event.description && event.code) {
                                         specificMessage = `  ${event.description} (${event.code})`;
                                     }
                                     else if (event.nativeEvent.description && event.nativeEvent.code) {
                                         specificMessage = `  ${event.nativeEvent.description} (${event.nativeEvent.code})`;
                                     }
                                     this.loadErrorMessage = 'An unexpected error occurred.'
                                         + specificMessage
                                         + '  Please try again.';
                                     this.setState({loadErrorMessage: this.loadErrorMessage}, () => {
                                         // TB.app().errorHandler.report(new Error('Salesforce Login Form WebView Error'), {
                                         //     navigation: {
                                         //         url: event.url,
                                         //         loginRoute: this.state.loginRoute,
                                         //         loadErrorMessage: this.loadErrorMessage,
                                         //         currentDomain: this.currentDomain,
                                         //     }
                                         // });
                                     });
                                     // console.log({
                                     //     navigation: {
                                     //         url: event.url,
                                     //         loginRoute: this.state.loginRoute,
                                     //         loadErrorMessage: this.loadErrorMessage,
                                     //         currentDomain: this.currentDomain,
                                     //     }
                                     // });
                                     // console.log(this.state)
                                 }}
                                 onLoad={() => {
                                     this.clearError();
                                 }}
                                 renderError={() => {
                                     return this.renderError(
                                         this.loadErrorMessage, true
                                     );
                                 }}
                                 javaScriptEnabled={true}
                                 decelerationRate="normal"
                                 onNavigationStateChange={event => {
                                     let urlPath = Path.parse(event.url).path;

                                     if (urlPath.startsWith('/saml/authn-request.jsp') || urlPath.startsWith('/services/auth/sso') || urlPath.startsWith('/services/auth/')) {
                                         this.isUsingSSO = true;
                                         return;
                                     }

                                     if (!Device.current().isApple()) {
                                         this.loginSalesforceUser(event.url);
                                     }
                                 }}
                                 onLoadEnd={event => {
                                     this.checkForUpdatedDomain(event.nativeEvent.url);
                                 }}
                                 onShouldStartLoadWithRequest={event => {
                                     return !this.loginSalesforceUser(event.url);
                                 }}/>;
        }

        return (
            <View style={styles.container}>
                {loginView}
                {Device.current().isAndroid() && <KeyboardSpacer/>}
            </View>
        );
    }

    checkForUpdatedDomain(url)
    {
        if (this.isUsingSSO) {
            return false;
        }

        let path = Path.parse(url);
        this.previousUrl = this.currentUrl;
        this.currentUrl = url;

        if (path.contains("secur/contentDoor")
            || path.contains(Config.get("Salesforce.redirectURI"))
            || path.path.startsWith('/_ui/identity'))
        {
            return false;
        }

        let updated = this.parseUrlForSalesforceDomain(path);
        if (updated && updated !== this.currentDomain) {
            this.currentDomain = updated;
            return this.reloadForDomain(this.currentDomain);
        }

        return true;
    }


    reloadForDomain(rootDomain, sf)
    {
        if (Path.parse(rootDomain).host.endsWith('.salesforce.com')
            && !this.activeConnection.isCustom)
        {
            return false;
        }

        let component = this;

        setTimeout(() => {
            rootDomain = rootDomain+'/services/oauth2/authorize';
            while (rootDomain.includes('//')) {
                rootDomain = rootDomain.replace('//', '/');
            }

            // console.log('reloading', rootDomain);
            let params = this.salesforce.api().appQueryParams();
            params.scope = 'full refresh_token';
            params.response_type = 'code';
            params.prompt = 'login';

            let newLoginPath = Request.make(
                rootDomain,
                params
            ).queryString();

            component.loadSalesforceLoginForm(
                newLoginPath
            );
        });

        return true;
    }


    parseUrlForSalesforceDomain(url)
    {
        let path = url.path;
        let filteredPathStrings = ["login", "services", "secur", "setup", "_ui"];

        for (let pathString of filteredPathStrings) {
            if (url.path.includes(pathString)) {
                path = url.path.substr(0, url.path.indexOf(pathString));
            }
        }

        console.log(" <<<<<   LOGIN URLS BEFORE: ", url)
        console.log(" >>>>>   LOGIN URLS AFTER: ", url.hostName() + path);

        return url.hostName() + path;
    }

    /**
     * [Notes]
     *
     * @param Object navState
     * @return void
     */
    loginSalesforceUser(redirectUrl, sf)
    {
        // console.log('navigating to ', redirectUrl);

        if (redirectUrl.includes('/company/privacy')) {
            if (!this.didOpenPrivacy) {
                this.didOpenPrivacy = true;
                this.loadSalesforceLoginForm();
                Linking.openURL(redirectUrl).catch(e => console.log(e));
            }
            return false;
        }
        else if (redirectUrl !== 'about:blank') {
            this.didOpenPrivacy = false;
        }


        if (redirectUrl === 'rn-toolbox-oauth://error') {
            this.setState({
                loadErrorMessage: "Salesforce OAuth Error",
            });
            return false;
        }

        let url = Path.parse(redirectUrl),
            accessCode = url.param('code');

        if (url.param('ec') === '302') {
            setTimeout(() => {
                this.currentDomain = this.parseUrlForSalesforceDomain(url);
                this.reloadForDomain(
                    this.currentDomain
                );
            });

            return false;
        }

        if (!redirectUrl.includes(this.currentDomain)
            && url.host.endsWith('.force.com')
            && this.checkForUpdatedDomain(redirectUrl)) {
            return false;
        }

        // console.log('accessCode', accessCode);

        // console.log(accessCode);
        if (!accessCode) {
            return false;
        }

        this.setState({
            injectedJavaScript: '',
            loading: true,
        }, async() => {
            console.log('Login @ loginSalesforceUser -> SF', Salesforce);
            console.log('Login @ loginSalesforceUser -> SF.auth', Salesforce.auth);
            this.salesforce.auth.login(
                this.currentDomain,
                accessCode
            ).catch(error => {
                if (!this._isMounted) {
                    return;
                }

                // TB.app().setLoading(false);
                this.setState({
                    loading: false,
                    loadErrorMessage: error.message,
                });
            });
        });
    }

}
