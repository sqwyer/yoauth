class Option {
    constructor(ctx) {

        let {name, type, defaultValue} = ctx;

        this.name = name;
        this.type = type;
        this.value = defaultValue || null;
    };
};

const defaultOptions = require('./options.defaults.js').getDefaultOptions(Option);

class OptionList {

    options = [];

    constructor(list) {
        if(list && Array.isArray(list)) for(let i = 0; i < list.length; i++) this.create(list[i]);
    };

    get(o) {
        return this.options.find(e=>e.name===o);
    };

    set(o,v) {
        let r = this.get(o);
        if(r) {
            if(r.type == 'array' && !Array.isArray(v)) return 0;
            else if(typeof v != r.type && r.type != '*') return 0;
            else {
                this.options.find(e=>e.name===o).value=v;
                return 1;
            }
        } else return -1;
    };

    create(e) {
        if(e instanceof Option && !this.options.find(o=>o.name===e.name)) {
            this.options.push(e);
            return 1;
        }
        else return 0;
    };

    has(o) {
        return this.options.find(e=>e.name===o) ? true : false;
    }
};

const form = o => {
    let l = [];
    for(let k in o) {
        let v = o[k];
        let t;
        if(Array.isArray(v)) t = 'array';
        else t = typeof v;
        l.push(new Option({ name:k,type:t,defaultValue:v }));
    }
    return new OptionList(l);
};

const addDefaults = l => {
    defaultOptions.forEach(o => {
        l.create(o);
    });
    return l;
};

const deform = l => {
    let o = {};
    for(let k of l.options) {
        o[k.name]=k.value;
    }
    return o;
}

module.exports = {Option, OptionList, defaultOptions, addDefaults, form, deform};