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

async function startSequential(serviceBaseUrl, environmentName, options = {}) {
    const noWaitParm = '&noWait=1';
    return _invokeSequential(serviceBaseUrl, environmentName, options, noWaitParm);
}

async function runSequential(serviceBaseUrl, environmentName, options = {}) {
    const noWaitParm = '';
    return _invokeSequential(serviceBaseUrl, environmentName, options, noWaitParm);
}

async function _invokeSequential(serviceBaseUrl, environmentName, options = {}, noWaitParm) {
    const app = options.app || process.env.npm_package_name;
    const noVideo = options.noVideo || false;
    const noVideoParm = noVideo ? '&noVideo=1' : '';
    const groupName = options.groupName || timeGroup();

    if (!app) {
        return { message: 'Cannot determine app name. Supply in options or use `npm run` so package.json is used.' };
    }

    const getUrl = `${serviceBaseUrl}/tests/${environmentName}/${app}?group=${groupName}${noVideoParm}${noWaitParm}`;

    let result;
    try {
        result = await superagent.get(getUrl);
    } catch (err) {
        console.log(err);
        const message = `Tried GET ${getUrl} but failed. Is server up?`;
        console.log(`${message}`);
        return { message: message };
    }
    return result;
}

function timeGroup() {
    const now = new Date();
    const time = pad(now.getHours()) + '.' + pad(now.getMinutes()) + '.' + pad(now.getSeconds());
    const ms = now.getMilliseconds();
    return `${time}.${ms}`;
}

function pad(str, pad = '00', padLeft = true) {
    if (typeof str === 'undefined') return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}

module.exports = {
    deployCypressFolder,
    startSequential,
    runSequential,
};
