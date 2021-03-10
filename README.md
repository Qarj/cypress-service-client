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

## startSequential(serviceBaseUrl, environmentName, options)

Starts running all tests for the app and environment to run one by one sequentially without waiting for the result.

_Example 1_

The `name` and `version` will be read from your `package.json`.

```js
const csc = require('cypress-service-client');

testStartSequential();

async function testStartSequential() {
    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'dev';

    const result = await csc.startSequential(serviceBaseUrl, environmentName);
    console.log(result);
}
```

Assuming your app is called `my-react-app`, a GET will be done to http://localhost:3950/tests/dev/my-react-app?group=22.01.35.215&noWait=1

The group name is derived from the current time.

_Example 2_

Supply options to override defaults.

```js
const csc = require('cypress-service-client');

testStartSequential();

async function testStartSequential() {
    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'dev';
    const app = 'my-react-app';

    options = {
        app: app,
        noVideo: true,
        groupName: 'MyGroup_' + Math.floor(Math.random() * 1000),
    };
    const result = await csc.startSequential(serviceBaseUrl, environmentName, options);

    console.log(result);
}
```

A GET will be done to http://localhost:3950/tests/dev/my-react-app?group=MyGroup_215&noVideo=1&noWait=1

The no video option tells cypress-service not to produce video files.

The group name you supply is a string but must be unique - cypress-service will not allow you to reuse the group name on any given day - for an app and environment combination.

## runSequential(serviceBaseUrl, environmentName, options)

`runSequential` is exactly the same as `startSequential` except for one thing - instead of kicking off the tests and returning immediately, `runSequential` waits until the tests have finished running and returns the test result from cypress-service.
