const { expect } = require('@japa/expect');
const { specReporter } = require('@japa/spec-reporter');
const { processCliArgs, configure, run } = require('@japa/runner');

configure({
  ...processCliArgs(process.argv.slice(2)),
  ...{
    files: ['tests/**/*.spec.js'],
    plugins: [expect()],
    reporters: [specReporter()],
    importer: (filePath) => require(filePath),
  },
});

run();
