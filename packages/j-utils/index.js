if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/j-utils.prod.cjs.js')
} else {
  module.exports = require('./dist/j-utils.cjs.js')
}
