testRunParallel();

async function testRunParallel() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';
    options = {
        cypressPath: './test/cypress-backend-app/cypress',
        tag: 'deploy',
    };

    const result = await csc.runParallel(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
