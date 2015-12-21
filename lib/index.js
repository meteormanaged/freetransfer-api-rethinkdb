const log = require('./utils/log').child({
  file: 'lib/index'
});
const db = require('./db/index.js');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;


app.post('/upload', db.upload);
app.get('/retrieve/:key', db.retrieve)

const server = app.listen(PORT, () => {
  db._init(result => {
    log.info(`Listening on port ${server.address().port}.`);
  });
});

module.exports = server;
