const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const defaultSignup = (yo, req, res, next) => {
    let usernameField = yo.options.get('usernameField').value;
    let customFieldsOptions = yo.options.get('signupCustomFields').value;
    let customFields = {};

    for(let i = 0; i < customFieldsOptions.length; i++) {
        customFields[customFieldsOptions[i].name] = req.body[customFieldsOptions[i].name];
    }

    let query = {};
    let username = req.body[usernameField];
    let password = req.body.password;
    let User = yo.options.get('userModel').value;

    let op = require('./options').deform(yo.options);

    let options =  {
        background: op.background,
        buttonBackground: op.buttonBackground,
        path: op.path
    }

    let fields = {
        username,
        password,
        ...customFields
    }

    for(let k in fields) {
        if(req.body[k] === "") {
            res.render(yo.options.get('signupFile').value, { ...options, errorMessage: "Must fill all fields." });
            return;
        }
    }

    if(usernameField == 'email' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields["username"])) {
        res.render(yo.options.get('signupFile').value, { ...options, errorMessage: "Must enter a valid email." });
        return;
    }

    if (password.split('').length < 8) {
        res.render(yo.options.get('signupFile').value, { ...options, errorMessage: "Password must be at least 8 characters." });
        return;
    }

    query[usernameField] = req.body[usernameField];

    User.findOne(query)
        .then(user => {
        if (user) {
            res.render(yo.options.get('signupFile').value, { ...options, errorMessage: "Email is already registered." });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        console.log(customFields);

        console.log({
            ...query,
            ...customFields
        });

        const newUser = new User({
            ...query,
            ...customFields,
            password: hashPass
        });

        newUser.save()
            .then(user => {
                req.logIn(newUser, function (err) {
                    if (!err){
                        req.session.user = newUser;
                        res.redirect(yo.options.get('authRedirect').value)
                    } else {
                        console.error(err);
                    }
                })
            }).catch(err => console.error(err));
    }).catch(err => console.error(err));
}

const defaultLogin = (yo, passport, req, res, next) => {
    let op = require('./options').deform(yo.options);

    let options =  {
        background: op.background,
        button_background: op.button_background,
        path: op.path
    }

    passport.authenticate("local", (err, theUser, failureDetails) => {

        if (err) {
            console.error(err);
            return next(err);
        }
      
        if (!theUser) {
            res.render(yo.options.get('loginFile').value, {...options, errorMessage: 'Invalid email or password.'}); 
            return;
        }
    
        req.logIn(theUser, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            
            res.redirect(yo.options.get('authRedirect').value);
        });
    })(req, res, next);
}

module.exports = {defaultSignup, defaultLogin}