const { router } = require('./lib/server');
const { YoAuth } = require('./lib/yoauth');

module.exports.default = YoAuth;
module.exports = {
    YoAuth,
    router
};

// yoauth = require('yoauth');
// new yoauth({ ... });