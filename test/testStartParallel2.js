testStartParallel();

async function testStartParallel() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'dev';
    options = {
        cypressPath: './test/cypress-backend-app/cypress',
    };

    const result = await csc.startParallel(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
