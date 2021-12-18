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
// index.js

const {YoAuth, router} = require('yoauth');

const express = require('express');
const app = express();

const yoAuth = new YoAuth({
    background: 'dodgerblue',
    button_background: 'dodgerblue',
    loginRedirect: '/'
});

router(app, yoAuth);

app.set('view engine', 'hbs');

app.get('/', yoAuth.ensureAuth, function(req, res, next) {
    res.render(`${__dirname}/index.hbs`, {user: req.user});
});

app.listen(3000, e => {
    if(e) throw e;
    console.log('Running on PORT 3000');
});
```

You can now visit `http://localhost:3000/yoauth/signup` to register!