import URL from 'url-parse';

export default class Path
{
    constructor(urlString, options)
    {
        this.original = urlString;
        this.url = urlString;
        this.options = options ? options : {};

        this.sync();
    }

    contains(pattern, useRegex = false)
    {
        if (!useRegex) {
            return this.url.indexOf(pattern) !== -1;
        }

        return this.url.match(pattern);
    }

    param(key, value = undefined)
    {
        if (!value) {
            return this.params[key];
        }

        this.params[key] = value;

        this.url = this.toString();
    }

    replace(pattern, replacement, useRegex = false)
    {
        if ( useRegex && pattern.test(this.url)) {
            this.url = this.url.replace(pattern, replacement);
            this.sync();

            return this;
        }

        let newUrl = this.toString().replace(pattern, replacement);
        if (newUrl !== this.url) {
            this.sync();
        }

        return this;
    }

    relative()
    {

        let urlString = this.path;

        if(Object.keys(this.params).length)
        {
            urlString += '?' + this.serialize(this.params);
        }

        if (this.hash) {
            urlString += '#' + this.hash;
        }

        return urlString;
    }

    toString()
    {
        let urlString = '';

        if (this.protocol) {
            urlString += this.protocol + '//';
        }

        if (this.host) {
            urlString += this.host;
        }

        return urlString + this.relative();
    }

    serialize(object, prefix)
    {
        let str = [], p;
        for(p in object) {
            if (!object.hasOwnProperty(p)) {
                continue;
            }

            let shouldEncode = true;
            if (this.options.DontEncode) {
                for (let i in this.options.DontEncode) {
                    if (this.options.DontEncode[i] === p) {
                        shouldEncode = false;
                        break;
                    }
                }
            }

            let k = prefix ? prefix + "[" + p + "]" : p,
                v = object[p];

            let component;
            if (v !== null && typeof v === "object") {
                component = this.serialize(v, k);
            }
            else if (shouldEncode) {
                component = encodeURIComponent(k) + "=" + encodeURIComponent(v);
            }
            else {
                v = v.replace("&", "%26");
                component = k + "=" + v;
            }

            str.push(component);
        }

        return str.join("&");
    }

    sync()
    {
        // this.params = {};
        // return this;

        let info = new URL(this.url);

        // console.log(info);

        this.host = info.hostname,
            this.path = info.pathname,
            this.protocol = info.protocol,
            this.hash = info.hash,
            this.queryString = info.query ? info.query : '?',
            this.params = {};

        let queryString = this.queryString.substring(this.queryString.indexOf('?') + 1);

        let queries,
            temp,
            i,
            l;

        queries = queryString.split("&");

        for ( i = 0, l = queries.length; i < l; i++ ) {
            if (!queries[i]) {
                continue;
            }
            temp = queries[i].split('=');
            this.params[temp[0]] = decodeURIComponent(temp[1]);
        }

        return this;
    }

    components()
    {
        return {
            host: this.host,
            path: this.path,
            protocol: this.protocol,
            queryString: this.queryString,
            params: this.params,
        };
    }

    hostName()
    {
        return this.protocol + "//" + this.host;
    }

    static parse(url, options)
    {
        return new this(url, options);
    }
}