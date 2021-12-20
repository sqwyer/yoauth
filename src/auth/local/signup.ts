const bcryptSalt = 10;

import { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcrypt';
import { Request, Response } from 'express';

function signup(req: Request, res: Response, options: any) {
    let { auth } = options;
    let fields: any = {};
    let User: Model<any> = auth._userModel;

    for(let k in req.body) {

        if(req.body[k] === '') {
            res.render(auth.options.signupFile, {options: auth.options, errorMessage: "Must fill all fields."});
            return;
        }

        fields[k] = req.body[k];
    }

    if(fields.email != undefined && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)) {
        res.render(auth.options.signupFile, { options: auth.options, errorMessage: "Must enter a valid email." });
        return;
    }

    if (fields.password.split('').length < 8) {
        res.render(auth.options.signupFile, { options: auth.options, errorMessage: "Password must be at least 8 characters." });
        return;
    }

    User.findOne({email: fields.email})
        .then((user: any) => {
            if(user) {
                res.render(auth.options.signupFile, { options: auth.options, errorMessage: "Email is already registered." });
                return;
            }

            let salt = genSaltSync(bcryptSalt);
            let hash = hashSync(fields.password, salt);

            fields.password = undefined;

            let newUser = new User({
                ...fields,
                password: hash
            });

            newUser.save()
                .then(() => {
                    req.logIn(newUser, (err: any) => {
                        if(!err) res.redirect(auth.options.authRedirect);
                        else {
                            res.render(auth.options.signupFile, {options: auth.options, errorMessage: "Internal error."});
                            console.error(err);
                        }
                    })
                })
                .catch((err: any) => {
                    res.render(auth.options.signupFile, {options: auth.options, errorMessage: "Internal error."});
                    console.error(err);
                })
        }).catch((err: any) => {
            res.render(auth.options.signupFile, {options: auth.options, errorMessage: "Internal error."});
            console.error(err);
        });
}

export { signup };