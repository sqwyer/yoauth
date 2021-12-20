import { Request, Response } from 'express';

function login(req: Request, res: Response, options: any) {
    let {auth, passport} = options;

    passport.authenticate('local', (err?: any, user?: any) => {
        if(err) {
            res.render(auth.options.loginFile, {options: auth.options, errorMessage: 'Internal error.'});
            console.error(err);
            return;
        }

        if(!user) {
            res.render(auth.options.loginFile, {options: auth.options, errorMessage: 'Invalid email or password.'}); 
            return;
        }

        req.logIn(user, (err: any) => {
            if (err) {
                res.render(auth.options.loginFile, {options: auth.options, errorMessage: 'Internal error.'});
                console.error(err);
                return;
            }
            
            res.redirect(auth.options.authRedirect);
        });
    });
}

export { login };