import React, {Component} from "react"


import { Event, Util } from "../Helpers"
// import Navigator from "../navigation/Navigator"

/**
 * [Notes]
 *
 * @class Login
 */
export default class TBComponent extends Component
{
    /**
     * [Notes]
     *
     * @property {string}
     */
    // static application;

    /**
     * [Notes]
     *
     * @property {string}
     */
    static alias = '';

    /**
     * [Notes]
     *
     * @property {object}
     */
    // static events = {};

    /**
     * [Constructor]
     *
     * @param Object props
     * @return Login
     */
    constructor(props)
    {
        super(props);

        this._isMounted = false;
    }

    /**
     * [Notes]
     *
     * @return {void}
     */
    componentDidMount()
    {
        this._isMounted = true;

        // if (!TBComponent.application) {
        //     return;
        // }

        let name = this.constructor.alias
            ? this.constructor.alias : this.constructor.name;

        // this.app().track(
        //     `${name} Mounted`.substring(0, 30), {type: 'navigation'}
        // );

        if (!this.constructor.events) {
            return;
        }

        let events = this.constructor.events;
        if (Util.isFunction(this.constructor.events)) {
            events = this.constructor.events();
        }

        for (let key in events) {
            Event.listen(key, (...params) => {
                events[key](this, ...params);
            });
        }
    }

    /**
     *
     * @param key
     * @param callback
     * @returns {*}
     */
    reference(key, callback)
    {
        if (this.refs && this.refs[key]) {
            return callback(this.refs[key]);
        }
    }

    /**
     * Use setState as a Promise instead of its callback param
     *
     * @return {Promise}
     */
    promiseState(updated)
    {
        return new Promise((resolve,reject) => {
            if (!this._isMounted) {
                return resolve();
            }

            try {
                this.setState(updated, () => resolve());
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Reference to containing App properties and values
     *
     * @return {App}
     */
    // app()
    // {
    //     return TBComponent.application;
    // }

    /**
     * [Notes]
     *
     * @return {App}
     */
    // param(param)
    // {
    //     return this.props.navigation.state.params[param];
    // }

    /**
     * [Notes]
     *
     * @return {void}
     */
    componentWillUnmount()
    {
        this._isMounted = false;

        for (let key in this.constructor.events) {
            Event.ignore(key);
        }
    }
}