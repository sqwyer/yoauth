const { Client } = require('../dist/client');
const { options } = require('./options');

const express = require('express');
const app = express();

const auth = new Client(options);

auth.configureServer(app);

auth.plugin(require('yoauth-simply-theme').Plugin)

app.get('/', auth.ensureAuth, function(req, res, next) {
    res.render(`${__dirname}/index.hbs`, {user: req.user});
});

app.listen(3000, e => {
    if(e) throw e;
    console.log('Running on PORT 3000');
});