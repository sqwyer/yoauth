const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const defaultSignup = (yo, req, res, next) => {
    let email = req.body.email;
    let fullname = req.body.fullname;
    let password = req.body.password;
    let User = yo.options.get('UserModel').value;

    let op = require('./options').deform(yo.options);

    let options =  {
        background: op.background,
        button_background: op.button_background,
        path: op.path
    }

    if (email === "" || password === "" || fullname === "") {
        res.render(`${__dirname}/../public/signup.hbs`, { ...options, errorMessage: "Must fill all fields." });
        return;
    }

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        res.render(`${__dirname}/../public/signup.hbs`, { ...options, errorMessage: "Must enter a valid email." });
    }

    if (password.split('').length < 8) {
        res.render(`${__dirname}/../public/signup.hbs`, { ...options, errorMessage: "Password must be at least 8 characters." });
        return;
    }

    User.findOne({ email })
        .then(user => {
        if (user) {
            res.render(`${__dirname}/../public/signup.hbs`, { ...options, errorMessage: "Email is already registered." });
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new User({
            email,
            fullName: fullname,
            password: hashPass
        });

        newUser.save()
            .then(user => {
                req.logIn(newUser, function (err) {
                    if (!err){
                        req.session.user = newUser;
                        res.redirect(yo.options.get('signupRedirect').value)
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
            res.render(`${__dirname}/../public/login.hbs`, {...options, errorMessage: 'Invalid email or password.'}); 
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