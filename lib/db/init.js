const log = require('../utils/log').child({
  file: 'db/init'
});

const db = require('./db');

const sendError = (err) => {
  'use strict';
  log.error(err);
  res.sendStatus(500);
};

const createTable = (cb) => {
  'use strict';
  db.tableCreate('files').run().then(result => {
    log.info(`Created table.  Starting server.`)
    cb(result);
  }).error(sendError);
};

const checkTable = (cb) => {
  'use strict';
  db.tableList().run().then(result => {
    if (result.indexOf('files') === -1) {
      createTable(cb);
    } else {
      log.info(`Table found.  Starting server.`)
    }
  });
};

const createDatabase = (cb) => {
  'use strict';
  db.dbCreate('freetransfer').run().then(result => {
    log.info(`Created 'freetransfer' database.  Checking for table.`);
    checkTable(cb);
  }).error(sendError);
};

const _init = cb => {
  'use strict';
  db.dbList().run().then(result => {
    if (result.indexOf('freetransfer') === -1) {
      createDatabase(cb);
    } else {
      log.info(`Database found.  Checking for table.`);
      checkTable(cb);
    }
  });
};

module.exports = _init;
