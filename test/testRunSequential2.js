testRunSequential();

async function testRunSequential() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'dev';

    const result = await csc.runSequential(serviceBaseUrl, environmentName);
    console.log(result);
    console.log('All done.');
}
