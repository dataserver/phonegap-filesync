let storage = {
    version : 1,
    // compress: true,
    options : {
        prefix : ''
    },

    get : function(key, defaultValue = '') {
        return this._read(key, defaultValue);
    },
    set : function(key, value) {
        this._write(key, value);
    },
    remove : function(key) {
        this._delete(key);
    },
    empty : function() {
        this._clear();
    },
    getAll : function() {
        const keys = this._keys();
        let obj = {};

        for (let i=0, len=keys.length; i<len; i++) {
            obj[keys[i]] = this._read(keys[i]);
        }
        return obj;
    },
    getKeys : function() {
        return this._keys();
    },
    getPrefix : function() {
        return this.options.prefix;
    },
    has : function(key) {
        return this.get(key, null) !== null;
    },
    forEach : function(callbackFunc) {
        const allContent = this.getAll();

        for (let prop in allContent) {
            callbackFunc(prop, allContent[prop]);
        }
    },


    // localStorage API
    _read : function(key, defaultValue) {
        let raw = localStorage.getItem(this._prefix(key));
        
        if (!raw) {
            return defaultValue;
        }
        // let str = (this.compress) ? LZString.decompressFromUTF16(raw) : raw;
        return this._unserialize(raw);
    },
    _write : function(key, value) {
        let serialized = this._serialize(value);
        // let str = (this.compress) ? LZString.compressToUTF16(serialized) : serialized;
        return localStorage.setItem(this._prefix(key), serialized);
    },
    _delete : function(key) {
        return localStorage.removeItem(this._prefix(key));
    },
    _keys : function() {
        let unprefixed = [];

        for (let i=0, len=localStorage.length; i<len; ++i ) {
            unprefixed[i] =  this._unprefix(mystorage.key(i));
        }
        return unprefixed;
    },
    _clear : function() {
        localStorage.clear();
    },
    // localStorage API

    _prefix : function(key) {
        return this.options.prefix + key;
    },
    _unprefix : function(key) {
        return key.replace(new RegExp("^" + this.options.prefix), '');
    },
    _serialize : function(value) {
        if (this._isJson(value)) {
            return value;
        }
        return JSON.stringify(value);
    },
    _unserialize : function(value) {
        if (this._isJson(value)) {
            return JSON.parse(value);
        }
        return value;
    },
    _isJson : function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    _isObject : function(a) {
        return (!!a) && (a.constructor === Object);
    },
    _isArray : function(a) {
        return (!!a) && (a.constructor === Array);
    }
};