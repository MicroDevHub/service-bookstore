/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts', 
    '!src/**/*.test.ts',
    '!src/app.ts',
    '!src/validations/**',
    '!src/config/**',
    '!src/interfaces/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};