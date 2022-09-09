const { expect } = require('@japa/expect');
const { apiClient } = require('@japa/api-client');
const { specReporter } = require('@japa/spec-reporter');
const { processCliArgs, configure, run } = require('@japa/runner');

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    // files: ['tests/**/*.spec.js'],
    plugins: [expect(), apiClient('http://localhost:3001')],
    reporters: [specReporter()],
    suites: [
      {
        name: 'unit',
        files: ['tests/unit/**/*.spec.js'],
      },
      {
        name: 'api',
        files: ['tests/api/**/*.spec.js'],
      }
    ],
    importer: (filePath) => require(filePath),
  },
});

run();
