import Config from "../Config"
// import Environment from "./Environment"
import Util from "./Util"

export default class Log
{
    static config()
    {
        return Config.get('Toolbox.log');
    }

    static isDisabled()
    {
        if (Config.get('App.env') !== "local") {
            return false;
        }

        let config = this.config();

        return config && config.hide;
    }

    /**
     * @param array messages
     * @return void
     **/
    static line(...messages)
    {
        this.run(() => {
            console.log(...messages);
        });
    }

    /**
     * @param string message
     * @param {} styles
     * @return void
     **/
    static styled(message, styles)
    {
        this.run(() => {
            var stylesString = "";
            Util.forEach(styles, (value, property) => {
                stylesString += `${property}:${value};`;
            });

            console.log(`%c${message}`, stylesString);
        });
    }

    /**
     * Highlighted blue to easily distinguish from normal logs
     * Good for temporary testing
     *
     * @param string message
     * @return void
     **/
    static debug(message)
    {
        this.run(() => {
            console.debug(message);
        });
    }

    /**
     * Styled Info Message
     *
     * @param string message
     * @return void
     **/
    static info(message)
    {
        this.run(() => {
            console.info(message);
        });
    }

    /**
     * Styled Warning Message
     *
     * @param string message
     * @return void
     **/
    static warn(message)
    {
        this.run(() => {
            console.warn(message);
        });
    }

    /**
     * Styled Error Message
     *
     * @param string message
     * @return void
     **/
    static error(message)
    {
        this.run(() => {
            console.error(message);
        });
    }

    /**
     * Styled Table
     *
     * @param array headers
     * @param array rows (optional)
     * @return void
     **/
    static table(headers, rows = [])
    {
        this.run(() => {
            if ( Util.isEmpty(rows) ) {
                return console.table(headers);
            }

            if ( Util.isArray(Util.head(rows)) ) {
                rows = Util.map(rows, row => {
                    var object = {};
                    Util.forEach(row, (property, index) => {
                        object[headers[index]] = property;
                    });

                    return object;
                });
            }

            console.table(rows.all(), headers);
        });
    }

    /**
     * Track execution time
     *
     * @param string event
     * @param () callback
     * @return void
     **/
    static clock(event, callback)
    {
        this.run(() => {
            console.time(event);
            callback();
            console.timeEnd(event);
        });
    }

    static prefixWithTime(append)
    {
        // if (this.isDisabled()) {
        // 	return;
        // }

        return new Date().toLocaleTimeString() + ' - ' + append;
    }

    /**
     * Track execution time
     *
     * @param string title
     * @param array lines
     * @param boolean collapsed (optional)
     * @return void
     **/
    static group(title, lines, collapsed = true)
    {
        this.run(() => {
            this.unvalidatedGroup(title, lines, collapsed);
        });
    }

    /**
     * Track execution time
     *
     * @param string event
     * @param array lines
     * @param boolean collapsed
     * @return void
     **/
    static unvalidatedGroup(title, lines, collapsed = true)
    {
        this.catchException(() => {
            console[collapsed ? 'groupCollapsed' : 'group'](Log.prefixWithTime(title));

            Util.forEach(lines, line => {
                if ( Util.isString(line) ) {
                    console.log(line);
                }
                else {
                    var method = Util.head(
                        Util.keys(line)
                    );
                    if (this[method] !== undefined) {
                        this[method](...line[method]);
                    }
                    else {
                        console.log(line);
                    }
                }
            });

            console.groupEnd();
        }, () => {
            console.log(title, lines);
        })
    }

    /**
     * Track execution time
     *
     * @param string event
     * @param array lines
     * @param boolean collapsed
     * @return void
     **/
    static object(nickname, object, collapsed = true)
    {
        try {
            this.run(() => {
                let lines = [];
                Util.forEach(object, (value, property) => {
                    if (value instanceof Date || ! Util.isObject(value) ) {
                        lines.push(property + ': ' + value);
                    }
                    else {
                        lines.push(
                            Log.loggableObject(property, value)
                        );
                    }
                });

                this.unvalidatedGroup(nickname, lines, collapsed);
            });
        }catch(e) {
            console.log(nickname, object, collapsed, e);
        }
    };

    /**
     * @param string logKey
     * @param {} params
     * @return {}
     **/
    static loggableObject(logKey, params)
    {
        try {
            let paramsCopy;
            try {
                paramsCopy = {...params};
            } catch (e) {
                paramsCopy = params;
            }

            return {'unvalidatedGroup' : [
                    logKey + ': ',
                    Util.map(paramsCopy, (value, key) => {
                        if (Util.isObject(value)) {
                            return Log.loggableObject(key, value);
                        }

                        return key + ': ' + value;
                    })
                ]};
        }catch(e) {
            console.log(logKey, params, e);
        }
    }

    /**
     *
     * @param callback
     * @returns {Promise<void>}
     */
    static run = async(callback) =>
    {
        if (Log.isDisabled()) {
            return;
        }

        while (Log.IsLogging) {
            await Util.wait(.5);
        }

        Log.IsLogging = true;

        try {
            callback();
        } catch (e) {
            console.warn(e);
        }

        Log.IsLogging = false;
    };

    /**
     *
     * @param onExecute
     * @param onCaught
     * @param logError
     * @returns {*}
     */
    static catchException(onExecute, onCaught, logError = true){
        if(onCaught !== undefined && typeof onCaught === "boolean"){
            logError = onCaught;
            onCaught = undefined;
        }
        if(onCaught === undefined){
            onCaught = (error) => {
                if(logError) console.warn("OnCaughtException", error);
            }
        }

        try{
            onExecute();
            return true;
        }catch (error) {
            onCaught(error);
            return error;
        }

    }
}
