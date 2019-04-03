/**
 * `APIError` error.
 *
 * References:
 *   - https://developer.github.com/v3/#client-errors
 *
 * @constructor
 * @param {string} [error_code]
 * @param {string} [description]
 * @param {number} [code]
 * @access public
 */
function APIError (error_code, description) {
  Error.call(this)
  Error.captureStackTrace(this, arguments.callee)
  this.name = 'APIError'
  this.description = description
  this.error_code = error_code
  this.status = 500
}

// Inherit from `Error`.
APIError.prototype.__proto__ = Error.prototype

// Expose constructor.
module.exports = APIError
