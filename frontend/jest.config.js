const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next/image$': '<rootDir>/src/test/mocks/nextImageMock.js',
    '^next/link$': '<rootDir>/src/test/mocks/nextLinkMock.js',
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/config/i18n.ts',
    '!src/config/locales/**',
  ],
};

module.exports = createJestConfig({
  ...customJestConfig,
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/', '/\.next/'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
});
