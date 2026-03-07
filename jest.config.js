module.exports = {
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    testPathIgnorePatterns: ["/node_modules/"],
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/setup-jest.js"]
};
