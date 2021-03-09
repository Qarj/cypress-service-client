# cypress-service-client

Helper to simplify deploying Cypress tests to cypress-service.

Also can trigger the tests to run in serial or parallel.

## Install

```
npm install cypress-service-client
```

## deployCypressFolder(serviceBaseUrl, environmentName, options)

_Example 1_

The `name` and `version` will be read from your `package.json`.

Assuming your app name is `my-react-app` then in this example your `cypress/` folder will be zipped up and posted to http://localhost:3950/tests/dev/my-react-app along with the associated `version`.

```js
const csc = require('cypress-service-client');

deployCypressTests();

async function deployCypressTests() {
    const serviceBaseUrl = 'http://localhost:3950';
    const result = await csc.deployCypressFolder(serviceBaseUrl, 'dev');
    console.log(result);
}
```

Since we are posting to `dev`, cypress-service will expect to find the cypress config file `cypress-dev.json` at `cypress/cypress-dev.json` from project root.

_Example 2_

Here the cypress path, app name and version are overridden by passing `options`.

```js
const csc = require('cypress-service-client');

deployCypressTests();

async function deployCypressTests() {
    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'prod';
    const app = 'react-app';
    const version = 'v1.2.4';

    options = {
        cypressPath: './tests/release/cypress/',
        app: app,
        version: version,
    };
    const result = await csc.deployCypressFolder(serviceBaseUrl, environmentName, options);
    console.log(result);
}
```
