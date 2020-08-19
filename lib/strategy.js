// Load modules.
var OAuth2Strategy = require('passport-oauth2'),
  util = require('util'),
  Profile = require('./profile'),
  InternalOAuthError = require('passport-oauth2').InternalOAuthError,
  APIError = require('./errors/apierror')

const fs = require('fs')
const path = require('path')
const API_VERSION = 'v1'

/**
 * `Strategy` constructor.
 *
 * The Aircall authentication strategy authenticates requests by delegating to
 * Aircall using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Aircall application's Client ID
 *   - `clientSecret`  your Aircall application's Client Secret
 *   - `callbackURL`   URL to which Aircall will redirect the user after granting authorization
 *   - `scope`         array of permission scopes to request. As of August 2020, valid scopes only include 'public_api'.
 *                     (see https://developer.aircall.io/api-references/#oauth-technology-partners for more info)
 *
 * Examples:
 *
 *     passport.use(new AircallStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/aircall/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user);
 *         });
 *       }
 *     ));
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy (options, verify) {
  options = options || {}

  options.authorizationURL =
    options.authorizationURL || 'https://dashboard-v2.aircall.io/oauth/authorize'
  options.tokenURL = options.tokenURL || 'https://api.aircall.io/v1/oauth/token'
  options.scopeSeparator = options.scopeSeparator || ' '
  options.customHeaders = options.customHeaders || {}

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] =
      options.userAgent || 'passport-aircall'
  }

  OAuth2Strategy.call(this, options, verify)

  this.name = 'aircall'
  this._userProfileURL = options.userProfileURL || 'https://api.aircall.io/v1/company'
  this.fetchProfile = options.fetchProfile
  this._oauth2.useAuthorizationHeaderforGET(true)

  this._scope = options.scope || []
  if (!this._scope.includes('public_api')) {
    this._scope = ['public_api'].concat(this._scope)
  }

  if (this.fetchProfile && !this._scope.includes('public_api')) {
    console.warn(
      "Scope 'public_api' is required to access Aircall API."
    )
  }
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy)

/**
 * Retrieve user profile from Aircall.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `aircall`
 *   - `alias`            the user's Aircall username
 *   - `email`            the user's email address
 *   - `language`         the user's language setting in Aircall
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data)
        } catch (_) {}
      }

      if (json && json.error) {
        return done(new APIError(json.error, json.error_description))
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err))
    }

    try {
      json = JSON.parse(body)
    } catch (ex) {
      return done(new Error('Failed to parse user profile'))
    }

    var profile = Profile.parse(json)

    profile.provider = 'aircall'
    profile._raw = body
    profile._json = json

    done(null, profile)
  })
}

// Expose constructor.
module.exports = Strategy
