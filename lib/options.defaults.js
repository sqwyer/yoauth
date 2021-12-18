const getDefaultOptions = Option => {
    return [
    new Option({
        name: 'background',
        type: 'string',
        defaultValue: '#F78D91'
    }),
    new Option({
        name: 'buttonBackground',
        type: 'string',
        defaultValue: '#4285F4'
    }),
    new Option({
        name: 'authRedirect',
        type: 'string',
        defaultValue: '/'
    }),
    new Option({
        name: 'signupCallback',
        type: 'function',
        defaultValue: require('./auth').defaultSignup
    }),
    new Option({
        name: 'loginCallback',
        type: 'function',
        defaultValue: require('./auth').defaultLogin
    }),
    new Option({
        name: 'loginFile',
        type: 'string',
        defaultValue: `${__dirname}/../public/login.hbs`
    }),
    new Option({
        name: 'signupFile',
        type: 'string',
        defaultValue: `${__dirname}/../public/signup.hbs`
    }),
    new Option({
        name: 'signupCustomFields',
        type: 'array',
        defaultValue: [{
            label: "Full Name",
            name: "fullname",
            type: "string",
            placeholder: "John Doe"
        }]
    }),
    new Option({
        name: 'usernameField',
        type: 'string',
        defaultValue: 'email'
    })
    ];
};

module.exports = {getDefaultOptions};