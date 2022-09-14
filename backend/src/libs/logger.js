// maybe move this to its own component
const { date } = require('./formatters');
const log = message => console.log(`${date()} - ${message}`);

module.exports = { log };