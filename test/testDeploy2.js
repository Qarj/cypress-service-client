testDeploy();

async function testDeploy() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'dev';

    options = {
        cypressPath: './test/cypress-backend-app/cypress/',
    };
    await csc.deployCypressFolder(serviceBaseUrl, environmentName, options);
    const result = await csc.deployCypressFolder(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
