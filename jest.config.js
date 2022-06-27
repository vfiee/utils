module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      target: 'esnext',
      sourceMap: true
    }
  },
  setupFiles: ['jest-localstorage-mock'],
  // collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'text', 'html'],
  collectCoverageFrom: ['packages/**/**/*.ts'],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '@vyron/utils': '<rootDir>/packages/utils/src',
    '@vyron/storage': '<rootDir>/packages/storage/src',
    '@vyron/vhooks': '<rootDir>/packages/vhooks/src'
  },
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.ts'],
  testPathIgnorePatterns: ['/node_modules/']
}
