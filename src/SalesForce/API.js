
import { Request } from '../Helpers';
import Connection from "./Connection";
import Config from '../Config';

export default class API
{
    constructor(module) 
    {
        this.module = module;
    }

    query(soql)
    {
        return this.run(
            'query', 'query', {q: soql}
        );
    }

    insert(object, params)
    {
        return this.run(
            `sobjects/${object}`, 'insert', params
        );
    }

    update(object, id, params)
    {
        return this.run(
            `sobjects/${object}/${id}`, 'update', params
        );
    }

    delete(object, id)
    {
        return this.run(
            `sobjects/${object}/${id}`, 'delete'
        );
    }

    run(route, method, params = {})
    {
        return this.request(
          `/services/data/v${this.version()}/${route}`,
          params
        ).then(request => {
            let requestMethod = method;
            switch (method) {
                case 'query': requestMethod = 'get'; break;
                case 'insert': requestMethod = 'post'; break;
                case 'update': requestMethod = 'patch'; break;
            }

            return this.validate(
                request, requestMethod
            );
        });
    }

    validate(request, method, attempt = 0)
    {
        if (attempt > 1) {
            return new Promise((resolve,reject) => reject("Too many salesforce validation attempts"));
        }

        return new Promise((resolve,reject) => {
            return request[method]().then(response => {
                resolve(this.normalizeResponse(response));
                
            }).catch(response => {
                if (!response) {
                    return reject("No response from salesforce validation");
                }
                else if (response.error === Request.ErrorNoNetworkConnection) {
                    return reject(response);
                }

                let attempting = this.handleError(
                    response, async() => {
                        if (attempt === 0) {
                            if (this.module.auth.exists()) {
                                request.headers({
                                    Authorization: "Bearer " + await this.module.auth.token(),
                                });
                            }
                            
                            return this.validate(request, method, attempt + 1);
                        }
                    }
                );

                if (attempting === false) {
                    return reject(response);
                }
                else if (attempting !== undefined) {
                    attempting.then(response => {
                        resolve(this.normalizeResponse(response))
                    }).catch(response => {
                        this.parseError(response);
                        reject(response);
                    });
                }

                return attempting;
            })
        });
    }

    normalizeResponse(response)
    {
        if (!response) {
            return;
        }

        if (response.records) {
            return response.records;
        }

        return response;
    }

    handleError(response, reattempt)
    {
        if (this.sessionHasExpired(response)) {
            return this.module.auth.refresh().then(
                () => reattempt()
            );
        }

        this.parseError(response);

        return false;
    }

    parseError(response)
    {
        if (!response || !response[0] || this.sessionHasExpired(response)) {
            return;
        }

        // this.module.app().reportError(new Error(
        //     response.toString()
        // ));
    }

    sessionHasExpired(response)
    {
        return response 
            && Array.isArray(response) 
            && response[0] 
            && response[0].errorCode === 'INVALID_SESSION_ID';
    }

    request(route, params)
    {
        return new Promise(async(resolve,reject) => {
            let activeConnection = await Connection.active().catch(
                e => console.warn('Salesforce.API @ request(route, params)', e)
            );

            let authenticated = this.module.auth.exists();
            if (authenticated) {
                let token = await this.module.auth.token().catch(e => {});
                authenticated = token;
            }

            let domain = authenticated
                ? this.module.auth.url(route) : activeConnection.url(route);

            let request = await this.buildRequest(
                domain, params
            ).catch(e => console.warn('Salesforce.API @ request(route, params)', e))

            resolve(request);
        });
    }

    version()
    {
        return this.module.config().apiVersion;
    }

    appQueryParams()
    {
        let config = this.module.config();
        
        return {
            client_id: config.consumerKey,
            client_secret: config.secretKey,
            redirect_uri: config.redirectURI,
        };
    }

    async buildRequest(route, params = {})
    {
        let config = this.module.config();

        let defaultParams = this.appQueryParams();

        for (let param in defaultParams) {
            if (!params[param]) {
                params[param] = defaultParams[param];
            }
        }

        let authToken = `${config.clientId}:${config.clientSecret}`,
            headers = {
                Authorization: "Basic " + authToken,
                "Content-Type": "application/x-www-form-urlencoded",
            };

        if (this.module.auth.exists()) {
            authToken = await this.module.auth.token().catch(e => {});
            if (authToken) {
                headers = {
                    Authorization: "Bearer " + authToken,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                };
            }
        }
        // console.log(headers);


        return Request.make(route, params).headers(headers);
    }


}
