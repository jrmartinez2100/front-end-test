import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir:'./'
});

const customJestConfig = {
    setupFileAfterEnv:['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom'
};

module.exports = createJestConfig(customJestConfig);