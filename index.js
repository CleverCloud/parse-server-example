const express = require('express');
const { ParseServer } = require('parse-server');
const path = require('path');
const S3Adapter = require('@parse/s3-files-adapter');

const s3Adapter = new S3Adapter({
  bucket: process.env.CELLAR_BUCKET,
  s3overrides: {
    credentials: {
      accessKeyId: process.env.CELLAR_ADDON_KEY_ID,
      secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET,
    },
    endpoint: process.env.CELLAR_ADDON_HOST,
    forcePathStyle: true,
  },
});

// Remove the "//" from the URI scheme (postgres:// → postgres:)
// to match the format expected by parse-server
const postgresqlURI = process.env.POSTGRESQL_ADDON_URI;
const databaseURI = postgresqlURI.slice(0, 8) + postgresqlURI.slice(10);

const config = {
  databaseURI,
  databaseOptions: {
    maxPoolSize: 5,
  },
  appId: process.env.PARSE_APP_ID || 'APPLICATION_ID',
  masterKey: process.env.MASTER_KEY || 'MASTER_KEY',
  appName: process.env.APP_NAME || 'MyApp',
  cloud: process.env.CLOUD_FOLDER || './cloud/main',
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
  logLevel: process.env.LOG_LEVEL || 'info',
  javascriptKey: process.env.JAVASCRIPT_KEY || 'JAVASCRIPT_KEY',
  masterKeyIps: ['127.0.0.1', '::1'],
  readOnlyMasterKeyIps: ['127.0.0.1', '::1'],
  allowClientClassCreation: true,
  fileUpload: {
    allowedFileUrlDomains: [],
  },
  pages: {
    encodePageParamHeaders: true,
  },
  filesAdapter: s3Adapter,
};

if (process.env.REDIS_URL) {
  config.cacheAdapter = {
    module: 'parse-server/lib/Adapters/Cache/RedisCacheAdapter',
    options: { url: process.env.REDIS_URL },
  };
}

const app = express();
app.use('/public', express.static(path.join(__dirname, '/public')));

const port = process.env.PORT || 1337;

async function main() {
  const parseServer = new ParseServer(config);
  await parseServer.start();
  app.use('/parse', parseServer.app);

  app.listen(port, () => {
    console.log(`parse-server running on port ${port}`);
  });
}

main();

module.exports = { app, config };
