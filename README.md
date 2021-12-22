# yoAuth
An easy to use authentication system that can easily be built in to your Express + HBS web apps. Currently only supports local authentication, however will hopefully support Google/Apple/Facebook/etc auth in the future.

> `npm i --save yoauth`

## Client
#### Creating a client
- Import the `Client` constructor from yoauth, then create an instance of it and pass in an object for the client options.
-   ```js
    // server.js
    const { Client } = require('yoauth');
    const client = new Client(require('./options.js').options); // Options = {...}

    const express = require('express');
    const app = express();

    client.configureServer(app);

    app.get('/', client.ensureAuth, (req, res) => {
        res.render('dashboard', {user: req.user});
    });

    app.listen(3000);
    ```

#### Client options
- **mongoUri:** (String) `required`: URI for connecting to MongoDB.
- **sessionSecret**: (String) `required`: Secret for express session.
- **path**: (String) `optional`: Router location of login/signup pages/files/routes.
    - **Default:**
    - ```js
      "/auth"
      ```
- **background**: (String) `optional`: Background for login/signup pages.
    - **Default:**
    - ```js
      "#F78D91"
      ```
- **buttonBackground**: (String) `optional`: Button background for login/signup pages.
    - **Default:**
    - ```js
      "#4664E9"
      ```
- **authRedirect**: (String) `optional`: Where the user is redirected when authorized.
    - **Default:**
    - ```js
        "/"
      ```
- **loginFile**: (Pathlike String) `optional`: Location of rendered file when logging in.
    - **Default:**
    - ```js
        `${__dirname}/../client/login.hbs` // note: This is relative to node_modules/yoauth/dist/client.ts
        ```
- **signupFile**: (Pathlike String) `optional`: Location of rendered file when registering.
    - **Default:**
    - ```js
        `${__dirname}/../client/signup.hbs` // note: This is relative to node_modules/yoauth/dist/client.ts
        ```
- **signupCustomFields**: (Array) `optional`: All custom fields that are rendered when registering.
    - **Default:**
    - ```js
        [{
            label: "Full Name",
            name: "fullname",
            type: "string",
            placeholder: "John Doe"
        }]```
- **userModel**: (Object) `optional`: The user model that will be created/searched when authorizing.
    - **Default:**
    - ```js
        {
            name: "user", // name passed to mongo.model(name, Schema, ...args)
            schema: new mongoose.Schema({
                email: String,
                fullname: String,
                password: String,
            }, {
                timestamps: true
            }), // schema passed to mongo.model(name, Schema, ...args)
            args: [] // args passed to mongo.model(name, Schema, ...args)
        }
      ```
- **mongoOptions**: (Object) `optional`: Options passed to `mongoose.createConnection(uri, options);`
    - **Default:**
    - ```js
      {}
      ```
- **signupCallback**: (Function) `optional`: Function executed on POST at `{path}/signup`
    - **Function Params:**
        - `req`: express.Request
        - `res`: express.Response
        - `options`: Object:
            - `auth`: yoauth.Client
    - **Default:** [See src/local/signup.ts](https://github.com/yoauth/yoauth/blob/main/src/auth/local/signup.ts)
- **loginCallback**: (Function) `optional`: Function executed on POST at `{path}/login`
    - **Function Params:**
        - `req`: express.Request
        - `res`: express.Response
        - `options`: Object:
            - `auth`: yoauth.Client
            - `passport`: passport
    - **Default:** [See src/local/login.ts](https://github.com/yoauth/yoauth/blob/main/src/auth/local/login.ts)