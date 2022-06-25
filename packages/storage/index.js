if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/storage.prod.cjs.js')
} else {
  module.exports = require('./dist/storage.cjs.js')
}
