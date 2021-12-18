const { form, deform, addDefaults } = require('./options');

class YoAuth {
    constructor(options) {
        this.options = addDefaults(form(options));
        this.ensureAuth.bind(this);
    }

    renderLogin = (_, res) => {
        res.render(`${__dirname}/../public/login.hbs`, deform(this.options));
    }
    renderSignup = (_, res) => {
        res.render(`${__dirname}/../public/signup.hbs`, deform(this.options));
    }
    ensureAuth = (req, res, next) => {
        if(req.user != undefined) next();
        else {
            res.redirect(`${this.options.get('path').value}/signup`);
        }
    }
}

module.exports = {YoAuth};