testIsRunning();

async function testIsRunning() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';

    const result = await csc.isRunning(serviceBaseUrl, environmentName);
    console.log(result);
}
