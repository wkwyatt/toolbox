import Axios from "axios"
import QueryString from "qs"

import Config from "../Config"
import Log from "./Log"
import Util from "./Util"

import Device from "../Modules/Device"

export default class Request 
{
    static Timeout = 10;

    static ErrorNoNet = 1;
    static ErrorTooLong = 2;
    static ErrorResponse = 3;
    static ErrorLocal = 4;

    /**
     * [Constructor]
     *
     * @param {String} url
     * @param {Object|Array}? params
     * @returns {Request}
     */
    constructor(url, params)
    {
        this.url = url;
        this.params = params;
        this.httpHeaders = {};

        this.errorType,
            this.didFinish = false,
            this.wasCancelled = false;
    }

    /**
     * [Note]
     *
     * @param {Object} options
     * @returns {Request}
     */
    headers(headers)
    {
        for (let key in headers) {
            this.httpHeaders[key] = headers[key];
        }

        return this;
    }

    /**
     * [Note]
     *
     * @param {Object} options
     * @returns {Promise}
     */
    get(options)
    {
        return this.run('GET', options);
    }

    /**
     * [Note]
     *
     * @param {Object} options
     * @returns {Promise}
     */
    post(options)
    {
        return this.run('POST', options);
    }

    /**
     * [Note]
     *
     * @param {Object} options
     * @returns {Promise}
     */
    patch(options)
    {
        return this.run('PATCH', options);
    }

    /**
     * [Note]
     *
     * @param {Object} options
     * @returns {Promise}
     */
    delete(options)
    {
        return this.run('DELETE', options);
    }

    /**
     * [Note]
     *
     * @returns {Bool}
     */
    isRunning()
    {
        // console.log('isRunning', this.method !== undefined, 'didFinish', this.didFinish, 'wasCancelled', this.wasCancelled);
        return this.method !== undefined 
            && !this.didFinish 
            && !this.wasCancelled;
    }

    /**
     * [Note]
     *
     * @returns {Bool}
     */
    canRun()
    {
        return Device.current().network.isConnected;
    }

    configure(options = {})
    {
        let cancelToken = Axios.CancelToken;
        this.cancelTokenSource = cancelToken.source();

        let params = this.params ? this.params : {};

        let config = {
            url: this.url, 
            method: this.method,
            headers: this.httpHeaders,
            timeout: Request.Timeout * 1000,
            cancelToken: this.cancelTokenSource.token,
        };

        for (let key in options) {
            config[key] = options[key];
        }

        if (this.method == 'GET' && !config.encodeAs) {
            config.encodeAs = 'QueryString';
        }
        else if (this.method != 'GET' && !config.encodeAs) {
            config.encodeAs = 'JSON';
        }

        if (config.encodeAs == 'QueryString') {
            config.params = Object.assign(params);
            config.data = null;
        }
        else if (config.encodeAs == 'JSON') {
            config.data = Object.assign(params);
        }


        return config;
    }

    /**
     * [Note]
     *
     * @param {Object} options
     * @returns {Promise}
     */
    build(method, options = {})
    {
        this.method = method;

        if (!this.canRun()) {
            this.didFail = true;
            this.errorType = Request.ErrorNoNet;
            this.log();
            return new Promise((resolve,reject) => reject());
        }

        this.instance = Axios.create();

        this.interceptRequest().interceptResponse();

        return this.instance.request(
            this.configure(options)
        );
    }

    static async grouped(...requests)
    {
        return new Promise((resolve,reject) => {
            Axios.all(requests).then(
                Axios.spread((...responses) => {
                    resolve(responses);
                })
            ).catch(error => reject(error));
        });
    }

    interceptRequest()
    {
        this.instance.interceptors.request.use(config => {
            this.log();

            // Do something before request is sent
            return config;
        }, error => {
            // console.log(error);
            this.log();
            // Do something with request error
            return Promise.reject(error);
        });

        return this;
    }

