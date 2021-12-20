import { Strategy } from 'passport-local';
import { compareSync } from 'bcrypt';

const init = (client, passport) => {
    let User = client._userModel;

    passport.serializeUser((user: any, cb: Function) => {
        cb(null, user._id);
    });
    passport.deserializeUser((id: any, cb: Function) => {
        User.findById(id)
            .then(user => cb(null, user))
            .catch(err => cb(err));
        });
      
        passport.use(new Strategy(
            {passReqToCallback: true, usernameField: 'email'},
            (...args) => {
                const [req,,, done] = args;
      
                const {email, password} = req.body;
      
                User.findOne({email})
                    .then(user => {
                        if (!user) return done(null, false, { message: "Invalid email or password." });
                        if (!compareSync(password, user.password)) return done(null, false, { message: "Invalid email or password." });
          
                        done(null, user);
                    })
                    .catch(err => done(err));
            }
      ));
}

export { init };