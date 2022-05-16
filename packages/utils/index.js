if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/utils.prod.cjs.js')
} else {
  module.exports = require('./dist/utils.cjs.js')
}
