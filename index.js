const zip = require('adm-zip');
const superagent = require('superagent');

async function deployCypressFolder(serviceBaseUrl, environmentName, options = {}) {
    const cypressPath = options.cypressPath ? options.cypressPath : './cypress/';
    const app = options.app || process.env.npm_package_name;
    const version = options.version || process.env.npm_package_version;
    const postUrl = `${serviceBaseUrl}/tests/${environmentName}/${app}`;

    if (!app) {
        return { message: 'Cannot determine app name. Supply in options or use `npm run` so package.json is used.' };
    }

    if (!version) {
        return { message: 'Cannot determine version. Supply in options or use `npm run` so package.json is used.' };
    }

    var zipper = new zip();
    try {
        zipper.addLocalFolder(cypressPath);
    } catch (err) {
        console.log(err);
        const message = `Tried zipping folder ${cypressPath} but failed. Is that the right path?`;
        console.log(`${message}`);
        return { message: message };
    }
    let zipBuffer = zipper.toBuffer();

    let result;
    try {
        result = await superagent.post(postUrl).field('version', version).attach('uploadFile', zipBuffer, 'uploadFile.zip');
    } catch (err) {
        console.log(err);
        const message = `Tried posting to ${postUrl} but failed. Is server up?`;
        console.log(`${message}`);
        return { message: message };
    }
    return result;
}

module.exports = {
    deployCypressFolder,
};
