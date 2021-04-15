testDeploy();

async function testDeploy() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:4567';
    const environmentName = 'dev';
    const app = 'cypress-frontend-app';
    const version = 'v1.2.4';

    options = {
        app: app,
        cypressPath: './test/cypress-frontend-app/cypress',
        version: version,
    };
    const result = await csc.deployCypressFolder(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
