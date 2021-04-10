# cypress-service-client

Helper to simplify deploying Cypress tests to `cypress-service`. See https://github.com/Qarj/cypress-service

Also can trigger the tests to run in serial or parallel.

Check https://github.com/Qarj/cypress-frontend-app for a repo that uses this package.

## Install

```
npm install cypress-service-client
```

## deployCypressFolder(serviceBaseUrl, environmentName, options)

_Example 1_

The `name` and `version` will be read from your `package.json`.

Assuming your app name is `my-react-app` then in this example your `cypress` folder will be zipped up and posted to http://localhost:4567/test/dev/my-react-app along with the associated `version`.

```js
const csc = require('cypress-service-client');

deployCypressTests();

async function deployCypressTests() {
    const serviceBaseUrl = 'http://localhost:4567';
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
    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'prod';
    const app = 'react-app';
    const version = 'v1.2.4';

    options = {
        cypressPath: './test/release/cypress',
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
    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';

    const result = await csc.startSequential(serviceBaseUrl, environmentName);
    console.log(result);
}
```

Assuming your app is called `my-react-app`, a GET will be done to http://localhost:4567/test/dev/my-react-app?group=22.01.35.215&noWait=1

The group name is derived from the current time.

_Example 2_

Supply options to override defaults.

```js
const csc = require('cypress-service-client');

testStartSequential();

async function testStartSequential() {
    const serviceBaseUrl = 'http://localhost:4567';
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

A GET will be done to http://localhost:4567/test/dev/my-react-app?group=MyGroup_215&noVideo=1&noWait=1

The no video option tells cypress-service not to produce video files.

The group name you supply is a string but must be unique - cypress-service will not allow you to reuse the group name on any given day - for an app and environment combination.

## runSequential(serviceBaseUrl, environmentName, options)

`runSequential` is exactly the same as `startSequential` except for one thing - instead of kicking off the tests and returning immediately, `runSequential` waits until the tests have finished running and returns the test result from cypress-service.

## startParallel(serviceBaseUrl, environmentName, options)

Kicks off each Cypress suite of tests (a suite being defined as each folder directly under `cypress/integration`).

Each suite is kicked off without waiting for the test result. The cypress-service response for each kickoff is returned in an array.

By default there will be a `startInterval` of 10000 milliseconds between each suite kickoff - this is because Cypress tends to choke a bit when starting a suite until it gets underway.

_Example 1_

Using all defaults.

```js
const csc = require('cypress-service-client');

testStartParallel();

async function testStartParallel() {
    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';

    const result = await csc.startParallel(serviceBaseUrl, environmentName);
    console.log(result);
}
```

_Example 2_

In this example all the defaults are overriden.

```js
const csc = require('cypress-service-client');

testStartParallel();

async function testStartParallel() {
    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';
    const app = 'my-react-app';

    options = {
        app: app,
        noVideo: true,
        groupName: 'MyGroup_' + Math.floor(Math.random() * 1000),
        startInterval: 5000,
        cypressPath: './test/release/cypress',
    };
    const result = await csc.startParallel(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
```

## runParallel(serviceBaseUrl, environmentName, options)

Kicks off all tests to run in parallel but with a `startInterval` of 10000 milliseconds between each kickoff (Cypress chokes during test startup.)

By default `runParallel` will wait up to 10 minutes for some kind of definitive result before returning. A definitive result is either that all tests have passed, or at least one test has failed or crashed.

_Example 1_

```js
const csc = require('cypress-service-client');

testRunParallel();

async function testRunParallel() {
    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';

    const result = await csc.runParallel(serviceBaseUrl, environmentName, options);
    console.log(result);
}
```

_Example 2_

We can override the default options as shown here.

`resultWaitLoops` is the number of loops while waiting for a result, `resultWaitPause` is the sleep in milliseconds between each loop.

```js
const csc = require('cypress-service-client');

testRunParallel();

async function testRunParallel() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';
    const app = 'my-react-app';

    options = {
        app: app,
        noVideo: true,
        groupName: 'MyGroup_' + Math.floor(Math.random() * 1000),
        startInterval: 5000,
        cypressPath: './test/release/cypress',
        resultWaitLoops: 60,
        resultWaitPause: 10000,
    };
    const result = await csc.runParallel(serviceBaseUrl, environmentName, options);
    console.log(result);
}
```
