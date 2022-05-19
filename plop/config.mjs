import generators from './scripts/index.mjs'

function registerGenerators(setGenerator) {
  generators.forEach(({ name, config }) => setGenerator(name, config))
}

function init(plop) {
  registerGenerators(plop.setGenerator)
}

export default init
