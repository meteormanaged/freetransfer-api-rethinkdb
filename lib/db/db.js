const log = require('../utils/log').child({
  file: 'lib/index'
});

const settings = require('../../settings.js').rethinkdb;
const db = require('rethinkdbdash')(settings);

module.exports = db;
