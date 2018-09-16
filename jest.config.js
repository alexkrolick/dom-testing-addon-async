const jestConfig = require("kcd-scripts/jest");

module.exports = Object.assign(jestConfig, {
  testEnvironment: "jest-environment-jsdom",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
      files: 100,
    },
  },
});
