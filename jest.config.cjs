const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

module.exports = createJestConfig({
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    transformIgnorePatterns: [
        'node_modules/(?!(next-intl|@next-intl)/)',
    ],
});
