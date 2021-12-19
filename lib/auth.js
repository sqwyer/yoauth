const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const defaultSignup = (yo, req, res, next) => {

    let options = yo.options;

    let usernameField = yo.options['usernameField'];
    let customFieldsOptions = yo.options['signupCustomFields'];
    let customFields = {};

    for(let i = 0; i < customFieldsOptions.length; i++) {
        customFields[customFieldsOptions[i].name] = req.body[customFieldsOptions[i].name];
    }

    let query = {};
    let username = req.body[usernameField];
    let password = req.body.password;
    let User = yo._userModel;

    let fields = {
        username,
        password,
        ...customFields
    }

    for(let k in fields) {
        if(req.body[k] === "") {
            res.render(yo.options[('signupFile')], { ...options, errorMessage: "Must fill all fields." });
            return;
        }
    }

    if(usernameField == 'email' && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields["username"])) {
        res.render(yo.options['signupFile'], { ...options, errorMessage: "Must enter a valid email." });
        return;
    }

    if (password.split('').length < 8) {
        res.render(yo.options['signupFile'], { ...options, errorMessage: "Password must be at least 8 characters." });
        return;
    }

    query[usernameField] = req.body[usernameField];

    User.findOne(query)
        .then(user => {
        if (user) {
            res.render(yo.options['signupFile'], { ...options, errorMessage: "Email is already registered." });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

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
                        res.redirect(yo.options['authRedirect'])
                    } else {
                        console.error(err)
                    }
                })
            }).catch(err => console.error(err));
    }).catch(err => console.error(err));
}

const defaultLogin = (yo, passport, req, res, next) => {
    let options = yo.options;

    passport.authenticate("local", (err, theUser, failureDetails) => {

        if (err) {
            console.error(err);
            return next(err);
        }
      
        if (!theUser) {
            res.render(yo.options['loginFile'], {...options, errorMessage: 'Invalid email or password.'}); 
            return;
        }
    
        req.logIn(theUser, (err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            
            res.redirect(yo.options['authRedirect']);
        });
    })(req, res, next);
}

module.exports = {defaultSignup, defaultLogin}