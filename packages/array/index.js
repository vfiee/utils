if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/array.prod.cjs.js')
} else {
  module.exports = require('./dist/array.cjs.js')
}
