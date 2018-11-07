
import BackboneEvents from "backbone-events-standalone"

import Config from "../Config"
import Log from "./Log"
import Util from "./Util"


export default class Event
{
    static provider()
    {
        if (!this.Provider) {
            this.Provider = BackboneEvents.mixin({});
        }

        return this.Provider;
    }

    static fire(name, params = {})
    {
        if (Config.get('Toolbox.log.events')) {
            let logParams = (typeof params === 'object') ? {
                name, ...params
            } : {name, params};
            Log.object(name + ' Event Fired', logParams );
        }

        Event.provider().trigger(name, params);
    }

    static listen(name, callback)
    {
        Event.provider().on(name, callback);
    }

    static ignore(name)
    {
        Event.provider().unbind(name);
    }

    static event(name, params) {
        if (name) {
            return this.fire(name, params);
        }
        return this;
    }
}