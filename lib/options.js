const { defaultOptions } = require('./options.defaults.js');

const addDefaults = o => {
    for(k in defaultOptions) {
        if(o[k] == undefined) o[k] = defaultOptions[k];
    }

    return o;
}

module.exports = { addDefaults }