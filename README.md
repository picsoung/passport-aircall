# passport-aircall

[Passport](http://passportjs.org/) strategy for authenticating with [Aircall](https://www.aircall.io/)
using the OAuth 2.0 API.

This module lets you authenticate using Aircall in your Node.js applications.
By plugging into Passport, Aircall authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm install passport-aircall
```

## Usage

#### Create an Application

Before using `passport-aircall`, you must obtain OAuth credentation from Aircall.
If you don't have them yet, please follow [this step ](https://developer.aircall.io/tutorials/how-aircall-oauth-flow-works/#1-get-your-oauth-credentials)
of Aircall's tutorial.
Aircall's team will issue a `client_id` and `client_secret`,
which need to be provided to the strategy. You will also need to
configure a callback URL which matches a route in your application.

#### Configure Strategy

The Aircall authentication strategy authenticates companies using an Aircall account
and OAuth 2.0 tokens. The `client_id` and `client_secret` obtained before
are supplied as options when creating the strategy. The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated company's
Aircall profile. The `verify` callback must call `cb` providing a user to
complete authentication.

```js
var AircallStrategy = require('passport-aircall').Strategy;

passport.use(
  new AircallStrategy(
    {
      clientID: process.env.AIRCALL_CLIENT_ID,
      clientSecret: process.env.AIRCALL_CLIENT_SECRET,
      callbackURL: 'https://www.website.com/auth/aircall/callback',
      scope: ['public_api'] // 'public_api' is a mandatory scope
    },
    function(accessToken, refreshToken, profile, cb) {
      Company.findOrCreate({ name: profile.name }, function(err, company) {
        return cb(err, company);
      });
    }
  )
);
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'aircall'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/aircall', passport.authenticate('aircall'));

app.get(
  '/auth/aircall/callback',
  passport.authenticate('aircall', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
```

## Examples

Developers using the popular [Express](http://expressjs.com/) web framework can
refer to an [example](https://github.com/passport/express-4.x-facebook-example)
as a starting point for their own web applications. The example shows how to
authenticate users using Facebook. However, because both Facebook and Aircall
use OAuth 2.0, the code is similar. Simply replace references to Facebook with
corresponding references to Aircall.

## Contributing

#### Tests

The test suite is located in the `test/` directory. All new features are
expected to have corresponding test cases. Ensure that the complete test suite
passes by executing:

```bash
$ make test
```

#### Coverage

> Note: [Istanbul](https://github.com/gotwarlost/istanbul) package must be installed globally to run test coverage.

The test suite covers 100% of the code base. All new feature development is
expected to maintain that level. Coverage reports can be viewed by executing:

```bash
$ make test-cov
$ make view-cov
```

## License

[The MIT License](http://opensource.org/licenses/MIT)
