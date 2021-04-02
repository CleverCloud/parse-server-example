# Run parse-server on Clever Cloud

How to run the BaaS [parse-server](https://github.com/parse-community/parse-server) on [Clever CLoud](https://clever-cloud.com/).

This parse-server instance will be configured to use PostgreSQL, Redis and S3.

Assuming you have [clever-tools](https://www.clever-cloud.com/doc/getting-started/cli/) installed and configured:

```
git clone https://github.com/parse-community/parse-server
cd parse-server
clever create --type node myParseServer
clever addon create postgresql-addon --plan xs_sml --region par myParseServerPG
clever service link-addon myParseServerPG
clever addon create redis-addon --plan dev --region par myParseServerRedis
clever service link-addon myParseServerRedis
clever addon create cellar-addon --plan s --region par myParseServerCellar
clever service link-addon myParseServerCellar
# now would be a good time to open the cellar addon and create a bucket
clever env set CELLAR_BUCKET yourBucket
clever env set PARSE_APP_ID yourParseAppsId
clever published-config set PARSE_APP_ID yourParseAppsId
clever env set SERVER_URL https://yourdomain.cleverapps.io/parse
clever published-config set SERVER_URL https://yourdomain.cleverapps.io/parse
clever env set MASTER_KEY yourMasterKey
clever published-config set APP_MASTER_KEY yourMasterKey
clever env set JAVASCRIPT_KEY yourJSKey
clever env set APP_NAME yourAppName
clever published-config set PARSE_APP_NAME yourAppName
clever domain add yourdomain.cleverapps.io/parse
clever deploy
```



