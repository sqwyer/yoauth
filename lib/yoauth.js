const { addDefaults } = require('./options');

const express = require('express');
const passport = require('passport');
const session = require("express-session");

class YoAuth {

    options = require('./options.defaults').defaultOptions;

    constructor(options) {
        this._mongoose = require('mongoose');
        this._router = require('express').Router();

        if(options["mongoUri"] == undefined) throw new Error("Must have a MongoURI to construct YoAuth constructor.");
        else this._con = this._mongoose.createConnection(options.mongoUri);

        if(options.sessionSecret == undefined) throw new Error("Must have a sessionSecret to construct YoAuth constructor.");

        this.options = addDefaults(options);

        console.log(...this.options.userModel.args);
        this._userModel = this._con.model(this.options.userModel.name, this.options.userModel.schema, ...this.options.userModel.args || undefined);
    }

    renderLogin = (_, res) => {
        res.render(this.options.loginFile, {...this.options});
    }
    renderSignup = (_, res) => {
        res.render(this.options.signupFile, {...this.options});
    }
    ensureAuth = (req, res, next) => {
        if(req.user != undefined) next();
        else {
            res.redirect(`${this.options.path}/signup`);
        }
    }

    configureServer = (app, options) => {
        let router = this._router;
        let path = options.path || '/yoauth';

        if(path != undefined && typeof path == 'string' && !path.startsWith('/')) {
            console.error('(DEPRECATED) Custom path must begin with \'/\'');
            path = `/${path}`;
        }

        router.use('/static', express.static(`${__dirname}/../static`));
        router.use(express.urlencoded({ extended: false }));

        app.use(session({ secret: this.options.sessionSecret, saveUninitialized: false, resave: false }));
        app.use(passport.initialize());
        app.use(passport.session());

        require('./passport').init(this, passport);

        router.get('/login', (req, res) => this.renderLogin(req, res));
        router.get('/signup', (req, res) => this.renderSignup(req, res));
        router.post('/login', (req, res, next) => this.options.loginCallback(this, passport, req, res, next));
        router.post('/signup', (req, res) => this.options.signupCallback(this, req, res));
        router.post('/logout', (req, res) => {
            req.logOut();
            res.redirect(`${this.options.path}/login`);
        });

        this.options.path = path || '/yoauth';
        app.use(path || '/yoauth', router);
    }

    plugin = fn => {
        fn(this);
    }
}

module.exports = {YoAuth};