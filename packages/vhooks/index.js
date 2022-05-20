if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/vhooks.prod.cjs.js')
} else {
  module.exports = require('./dist/vhooks.cjs.js')
}
