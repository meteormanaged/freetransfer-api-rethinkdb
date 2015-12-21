const log = require('../utils/log').child({
  file: 'db/retrieve'
});

const db = require('./db');
const fileSystem = require('fs')
const path = require('path');

const sendError = (err) => {
  'use strict';
  log.error(err);
  res.sendStatus(500);
};

const noFile = (req, res) => {
  'use strict';
  res.send({
    status: 200,
    info: 'Key does not exist.'
  });
  log.info(`Requested key that does not exist: ${req.params.key}`);
  return false;
};

const handleResult = (result, res) => {
  log.info({
    result: result
  }, `Result of retrieve`);
  res.writeHead(200, {
    'Content-Type': result.type,
    'Content-Length': result.size
  });

  var readStream = fileSystem.createReadStream(result.path);

  readStream.pipe(res);
// res.sendStatus(200);
}

const retrieve = (req, res) => {
  'use strict';
  db.table('files').get(req.params.key).run().then(result => {
    if (result === null) {
      noFile(req, res);
    } else {
      handleResult(result, res)
    }
  }).error(sendError);
};

module.exports = retrieve;
