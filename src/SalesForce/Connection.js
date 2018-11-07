import Model from '../Model';
import Storage from '../Storage';

import { Path, Util } from '../Helpers';
import Config from "../Config";

export default class Connection extends Model
{
    static ACTIVE_DOMAIN = '';
    static ACTIVE_NICKNAME = '';

    static schemaName = 'Connection';

    static schemaMap = {
        nickname: 'string',
        domain: 'string',
        isCustom: 'bool',
    };

    static useTimestamps = false;

    static default()
    {
        return Connection.filtered(model => {
            return !model.isCustom;
        });
    }

    static custom()
    {
        return Connection.filtered(model => {
            return model.isCustom;
        });
    }

    static active()
    {
        return new Promise((resolve,reject) => {

            // let defaultConnections = await Connection.default();

            // Storage.storage(
            //     "@salesforce:ActiveConnection", defaultConnections[0]
            // ).then(activeConnection => {
            //     activeConnection = Connection.make(activeConnection);
            //     Connection.ACTIVE_DOMAIN = activeConnection.domain;
            //     Connection.ACTIVE_NICKNAME = activeConnection.nickname;
            //
            //     resolve(activeConnection)
            // });

            Connection.default()
                .then(defaultConnections => Storage.storage("@salesforce:ActiveConnection", defaultConnections[0]))
                .then(activeConnection => {
                    activeConnection = Connection.make(activeConnection);
                    Connection.ACTIVE_DOMAIN = activeConnection.domain;
                    Connection.ACTIVE_NICKNAME = activeConnection.nickname;

                    resolve(activeConnection)
                })
                .catch(e => {
                    console.warn('Connection @ active ERROR:', e);
                    reject(e)
                });

        });
    }

    static async activateWithNickname(nickname)
    {
        let activeConnection = await Connection.active();
        if (activeConnection.nickname === nickname) {
            return activeConnection;
        }

        let relatedConnection = await Connection.withNickname(nickname);
        if (relatedConnection) {
            await relatedConnection.makeActive();

            return relatedConnection;
        }

        return false;  // Connection not an Active Connection or Related Connection
    }

    static async withNickname(nickname)
    {
        return this.withMatching('nickname', nickname);
    }

    static withDomain(domain)
    {
        return this.withMatching('domain', domain);
    }

    static async withMatching(key, value)
    {
        let results = Array.from(
            await Connection.filtered(model => {
                return model[key] === value
            })
        );

        if (results.length) {
            return results[0];
        }

        return false;
    }

    static cleanUp()
    {
        return new Promise(async(resolve,reject) => {

            try {
                let all = await Connection.all();
                let active = {...await Connection.active()};


                for(let connection of all){
                    let clean = {...connection};

                    clean.domain = String(connection.domain)
                        .replace("https://", "")
                        .replace("http://", "");

                    let cleanConnection = await Connection.create({...clean});

                    if(connection.domain === active.domain
                        && connection.nickname === active.nickname){
                        await cleanConnection.makeActive();
                    }

                }

                resolve()
            }catch(error) {
                reject(error)
            }
        });
    }


    isActive()
    {
        return this.domain === Connection.ACTIVE_DOMAIN;
    }

    async makeActive()
    {
        console.log('Connection @ makeActive');
        await Storage.storage({
            "@salesforce:ActiveConnection": {
                domain: this.domain,
                nickname: this.nickname,
                isCustom: this.isCustom,
            }
        });

        Connection.ACTIVE_DOMAIN = this.domain;
        Connection.ACTIVE_NICKNAME = this.nickname;

        console.log(Storage.storage().cached('@salesforce:ActiveConnection'));
        console.log(Connection);

        // this.app().errorHandler.updateReport();
    }

    url(append = "")
    {
        return this.constructor.urlForDomain(this.domain, append);
    }

    static urlForDomain(domain, append = "")
    {
        if (!domain) {
            return '';
        }
        // if (!domain.endsWith('/') && !append.startsWith('/') && !domain.includes('?')) {
        //     domain += '/';
        // }

        let url = domain.toLowerCase();
        // console.log('fix case', url);
        let path = Path.parse(domain);
        if (path.queryString) {
            url = url.replace(path.queryString, '') + append;
        }
        // console.log('fix remove query string', url);
        if (!path.protocol || !url.includes(path.protocol)) {
            url = 'https://' + url;
        }
        // console.log('fix protocol', path.protocol, url);

        path = Path.parse(url);
        while(path.path.startsWith('//')) {
            let updatedPath = path.path.substring(1);
            url = url.replace(path, updatedPath);
            path = Path.parse(url);
        }
        // console.log('fix too many /', url);

        return url;
    }

    loginRoute()
    {
        let config = Config.getDefault('Salesforce');

        return this.url('services/oauth2/authorize?' +
            encodeURI('client_id=' + config.consumerKey +
                '&client_secret=' + config.secretKey +
                '&redirect_uri=' + config.redirectURI +
                '&response_type=code&scope=full refresh_token')
        );
    }

    accessTokenRoute(accessCode)
    {
        let config = Config.getDefault('Salesforce');

        return this.url('services/oauth2/token?' +
            encodeURI('client_id=' + config.consumerKey +
                '&client_secret=' + config.secretKey +
                '&redirect_uri=' + config.redirectURI +
                '&grant_type=authorization_code&code=' + accessCode)
        );
    }

    static async checkIfLoaded()
    {
        try {
            let defaultConfig = Config.getDefault('Salesforce.defaultConnections');
            console.log('Connection @ checkIfLoaded -> defaultConfig', defaultConfig);

            let defaultConnections = await this.default(),
                defaultLookup = {};
            console.log('Connection @ checkIfLoaded -> defaultConnections', defaultConnections);

            for (let i in defaultConnections) {
                defaultLookup[defaultConnections[i].nickname] = defaultConnections[i].domain;
            }
            console.log('Connection @ checkIfLoaded -> defaultLookup', defaultLookup);

            if (!Util.isEqual(defaultConfig, defaultLookup)) {
                console.log('Connection @ checkIfLoaded @ reboot 1');
                await this.reboot();
            }

            let activeConnection = await this.active();
            console.log('Connection @ checkIfLoaded -> activeConnection', activeConnection);
            if (!activeConnection.domain || activeConnection.subdomain) {
                console.log('Connection @ checkIfLoaded @ reboot 2', activeConnection);
                await this.reboot();
            }
        }
        catch (e) {
            console.warn("Connection @ checkIfLoaded", e);
        }
    }

    static async reboot()
    {


        let defaults = Config.getDefault('Salesforce.defaultConnections');

        let defaultConnections = await Connection.default() || [];
        await Connection.deleteModels(defaultConnections);

        let connections = [];
        for (let nickname in defaults) {
            let connection = await Connection.create({
                nickname: nickname,
                domain: defaults[nickname],
                isCustom: false,
            });
            connections.push(connection);
        }

        let active = await Connection.active();
        if (active === undefined || !active.domain || !active.domain.includes('.')) {
            await connections[0].makeActive();
        }

    }

    static boot(app, db)
    {
        return super.boot(app, db).then(async() => {
            await this.reboot();
        });
    }
}
