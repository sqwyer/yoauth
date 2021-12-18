const { Option } = require('./options');

const express = require('express');
const passport = require('passport');
const session = require("express-session");
const router = express.Router();

module.exports = {
    router: (app, options) => {
        let yo = options.auth;
        let path = options.path || '/yoauth';

        if(path != undefined && typeof path == 'string' && !path.startsWith('/')) path = `/${path}`;

        router.use('/static', express.static(`${__dirname}/../static`));
        router.use(express.urlencoded({ extended: false }));

        app.use(session({ secret: yo.options.get('sessionSecret').value, saveUninitialized: false, resave: false }));
        app.use(passport.initialize());
        app.use(passport.session());

        require('./passport').init(yo, passport);

        router.get('/login', (req, res) => yo.renderLogin(req, res));
        router.get('/signup', (req, res) => yo.renderSignup(req, res));
        router.post('/login', (req, res, next) => yo.options.get('loginCallback').value(yo, passport, req, res, next));
        router.post('/signup', (req, res) => yo.options.get('signupCallback').value(yo, req, res));
        router.post('/logout', (req, res) => {
            req.logOut();
            res.redirect(`${yo.options.get('path').value}/login`);
        });

        yo.options.create(new Option({
            name: 'path',
            type: 'string',
            defaultValue: path || '/yoauth'
        }));
        app.use(path || '/yoauth', router);
    }
};