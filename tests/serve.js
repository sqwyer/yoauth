const {YoAuth, router} = require('../.');

const express = require('express');
const app = express();

const yo = new YoAuth({
    // background: 'linear-gradient(115deg, rgba(247,141,145,1) 0%, rgba(66,189,210,1) 100%)',
    background: 'dodgerblue',
    button_background: 'dodgerblue',
    loginRedirect: '/'
});

router(app, yo, '/auth');

app.set('view engine', 'hbs');

app.get('/', yo.ensureAuth, function(req, res, next) {
    res.render(`${__dirname}/index.hbs`, {user: req.user});
});

app.listen(3000, e => {
    if(e) throw e;
    console.log('Running on PORT 3000');
});