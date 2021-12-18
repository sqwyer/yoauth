const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const init = (yo, passport) => {
    let User = yo.options.get('userModel').value;

    passport.serializeUser((user, cb) => {
        cb(null, user._id);
    });
    passport.deserializeUser((id, cb) => {
        User.findById(id)
            .then(user => cb(null, user))
            .catch(err => cb(err));
        });
      
        passport.use(new LocalStrategy(
            {passReqToCallback: true, usernameField:'email'},
            (...args) => {
                const [req,,, done] = args;
      
                const {email, password} = req.body;
      
                User.findOne({email})
                    .then(user => {
                        if (!user) return done(null, false, { message: "Invalid email or password." });
                        if (!bcrypt.compareSync(password, user.password)) return done(null, false, { message: "Invalid email or password." });
          
                        done(null, user);
                    })
                    .catch(err => done(err));
            }
      ));
}

module.exports = {init};