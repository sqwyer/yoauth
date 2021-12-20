import { Schema, createConnection, Connection, Model } from 'mongoose';
import * as express from 'express';
import * as passport from 'passport';
import * as express_session from 'express-session';

import { init } from './auth/passport.config';
import { login } from './auth/local/login';
import { signup } from './auth/local/signup';

class Client {

    public options: any = {
        background: '#F78D91',
        buttonBackground: '#4664E9',
        authRedirect: '/',
        mongoOptions: {},
        signupCallback: signup,
        loginCallback: login,
        loginFile: `${__dirname}/../client/login.hbs`,
        signupFile: `${__dirname}/../client/signup.hbs`,
        signupCustomFields: [{
            label: "Full Name",
            name: "fullname",
            type: "string",
            placeholder: "John Doe"
        }],
        userModel: {
            name: "user",
            schema: new Schema({
                email: String,
                fullname: String,
                password: String,
            }, {
                timestamps: true
            }),
            args: []
        },
        usernameField: 'email',
        path: '/auth'
    }

    private _connection: Connection;
    public _router: express.Router;
    public _userModel: Model<any>;

    constructor(options) {

        if(options.mongoUri == undefined) throw new Error("Auth constructor options must include 'mongoUri' property.");
        if(options.path != undefined && !options.path.startsWith("/")) options.path = `/${options.path}`;
        if(options.userModel.args == undefined) options.userModel.args = [];

        for(let k in this.options) {
            if(options[k] == undefined) options[k] = this.options[k];
        }

        this.options = options;
        this._router = express.Router();
        this._connection = createConnection(options.mongoUri, options.mongoOptions);

        this._userModel = this._connection.model(options.userModel.name, options.userModel.schema, ...options.userModel.args);
    }

    public configureServer: Function = server => {

        server.set('view engine', 'hbs');
        server.use(express.urlencoded({ extended: false }));
        server.use(express_session({ secret: this.options.sessionSecret, saveUninitialized: false, resave: false }));
        server.use(passport.initialize());
        server.use(passport.session());
        
        init(this, passport);

        this._router.use('/static', express.static(`${__dirname}/../client/static`));

        this._router.get('/login', (_: express.Request, res: express.Response) => {
            res.render(this.options.loginFile, {options: this.options});
        });

        this._router.get('/signup', (_: express.Request, res: express.Response) => {
            res.render(this.options.signupFile, {options: this.options});
        });

        this._router.post('/login', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.options.loginCallback(req, res, {
                auth: this,
                passport,
                next
            });
        });

        this._router.post('/signup', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.options.signupCallback(req, res, {
                auth: this,
                next
            });
        });

        this._router.post('/logout', (req: express.Request, res: express.Response) => {
            req.logOut();
            res.redirect(`${this.options.path}/login`);
        });

        server.use(this.options.path, this._router);
    }

    public ensureAuth: Function = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(req.user != undefined) next();
        else res.redirect(`${this.options.path}/signup`);
    }

    public plugin: Function = action => action(this);
}

export { Client };