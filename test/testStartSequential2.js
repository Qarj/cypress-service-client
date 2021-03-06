testStartSequential();

async function testStartSequential() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';

    const result = await csc.startSequential(serviceBaseUrl, environmentName);
    console.log(result);
    console.log('All done.');
}
