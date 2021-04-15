testStartSequential();

async function testStartSequential() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';
    const app = 'cypress-frontend-app';

    options = {
        app: app,
        noVideo: true,
        groupName: 'MyGroup_' + Math.floor(Math.random() * 1000),
        tag: '_deploy',
    };
    const result = await csc.startSequential(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
