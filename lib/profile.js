/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */

exports.parse = function (json) {
  if (typeof json === 'string') {
    json = JSON.parse(json)
  }

  var profile = {}
  profile.company_name = json.company.name
  // profile.email = json.email
  // profile.alias = json.alias

  return profile
}
