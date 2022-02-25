'use strict';
class DataCache {
    constructor() {
        this.cache = new Map();
    }

    set (id, value) {
        this.cache.set(id, value);
    }

    has (id) {
        return this.cache.has(id);
    }

    get (id) {
        return this.cache.get(id);
    }

    delete (id) {
        this.cache.delete(id);
    }

    apply (id, value) {
        if (this.has(id)) return this.get(id);

        if (typeof value === 'function') value = value();

        this.set(id, value);
        return value;
    }

    flush () {
        this.cache.clear();
    }

    size () {
        return this.cache.size;
    }

    dump () {
        return Object.fromEntries(this.cache);
    }

    toArray (fun) {
        if (typeof fun !== 'function') {
            fun = (val) => {
                return {
                    ...val[1],
                    _id: val[0]
                };
            };
        }
        return Array.from(this.cache, fun);
    }
}

module.exports = DataCache;