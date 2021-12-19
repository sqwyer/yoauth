const mongoose = require('mongoose');

const defaultOptions =  {
    background: 'F78D91',
    authRedirect: '/',
    signupCallback: require('./auth').defaultSignup,
    loginCallback: require('./auth').defaultLogin,
    loginFile: `${__dirname}/../public/login.hbs`,
    signupFile: `${__dirname}/../public/signup.hbs`,
    signupCustomFields: [{
        label: "Full Name",
        name: "fullname",
        type: "string",
        placeholder: "John Doe"
    }],
    userModel: {
        name: "user",
        schema: new mongoose.Schema({
            email: String,
            fullname: String,
            password: String,
        }, {
            timestamps: true
        }),
        args: []
    },
    usernameField: 'email'
};

module.exports = {defaultOptions};