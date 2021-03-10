testRunParallel();

async function testRunParallel() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'dev';
    const app = 'cypress-frontend-app';

    options = {
        app: app,
        noVideo: true,
        groupName: 'MyGroup_' + Math.floor(Math.random() * 1000),
        startInterval: 5000,
        cypressPath: './test/cypress-frontend-app/cypress',
        resultWaitLoops: 60,
        resultWaitPause: 1000,
    };
    const result = await csc.runParallel(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
