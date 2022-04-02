if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/v-utils.prod.cjs.js')
} else {
  module.exports = require('./dist/v-utils.cjs.js')
}
