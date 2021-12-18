const {YoAuth} = require('../.');
const {options} = require('./options');

const express = require('express');
const app = express();

const auth = new YoAuth(options);

auth.configureServer(app, {
    auth,
    path: '/auth'
});

app.get('/', auth.ensureAuth, function(req, res, next) {
    res.render(`${__dirname}/index.hbs`, {user: req.user});
});

app.listen(3000, e => {
    if(e) throw e;
    console.log('Running on PORT 3000');
});