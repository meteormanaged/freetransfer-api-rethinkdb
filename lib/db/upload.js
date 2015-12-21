const log = require('../utils/log').child({
  file: 'db/upload'
});

const db = require('./db');
const formidable = require('formidable');
const storagePath = require('path').dirname(require.main.filename) + '/storage';
const sendError = (err) => {
  'use strict';
  log.error(err);
  res.sendStatus(500);
};

const createRecord = files => {
  'use strict';
  let record = {
    path: files.upload.path,
    name: files.upload.name,
    type: files.upload.type,
    size: files.upload.size
  }
  return record;
};

const handleResult = (result, res) => {
  log.info({
    result: result
  }, `Saved metadata to DB.`);
  res.send({
    status: 200,
    key: result.generated_keys[0]
  });
};

const upload = (req, res) => {
  'use strict';
  log.info(`Received a request to upload file`);
  let form = new formidable.IncomingForm();
  form.uploadDir = storagePath;
  form.parse(req, (err, fields, files) => {
    if (err) {
      sendError(err);
      return false;
    }
    log.info({
      files
    }, `Saved file to local storage`);
    db.table('files').insert(createRecord(files)).run().then(result => {
      handleResult(result, res);
    }).error(sendError);
  });
};

module.exports = upload;