    interceptResponse()
    {
        this.instance.interceptors.response.use(response => {
            this.response = response;
            // parentRequest.exit = undefined;
            this.didFinish = true;

            this.log();

            return response.data;
        }, error => {
            // console.log(error);

            if (Axios.isCancel(error)) {
                this.wasCancelled = true;
                // request.error = error;
            }
            else if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                this.error = error;
                this.response = error.response;
                this.errorType = Request.ErrorResponse;
            } 
            else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                this.error = error;
                this.errorType = Request.ErrorTooLong;
            } 
            else {
                // Something happened in setting up the request that triggered an Error
                this.error = error;
                this.errorType = Request.ErrorLocal;
            }

            this.didFail = true;
            // parentRequest.exit = undefined;
            this.didFinish = !this.wasCancelled;

            this.log();
            // this.reportServerError();

            
            return Promise.reject(error);
        });

        return this;
    }

    // reportServerError()
    // {
    //     if (this.errorType !== Request.ErrorResponse) {
    //         return;
    //     }
    //
    //     let errorMessage = "No error message provided.";
    //
    //     TB.catchException(() => {
    //         let data = (this.response && this.response.data) ? this.response.data : {};
    //
    //         while(Array.isArray(data)){
    //             data = data[0];
    //         }
    //
    //         errorMessage = data.message || data.errorMessage || data.error || errorMessage;
    //
    //         if (TB.isObject(errorMessage)) {
    //             if (errorMessage.errorMessage) {
    //                 errorMessage = errorMessage.errorMessage;
    //             }
    //
    //             if (errorMessage.message) {
    //                 errorMessage = errorMessage.message;
    //             }
    //         }
    //
    //         if (TB.isObject(errorMessage)) {
    //             errorMessage = JSON.stringify(errorMessage);
    //         }
    //     });
    //
    //     this.report(errorMessage);
    // }

    // report(message)
    // {
    //     TB.app().errorHandler.report(new Error(message), {
    //         http_request: {
    //             url: this.url,
    //             headers: this.httpHeaders,
    //             method: this.method,
    //             params: this.params,
    //         },
    //         http_response: {
    //             statusCode: this.response ? this.response.status : "Unknown",
    //             data: this.response ? this.response.data : null,
    //         },
    //     });
    // }

    queryString()
    {
        let params = Util.isObject(this.params) ? this.params : {};

        return this.url + '?' + QueryString.stringify(
            {...params}
        );
    }

    /**
     * [Note]
     *
     * @param {String} method
     * @param {Object} options
     * @returns {Promise}
     */
    run(method, options)
    {
        this.wasCancelled = false;
        this.didFinish = false;

        return this.build(
            method, options
        );
    }

    /**
     * [Note]
     *
     * @returns {Request}
     */
    cancel()
    {
        if (!this.cancelTokenSource) {
            return this;
        }

        this.wasCancelled = true;
        this.didFinish = false;
        this.cancelTokenSource.cancel('Operation canceled by the user.');
        this.cancelTokenSource = undefined;

        return this;
    }

    /**
     * [Note]
     *
     * @returns {Request}
     */
    log()
    {
        let config = Config.get('Toolbox.log.http');

        if (!config) {
            return;
        }

        if (!this.didFinish && config.requests) {
            Log.object('Request', {
                url: this.url,
                headers: this.httpHeaders,
                method: this.method,
                params: this.params,
            });
        }

        if (this.didFinish && config.responses) {
            Log.object('Response', {
                request: {
                    url: this.url,
                    headers: this.httpHeaders,
                    params: this.params,
                    method: this.method,
                },
                status: this.response ? this.response.status : undefined,
                error: this.error,
                data: this.response ? this.response.data : undefined,
            });
        }

        return this;
    }

    /**
     * [Constructor]
     *
     * @param {String} url
     * @param {Object|Array}? params
     * @returns {Request}
     */
    static make(url, params) 
    {
        return new Request(url, params);
    }
}