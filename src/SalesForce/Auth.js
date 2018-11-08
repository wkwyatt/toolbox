import * as Keychain from "react-native-keychain"

import { Util, Request, Event } from '../Helpers';
import Device from '../Modules/Device';


export default class Auth
{
    static module = undefined;

	constructor(module, session) 
	{
		this.module = module;

		if (session) {
			this.onLogin = session.onLogin,
				this.onLogout = session.onLogout;
		}
	}

	validate()
	{
		if (this.onLogin && this.onLogout) {
			return true;
		}

		throw new Error(
			'Salesforce Auth not configured, need handlers for onLogin and onLogout events'
		);
	}

    user(setUser)
    {
    	if (setUser) {
    		this.User = setUser.hasOwnProperty("data") ? setUser.data : setUser;
    	}


    	return this.User;
    }

    exists()
    {
        let user = this.user();
        return Util.isObject(user);
    }

    url(append = '')
    {
    	if (!this.exists()) {
    		return;
    	}
    	
        return this.user().instanceUrl + append;
    }

    token(forRefresh = false)
    {
        return new Promise((resolve,reject) => {
            return Keychain.getInternetCredentials(this.url())
                .then(credentials => {
                    if (credentials) {
                        this.accessToken = credentials.username,
                            this.refreshToken = credentials.password;

                        return resolve(forRefresh ? this.refreshToken : this.accessToken);
                    }

                    reject();
                })
                .catch(e => reject(e));
        });
    };

    organization = async() =>
    {
        if (!this.User) {
            return;
        }

        if (this.User.organization) {
            return this.User.organization;
        }
        
        let orgResult = await this.module.api().query(
            `SELECT Id, Name FROM Organization WHERE Id = '${this.User.orgId}'`
        ).catch(e => console.log(e));
        
        if (!orgResult || !orgResult[0] || !orgResult[0].Name) {
            console.warn("ORGANIZATION NOT AVAILABLE - CHECK USER PERMISSIONS");
            return {
                id: 0,
                name: ""
            };
        }

        return {
            id: orgResult[0].Id,
            name: orgResult[0].Name,
        };
    };

    loginPath()
    {
        console.warn('Auth @ loginPath -> module', this.module);
        return new Promise((resolve,reject) => {
            console.warn('Auth @ loginPath -> module', this.module);
            this.module.api().request('/services/oauth2/authorize', {
                scope: 'full refresh_token',
                response_type: 'code',
				prompt: 'login'
            }).then(request => {
                resolve(request.queryString());
            }).catch(e => console.warn('Salesforce.Auth @ loginPath()', e))
        });
    }

    login(domain, code)
    {
    	this.validate();

    	let user = {};
        let profileURL,
            instanceUrl,
            accessToken,
            refreshToken;

        return new Promise(async(resolve,reject) => {
            try {
    	        let response = await Request.make(
                    this.accessTokenRoute(domain, code)
                ).post();
    	        let SFCommunityURL = false;

                profileURL   = response.id,
                    instanceUrl  = response.instance_url,
                    accessToken  = response.access_token,
                    refreshToken = response.refresh_token;

                if(response && response.hasOwnProperty("sfdc_community_url")) {
                    SFCommunityURL = true;
                    instanceUrl = response.sfdc_community_url;
                }

                response = await Request.make(
                    profileURL, {access_token: accessToken}
                ).get();

                // Handle a custom domain instanceURL
                if(response && response.hasOwnProperty("urls")
                    && response.urls.hasOwnProperty("custom_domain")
                    && !SFCommunityURL){
                    instanceUrl = response.urls.custom_domain;
                }

            	user = {
                    id           : profileURL,
                    instanceUrl  : instanceUrl,
                    orgId        : response.organization_id,
                    userId       : response.user_id,
                    username     : response.username,
                    name         : response.display_name,
                    email        : response.email,
                    imagePath    : response.photos.picture,
                };

                this.user(user);

                await this.storeTokens(accessToken, refreshToken);

            	let handled = this.onLogin(user);
            	if (handled === true) {
    	            return resolve(user);
    	        }
    	        else if (handled === false) {
    	        	return reject(user);
    	        }

            	let formattedUser = await handled;

        		if (formattedUser) {
            		this.user(formattedUser);
            	}
        		resolve();
            }
            catch (error) {
                await this.logout();

                reject(error);
            }
        });
    }

    accessTokenRoute(domain, accessCode)
    {
        let config = this.module.config();

        if (!domain.endsWith('/')) {
            domain += '/';
        }

        return domain + 'services/oauth2/token?' +
            encodeURI('client_id=' + config.consumerKey +
                '&client_secret=' + config.secretKey +
                '&redirect_uri=' + config.redirectURI +
                '&grant_type=authorization_code&code=' + accessCode)
    }

    storeTokens(accessToken, refreshToken)
    {
	    this.accessToken = accessToken,
	    	this.refreshToken = refreshToken;

        return Keychain.setInternetCredentials(
            this.url(), accessToken, refreshToken
        );
    }

    refresh()
    {
    	return new Promise(async(resolve,reject) => {
    		let request;
    		try {
		    	let refreshToken = this.refreshToken || await this.token(true);

			    request = await this.module.api().request(
                   '/services/oauth2/token', {
			            grant_type: 'refresh_token',
			            refresh_token: refreshToken,
			        });

				let response = await request.post({
		    		encodeAs: 'QueryString',
		    	});

				// console.log(response);

		        if (!response['access_token']) {
		            throw Error;
		        }

		        let result = await this.storeTokens(
		            response['access_token'],
		            this.refreshToken
		        );

		        resolve(result);
		    }
		    catch (e) {
		    	
    			console.log(e);
		    	Event.fire(
		    		'OAuth@refreshTokenFailure'
		    	);
                if (request) {
                    request.error = e;
                    reject(request);
                }
		    	reject(e);
		    }
	    });
    };

    logout()
    {
    	this.validate();

    	return new Promise(async(resolve,reject)=>{
    		await Keychain.resetInternetCredentials(
	            this.url()
	        );

            await Device.current().clearAllCookies();

            let user = this.user();

            this.user(undefined);
            let handled = await this.onLogout(user).catch(error => reject(error));

            if (handled === false) {
                // console.log('handle returned false -> rejecting');
                return reject();
            }

            resolve();
        });
    }
}
