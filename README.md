# yoAuth
An easy to use authentication system that can easily be built in to your Express + HBS web apps. Currently only supports local authentication, however will hopefully support Google/Apple/Facebook/etc auth in the future.

### Example
```env
# .env
SESSION_SECRET=(insert your session secret - can be anything)
MONGO_URI=(insert your personal mongo uri here)
```

```hbs
<!-- index.hbs -->

Hello, {{user.fullName}}
<form action="/auth/logout" method="POST">
    <button type="submit">Logout</button>
</form>
```

```js
// auth.js
const mongoose = require('mongoose');

const auth = new YoAuth({
    mongoUri: process.env.MONGO_URI,
    sessionSecret: 'tacocat',
    background: 'linear-gradient(115deg, rgba(247,141,145,1) 0%, rgba(66,189,210,1) 100%)',
    usernameField: "email",
    userModel: mongoose.model("User", new mongoose.Schema({
        email: String,
        fullname: String,
        age: Number,
        password: String
    }, {
        timestamps: true
    })),
    signupCustomFields: [
        {
            label: "Full Name",
            name: "fullname",
            type: "string",
            placeholder: "John Doe"
        },
        {
            label: "Age",
            name: "age",
            type: "number",
            placeholder: "Age"
        }
    ]
});

module.exports = auth;
```

```js
// index.js
require('dotenv').config();

const {YoAuth} = require('yoauth');

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const auth = require('./auth');

auth.configureServer(app, {
    auth,
    path: '/auth'
});

app.set('view engine', 'hbs');
app.get('/', auth.ensureAuth, function(req, res, next) {
    res.render(`${__dirname}/index.hbs`, {user: req.user});
});

app.listen(3000, e => {
    if(e) throw e;
    console.log('Running on PORT 3000');
});
```

You can now visit `http://localhost:3000/auth/signup` to register!