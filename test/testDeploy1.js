testDeploy();

async function testDeploy() {
    const csc = require('../index.js');

    const serviceBaseUrl = 'http://localhost:3950';
    const environmentName = 'dev';
    const app = 'cypress-frontend-app';
    const version = 'v1.2.4';

    options = {
        cypressPath: './test/cypress-frontend-app/cypress/',
        app: app,
        version: version,
    };
    const result = await csc.deployCypressFolder(serviceBaseUrl, environmentName, options);
    console.log(result);
    console.log('All done.');
}
