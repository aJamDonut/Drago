class DragoStorage {

    /**
     * 
     * @param {Drago} drago 
     * @param {Options} options General options, things like compress, uncompress, prefix
     */
    constructor(drago, options) {
        this.drago = drago;
        this.prefix = options.prefix || 'drago_';
        this.storage = localStorage;
        this.options = options;
    }

    /**
     * Returns the KB value of a string
     * @param {String} value A string to determine the size of
     * @returns 
     */
    sizeOf(value) {
        return (new TextEncoder().encode(value)).length;
    }

    _makeKey(key) {
        return this.prefix + key + '.json'; //.json is kinda optional, but i'm leaving it here to forward-think to electron/nwjs or SaaS
    }

    _compress(value) {
        if (typeof this.options.compress !== 'function') {
            return value;
        }

        let compressed = this.options.compress(value);
        let beforeKb = this.sizeOf(value) / 1024;
        let afterKb = this.sizeOf(compressed) / 1024;

        //What we'll do here is, when we save it, if it's compressed
        //we'll use c|compresseddata
        //If its raw, we'll use r|rawdata
        if (beforeKb <= afterKb) {
            //Don't compress
            return "r|" + value;
        }

        return "c|" + compressed
    }

    _decompress(value) {
        let code = value[0];
        let json = value.substring(2, value.length);
        
        //No need to decompress, its raw.
        if (code == 'r') {
            return json;
        }

        if (typeof this.options.decompress !== 'function') {
            throw '[Drago] Got a compressed string, but no way to decompress it';
        }

        return this.options.decompress(json);
    }

    keys() {
        return Object.keys(this.storage);
    }

    /**
     * Pass an object to be saved in storage. Must be a JS object
     * @param {String} key A string to access the data in future
     * @param {Object} value An object to be stringified and saved
     * @returns {Object}
     */
    save(key, value) {
        return this.storage.setItem(this._makeKey(key), this._compress(JSON.stringify(value)));
    }

    /**
     * This function will parse the data and return it as an object
     * @param {String} key The key to return
     * @returns {Object}
     */
    read(key) {
        let rawValue = this.storage.getItem(this._makeKey(key));
        let value = this._decompress(rawValue);
        return JSON.parse(value);
    }

    /**
     * 
     * @param {String} key 
     * @returns 
     */
    remove(key) {
        return this.storage.removeItem(this._makeKey(key));
    }

    /**
     * 
     * @param {String} key 
     * @returns 
     */
    exists(key) {
        return !!this.storage[this._makeKey(key)];
    }

    toJSON() {
        return {}; //Cannot be serialized
    }

}