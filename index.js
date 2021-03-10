const zip = require('adm-zip');
const superagent = require('superagent');
const fs = require('fs-extra');

async function deployCypressFolder(serviceBaseUrl, environmentName, options = {}) {
    const cypressPath = options.cypressPath ? options.cypressPath : './cypress';
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
    const groupName = options.groupName || _timeGroup();

    if (!app) {
        return { message: 'Cannot determine app name. Supply in options or use `npm run` so package.json is used.' };
    }

    const url = `${serviceBaseUrl}/tests/${environmentName}/${app}?group=${groupName}${noVideoParm}${noWaitParm}`;

    return await _getUrl(url);
}

async function startParallel(serviceBaseUrl, environmentName, options = {}) {
    const noWaitParm = '&noWait=1';
    return _invokeParallel(serviceBaseUrl, environmentName, options, noWaitParm);
}

async function runParallel(serviceBaseUrl, environmentName, options = {}) {
    const noWaitParm = '';
    return _invokeParallel(serviceBaseUrl, environmentName, options, noWaitParm);
}

async function _invokeParallel(serviceBaseUrl, environmentName, options = {}, noWaitParm) {
    const app = options.app || process.env.npm_package_name;
    const noVideo = options.noVideo || false;
    const noVideoParm = noVideo ? '&noVideo=1' : '';
    const pause = options.pause || 10000;
    const cypressPath = options.cypressPath || 'cypress';

    const groupName = options.groupName || _timeGroup();

    if (!app) {
        return { message: 'Cannot determine app name. Supply in options or use `npm run` so package.json is used.' };
    }

    const suitePath = `${cypressPath}/integration`;
    if (!fs.existsSync(suitePath)) {
        return { message: `${suitePath} not found` };
    }

    const folder = fs.readdirSync(suitePath);

    let result = [];
    let suitesCount = 0;
    let needPause = false;
    if (folder.length > 0) {
        for (let i = 0; i < folder.length; i++) {
            const item = folder[i];
            if (fs.statSync(suitePath + '/' + item).isDirectory()) {
                suitesCount++;
                if (needPause) {
                    await _sleep(pause);
                }
                const url = `${serviceBaseUrl}/tests/${environmentName}/${app}?suite=${item}&group=${groupName}${noVideoParm}${noWaitParm}`;
                result.push(await _getUrl(url));
                needPause = true;
            }
        }
        if (suitesCount === 0) {
            console.log('Did not find any folders!!!');
            return { message: `Did not find any folders under ${suitePath}` };
        }
    } else {
        return { message: `Did not find any items under ${suitePath}` };
    }
    return result;
}

async function _getUrl(url) {
    let result;
    try {
        result = await superagent.get(url);
    } catch (err) {
        console.log(err);
        const message = `Tried GET ${url} but failed. Is server up?`;
        console.log(`${message}`);
        return { message: message };
    }

    return result;
}

function _sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function _timeGroup() {
    const now = new Date();
    const time = _pad(now.getHours()) + '.' + _pad(now.getMinutes()) + '.' + _pad(now.getSeconds());
    const ms = now.getMilliseconds();
    return `${time}.${ms}`;
}

function _pad(str, pad = '00', padLeft = true) {
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
    startParallel,
};
