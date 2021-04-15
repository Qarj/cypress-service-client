testStartParallel();

async function testStartParallel() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';
    const app = 'cypress-frontend-app';

    options = {
        app: app,
        cypressPath: './test/cypress-frontend-app/cypress',
        groupName: 'MyGroup_' + Math.floor(Math.random() * 1000),
        noVideo: true,
        startInterval: 5000,
        tag: '_deploy',
    };
    const result = await csc.startParallel(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
