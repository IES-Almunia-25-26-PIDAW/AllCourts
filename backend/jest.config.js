module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/env.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/\.next/', '/src/db/migrations/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js', '**/test/**/*.test.js', '**/tests/**/*.test.js'],
};
