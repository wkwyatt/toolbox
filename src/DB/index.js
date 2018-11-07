import {AsyncStorage} from "react-native"

import { Util } from '../Helpers';
import Storage from '../Storage';

export default class DB
{
    static inWriteTransaction = false;

    static boot(app, config)
    {
        let i;

        if (!config || !config.models || !config.models.length) {
            return new Promise(resolve => resolve());
        }

        let db = new this();
        db.app = app;

        DB.shared = db;

        return db.bootModels(app, config.models);
    }

    reboot = async(config) =>
    {
        await Storage.storage({DB: {}});
        // await this.app.storage({DB: {}});  //this.app is DEPRICATED

        return this.bootModels(this.app, config.models);
    };

    bootModels = async(app, models) =>
    {
        for (i in models) {
            await models[i].boot(app, this);
        }

        return this;
    };

    addTable = async(name) =>
    {
        let tables = await this.tables();
        if (!tables[name]) {
            tables[name] = {};
            await Storage.storage('DB.'+name, {});
        }
    };

    tables = async() =>
    {
        return await Storage.storage('DB', {});
    };

    table = async(name, values) =>
    {
        let tables = await this.tables();
        if (values) {
            tables[name] = values;
            await Storage.storage({'DB': tables});
        }

        return tables[name];
    };
}