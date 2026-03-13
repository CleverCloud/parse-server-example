# Parse Server Example on Clever Cloud
[![Clever Cloud - PaaS](https://img.shields.io/badge/Clever%20Cloud-PaaS-orange)](https://clever-cloud.com)

This is an example application that demonstrates how to run [Parse Server](https://github.com/parse-community/parse-server) on [Clever Cloud](https://clever-cloud.com/) with PostgreSQL, Redis and S3 (Cellar).

## About the Application

[Parse Server](https://parseplatform.org/) is an open-source Backend-as-a-Service (BaaS) framework. This example deploys it on Clever Cloud using:

- **PostgreSQL** for data persistence
- **Redis** for caching
- **Cellar (S3-compatible)** for file storage

### Endpoints

- `/parse` - Parse Server API endpoint

## Technology Stack

- [Parse Server 9](https://parseplatform.org/) - Open-source BaaS framework
- [Express.js 5](https://expressjs.com/) - Web framework for Node.js
- [Parse JS SDK 8](https://docs.parseplatform.org/js/guide/) - JavaScript SDK for Parse
- [@parse/s3-files-adapter](https://github.com/parse-community/parse-server-s3-adapter) - S3 file storage adapter
- Node.js 24+
- PostgreSQL
- Redis

## Prerequisites

- Node.js 24+
- npm

## Running the Application Locally

```bash
npm install
npm start
```

The application will be accessible at http://localhost:1337/parse.

> The application requires running PostgreSQL and Redis instances. Set the following environment variables:
> - `POSTGRESQL_ADDON_URI` - PostgreSQL connection string
> - `REDIS_URL` - Redis connection string
> - `CELLAR_BUCKET`, `CELLAR_ADDON_KEY_ID`, `CELLAR_ADDON_KEY_SECRET`, `CELLAR_ADDON_HOST` - S3/Cellar configuration
> - `PARSE_APP_ID`, `MASTER_KEY`, `JAVASCRIPT_KEY`, `SERVER_URL`, `APP_NAME` - Parse Server configuration

## Example Request

Once the server is running, you can create an object using the Parse REST API:

```bash
curl -X POST \
  -H "X-Parse-Application-Id: YOUR_APP_ID" \
  -H "X-Parse-JavaScript-Key: YOUR_JS_KEY" \
  -H "Content-Type: application/json" \
  -d '{"room":101,"guests":2,"nights":4}' \
  https://yourdomain.cleverapps.io/parse/classes/Booking
```

> Use `X-Parse-JavaScript-Key` for client requests. The master key is restricted to localhost (server-side cloud code only).

## Deploying on Clever Cloud

You have two options to deploy your application on Clever Cloud: using the Web Console or using the Clever Tools CLI.

### Option 1: Deploy using the Web Console

#### 1. Create an account on Clever Cloud

If you don't already have an account, go to the [Clever Cloud console](https://console.clever-cloud.com/) and follow the registration instructions.

#### 2. Set up your application on Clever Cloud

1. Log in to the [Clever Cloud console](https://console.clever-cloud.com/)
2. Click on "Create" and select "An application"
3. Choose "Node.js" as the runtime environment
4. Configure your application settings (name, region, etc.)

#### 3. Add Add-ons

1. In your application's dashboard, go to "Service dependencies"
2. Click "Link add-ons" and add:
   - **PostgreSQL** - Choose the plan that fits your needs
   - **Redis** - Choose the plan that fits your needs
   - **Cellar** - S3-compatible object storage for file uploads
3. Link all add-ons to your application

The `POSTGRESQL_ADDON_URI`, `REDIS_URL`, and Cellar environment variables will be automatically set.

#### 4. Configure Environment Variables

In your application's environment variables, set:

- `PARSE_APP_ID` - Your Parse application ID
- `MASTER_KEY` - Your Parse master key
- `JAVASCRIPT_KEY` - Your Parse JavaScript key
- `SERVER_URL` - Your Parse server URL (e.g., `https://yourdomain.cleverapps.io/parse`)
- `APP_NAME` - Your application name

#### 5. Deploy Your Application

You can deploy your application using Git:

```bash
# Add Clever Cloud as a remote repository
git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_<your-app-id>.git

# Push your code to deploy
git push clever master
```

### Option 2: Deploy using Clever Tools CLI

#### 1. Install Clever Tools

Install the Clever Tools CLI following the [official documentation](https://www.clever-cloud.com/doc/clever-tools/getting_started/):

```bash
# Using npm
npm install -g clever-tools

# Or using Homebrew (macOS)
brew install clever-tools
```

#### 2. Log in to your Clever Cloud account

```bash
clever login
```

#### 3. Create a new application with add-ons

```bash
# Initialize the current directory as a Clever Cloud application
clever create --type node <YOUR_APP_NAME>

# Add a PostgreSQL add-on
clever addon create postgresql-addon <YOUR_PG_ADDON_NAME> --link <YOUR_APP_NAME> --plan xs_sml

# Add a Redis add-on
clever addon create redis-addon <YOUR_REDIS_ADDON_NAME> --link <YOUR_APP_NAME>

# Add a Cellar add-on for file storage
clever addon create cellar-addon <YOUR_CELLAR_ADDON_NAME> --link <YOUR_APP_NAME>
```

#### 4. Configure environment variables

```bash
# Get the application domain (strip surrounding whitespace from clever domain output)

clever env set CELLAR_BUCKET yourBucket
clever env set PARSE_APP_ID yourParseAppId
clever env set SERVER_URL "https://$(clever domain | xargs)/parse"
clever env set MASTER_KEY yourMasterKey
clever env set JAVASCRIPT_KEY yourJSKey
clever env set APP_NAME yourAppName
```

#### 5. Deploy your application

```bash
clever deploy
```

#### 6. Open your application in a browser

Once deployed, you can access your application at the URL provided by Clever Cloud.

```bash
clever open
```

### Monitoring Your Application

Once deployed, you can monitor your application through:

- **Web Console**: The Clever Cloud console provides logs, metrics, and other tools to help you manage your application.
- **CLI**: Use `clever logs` to view application logs and `clever status` to check the status of your application.

## Additional Resources

- [Parse Server Documentation](https://docs.parseplatform.org/)
- [Parse Server GitHub](https://github.com/parse-community/parse-server)
- [Clever Cloud Node.js Documentation](https://www.clever-cloud.com/developers/doc/applications/nodejs/)
- [Clever Cloud Documentation](https://www.clever-cloud.com/doc/)
