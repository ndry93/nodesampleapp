const { resolve } = require('path'); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/tests/**/*.test.ts'],
    moduleNameMapper: {
        '^src/(.*)$': resolve(__dirname, './src/$1')
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleDirectories: ['node_modules'],
    modulePathIgnorePatterns: ['directoryNameToIgnore'],
    collectCoverage: false, // only collect coverage on full test suite run (see package.json script)
    collectCoverageFrom: ['!src/**/index.ts', '!src/routes.ts', 'src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', 'dist/'],
    coverageReporters: ['json', 'json-summary', 'lcov', 'text', 'text-summary', 'html'],
    testEnvironment: 'node',
    verbose: true,
    setupFiles: ['./jest-setup.ts'],
    setupFilesAfterEnv: ['jest-extended'],
    globalSetup: './jest-global-setup.js'
};
