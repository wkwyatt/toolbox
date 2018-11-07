import API from "./API";
import Auth from "./Auth";
import Connection from "./Connection";
import Config from "../Config";

export default class Salesforce
{
    constructor(session)
    {
        this.auth = new Auth(this, session);
        this.Connection = Connection;
    }

    static api()
    {
        return new API(this);
    }

    static config()
    {
        return Config.get('Salesforce');
    }

    bindToErrorReport(report)
    {
        if (Connection.ACTIVE_DOMAIN) {
            report.vendor = {
                type: 'Salesforce',
                name: Connection.ACTIVE_NICKNAME,
                domain: Connection.urlForDomain(Connection.ACTIVE_DOMAIN),
            };
        }

        if (this.auth.User && this.auth.User.organization) {
            report.organization = this.auth.User.organization;
        }

        return report;
    }

    // app()
    // {
    //     return this.constructor.application;
    // }

    static boot(app, auth)
    {
        // this.application = app;

        return new this(auth);
    }
}
