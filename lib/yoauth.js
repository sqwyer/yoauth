const { form, deform, addDefaults } = require('./options');

class YoAuth {
    constructor(options) {
        this._mongo = require('mongoose');
        if(options["mongoUri"] == undefined) throw new Error("Must have a MongoURI to construct YoAuth constructor.");
        else this._mongo.connect(options["mongoUri"]);
        if(options["sessionSecret"] == undefined) throw new Error("Must have a sessionSecret to construct YoAuth constructor.");
        if(options["userModel"] == undefined) {
            options["userModel"] = this._mongo.model("User", new this._mongo.Schema({
                email: String,
                fullName: String,
                password: String
            }, {
                timestamps: true
            }));
        }
        this.options = addDefaults(form(options));
        this.ensureAuth.bind(this);
        this._mongo.connect(this.options.get('mongoUri').value);
    }

    renderLogin = (_, res) => {
        res.render(this.options.get('loginFile').value, deform(this.options));
    }
    renderSignup = (_, res) => {
        res.render(this.options.get('signupFile').value, deform(this.options));
    }
    ensureAuth = (req, res, next) => {
        if(req.user != undefined) next();
        else {
            res.redirect(`${this.options.get('path').value}/signup`);
        }
    }

    configureServer = (server, options) => require('./server').router(server, options);
}

module.exports = {YoAuth};