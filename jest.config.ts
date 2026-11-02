export default {
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: [
    "_mock.ts",
    "stepsTestConstants.ts",
    "/node_modules/",
  ],
  moduleFileExtensions: ["ts", "tsx", "js"],
  globals: {
    window: true,
  },
  coveragePathIgnorePatterns: ["/node_modules/", "/test/"],
  coverageThreshold: {
    global: {
      branches: 92,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  collectCoverage: true,
};
