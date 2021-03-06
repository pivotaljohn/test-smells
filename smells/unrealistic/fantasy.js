/* Smell: Fantasy Tests
 *
 * Passing tests of code that wouldn't actually work in production
 */

// Subject under test
var authorizor = {
  roles: function (user, password) {
    if (authenticator.login({user: user, password: password})) {
      return ['admin', 'developer', 'manager']
    } else {
      return []
    }
  }
}

// Test
var td = require('testdouble')
module.exports = {
  beforeEach: function () {
    td.replace(authenticator, 'login')
  },
  allRolesIfAuthenticated: function () {
    td.when(authenticator.login({user: 'hi', password: 'bye'})).thenReturn(true)

    var result = authorizor.roles('hi', 'bye')

    assert.deepEqual(result, ['admin', 'developer', 'manager'])
  },
  noRolesIfNotAuthenticated: function () {
    td.when(authenticator.login({user: 'hi', password: 'no!'})).thenReturn(false)

    var result = authorizor.roles('hi', 'no!')

    assert.deepEqual(result, [])
  },
  afterEach: function () {
    td.reset()
  }
}

// Fake production implementations to simplify example test of subject
var authenticator = {
  login: function (credentials) {
    if (!credentials.password || !credentials['2fa']) {
      throw new Error('Both password and two-factor auth token are now required!')
    }
    return true
  }
}
