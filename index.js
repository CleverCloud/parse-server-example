var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var RedisCacheAdapter = require('parse-server').RedisCacheAdapter;
var redisURL = process.env.REDIS_URL || "redis://localhost:6379";
var redisOptions = {url: redisURL}
var redisCache = new RedisCacheAdapter(redisOptions);

var S3Adapter = require("@parse/s3-files-adapter");
var AWS = require("aws-sdk");

var s3Options = {
  bucket: process.env.CELLAR_BUCKET,
  s3overrides: {
    accessKeyId: process.env.CELLAR_ADDON_KEY_ID,
    secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET,
    endpoint: process.env.CELLAR_ADDON_HOST
  }
};

var s3Adapter = new S3Adapter(s3Options);

var postgresqlURI = process.env.POSTGRESQL_ADDON_URI;
postgresqlURI = postgresqlURI.slice(0, 8) + postgresqlURI.slice(10, postgresqlURI.length);

var config = {
  databaseURI: postgresqlURI,
  appId: process.env.PARSE_APP_ID || 'APPLICATION_ID',
  masterKey: process.env.MASTER_KEY || 'MASTER_KEY',
  appName: process.env.APP_NAME || "MyTest",
  cloud: process.env.CLOUD_FOLDER || "./cloud/main",
  serverURL: process.env.SERVER_URL || "http://localhost:1337/parse",
  logLevel: process.env.LOG_LEVEL || "info",
  javascriptKey : process.env.JAVASCRIPT_KEY || 'JAVASCRIPT_KEY',
  cacheAdapter: redisCache,
  filesAdapter: s3Adapter,
};
var api = new ParseServer(config);


var app = express();

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);
app.use('/public', express.static(path.join(__dirname, '/public')));
// Listen for connections on port 1337
var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

module.exports = {
  app,
  config,
};