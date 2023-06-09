import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.ts?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/", "/dist/", "/examples/"],
  moduleFileExtensions: ["js", "ts"],
  collectCoverage: true,
  collectCoverageFrom: ["lib/**/*.ts", "!**/index.(t|j)s"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  coveragePathIgnorePatterns: ["/node_modules/", "/dist/", "/examples/"],
  coverageThreshold: {
    global: {
      branches: 100,
      statements: 100,
    },
  },
};

export default config;
