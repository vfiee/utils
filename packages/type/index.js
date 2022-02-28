if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/type.prod.cjs.js')
} else {
  module.exports = require('./dist/type.cjs.js')
}
