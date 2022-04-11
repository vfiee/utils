module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      target: 'esnext',
      sourceMap: true
    }
  },
  // collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'html'],
  collectCoverageFrom: ['packages/**/**/*.ts', '!packages/v-utils/**'],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '@v-utils/type': '<rootDir>/packages/type/src',
    '@v-utils/array': '<rootDir>/packages/array/src'
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.ts'],
  testPathIgnorePatterns: ['/node_modules/']
}