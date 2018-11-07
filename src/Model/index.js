import moment from "moment"

import { Log, Util } from "../Helpers"

export default class Model
{
    static schemaName = '';
    static schemaMap = {};

    static useTimestamps = true;

    constructor(props)
    {
        this.sync(props);
    }

    /**
     *
     * @param props
     * @returns {Model}
     */
    static make(props)
    {
        return new this(props);
    }

    /**
     *
     * @param props
     * @returns {Model}
     */
    sync(props)
    {
        for (var key in props) {
            this[key] = props[key];
        }

        return this;
    }

    // app()
    // {
    //     return this.constructor.application;
    // }

    /**
     *
     * @returns {*}
     */
    db()
    {
        return this.constructor.database;
    }

    /**
     * // TODO: Find out what "database" is during boot
     *
     * @param app
     * @param db
     * @returns {*}
     */
    static boot(app, db)
    {
        // this.application = app;
        this.database = db;

        return this.database.addTable(this.schemaName);
    }

    /**
     * Find out if database is setup
     * @returns {boolean}
     */
    static didBoot()
    {
        return this.database !== undefined;
    }

    /*
    |--------------------------------------------------------------------------
    | DB Reads
    |--------------------------------------------------------------------------
    */

    /**
     * Return all Models as an array
     * @return Array[Model]
     */
    static filtered(callback)
    {
        if (!this.didBoot()) {
            return [];
        }

        return this.all().then(models => {
            if(models.length === 0){
                return models
            }

            return Util.filter(models, callback);
        });
    }

    /**
     * Return all Models as an array
     * @return Object{Model.key => Model}
     */
    static entries()
    {
        return new Promise((resolve,reject) => {
            if (!this.didBoot()) {
                return resolve({});
            }

            this.database.table(this.schemaName).then(data => {
                let models = {};
                for (let id in data) {
                    models[id] = this.make(data[id]);
                }

                resolve(models);
            });
        });
    }

    /**
     * Return all Models as an array
     * @return Array[Model]
     */
    static all()
    {
        return new Promise((resolve,reject) => {
            this.entries().then(data => {
                let models = [];
                for (let id in data) {
                    models.push(data[id]);
                }

                resolve(models);
            });
        });
    }

    /**
     * [Comment]
     */
    static take(amount)
    {
        return new Promise((resolve,reject) => {
            this.all().then(entries => {
                resolve(Util.chunk(entries, amount)[0]);
            });
        });
    }

    static count()
    {
        return new Promise((resolve,reject) => {
            return this.all().then(models => {
                resolve(models.length);
            });
        });
    }

    /**
     * @return
     */
    static find(id)
    {
        return new Promise((resolve,reject) => {
            return this.entries().then(models => {
                resolve(models[id]);
            });
        });
    }

    /**
     * @return
     */
    static first()
    {
        return new Promise((resolve,reject) => {
            return this.all().then(models => {
                // if (models.length === 0){
                //     return resolve(false);
                // }

                resolve(models[0]);
            });
        });
    }

    /**
     * @return
     */
    static exists()
    {
        return new Promise((resolve,reject) => {
            return this.all().then(models => {
                resolve(models.length > 0);
            });
        });
    }

    /**
     * Sort the Models in the database by createdAt ASC, return first entry
     * @return Model?
     */
    static latest()
    {
        return new Promise((resolve,reject) => {
            return this.all().then(models => {
                resolve(Util.last(models));
            });
        });
    }

    /*
    |--------------------------------------------------------------------------
    | DB Writes
    |--------------------------------------------------------------------------
    */


    static create(props)
    {
        return this.make(props).store();
    }

    async store()
    {
        let model = this;
        await this.constructor.persistModels('creating', [this], storedModels => {
            let timestamp = moment.utc().valueOf();

            if (!model.id) {
                model.id = String(timestamp);
            }

            if (model.constructor.useTimestamps) {
                if (!model.createdAt) {
                    model.createdAt = timestamp;
                }
                if (!model.updatedAt) {
                    model.updatedAt = timestamp;
                }
            }

            storedModels[model.id] = model.props();

            return storedModels;
        }).catch(e => console.log('db store error', e));

        return model;
    }

    /**
     * @return Promise
     */
    async update(props)
    {
        let model = this;

        await this.constructor.persistModels('updating', [this], storedModels => {
            model.sync(props);
            if (model.constructor.useTimestamps && !props.updatedAt) {
                model.updatedAt = moment.utc().valueOf();
            }

            storedModels[model.id] = model.props();

            return storedModels;
        });

        return model;
    }

    /**
     * Deletes a model from the database
     * @return Promise
     */
    delete()
    {
        return this.constructor.deleteModels([this]);
    }

    /**
     * Deletes Models from the database
     * @return Promise
     */
    static deleteModels(models)
    {
        return this.persistModels('deleting', models, storedModels => {
            for (let i in models) {
                delete storedModels[models[i].id];
            }

            return storedModels;
        });
    }

    /**
     * Deletes Models from the database
     * @return Promise
     */
    static persistModels(eventName, models, alterCallback)
    {
        return new Promise((resolve, reject) => {
            if (!this.didBoot()) {
                return reject('not booted!!!');
            }

            this.handler(
                eventName, models
            ).then(()=>{
                return this.entries();
            }).then(storedModels => {
                // console.log(eventName);
                // console.log(storedModels);
                let altered = alterCallback(storedModels);
                // console.log(altered);
                return this.persist(altered);
            }).then(() => {
                resolve();
            }).catch(e => reject(e));
        })
    }

    static truncate()
    {
        return this.persist({});
    }

    static persist(models)
    {
        if (!this.didBoot()) {
            return;
        }

        return this.database.table(this.schemaName, models);
    }

    static handler(method, instances)
    {
        return new Promise((resolve,reject)=>{
            if (!this[method]
                || !Util.isFunction(this[method])) {
                return resolve();
            }

            let processing = instances.length;

            for (let i in instances) {
                let result = this[method](instances[i]);
                if (!result) {
                    processing--;
                    continue;
                }
                // else {
                result.then(result => {
                    processing--;
                    if (processing === 0) {
                        return resolve();
                    }
                });
                // }
            }

            if (processing === 0) {
                return resolve();
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Logging
    |--------------------------------------------------------------------------
    */

    /**
     * Logs the keys and values of the model
     */
    props()
    {
        let onlyProps = {};
        for (let prop in this) {
            if (typeof this[prop] !== 'function') {
                onlyProps[prop] = this[prop];
            }
        }

        return onlyProps;
    }

    /**
     * Logs all Models in the database
     */
    static logAll()
    {
        this.entries().then(models => {
            let transformed = {};
            for (let id in models) {
                transformed[id] = models[id].props();
            }

            Log.object(
                this.schemaName,
                transformed
            );
        });
    }

    /**
     * Logs the keys and values of the model
     */
    log()
    {
        Log.object(
            this.constructor.schemaName,
            Object.assign(this.props())
        );
    }


}