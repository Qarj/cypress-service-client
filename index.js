const zip = require('adm-zip');
const superagent = require('superagent');
const fs = require('fs-extra');

function _pad(str, pad = '00', padLeft = true) {
    if (typeof str === 'undefined') return pad;
    if (padLeft) {
        return (pad + str).slice(-pad.length);
    } else {
        return (str + pad).substring(0, pad.length);
    }
}

function _timeGroup() {
    const now = new Date();
    const time = _pad(now.getHours()) + '.' + _pad(now.getMinutes()) + '.' + _pad(now.getSeconds());
    const ms = now.getMilliseconds();
    return `${time}.${ms}`;
}

async function _getUrl(url) {
    let result;
    try {
        result = await superagent.get(url);
    } catch (err) {
        const message = `Tried GET ${url} but failed. Is server up?`;
        return { message: message };
    }

    return result;
}

async function _invokeSequential(serviceBaseUrl, environmentName, options = {}, noWaitParm) {
    const app = options.app || process.env.npm_package_name;
    const noVideo = options.noVideo || false;
    const noVideoParm = noVideo ? '&noVideo=1' : '';
    const tag = options.tag || '';
    let groupName = options.groupName || _timeGroup();
    groupName += tag;

    if (!app) {
        return {
            message: 'Cannot determine app name. Supply in options or use `npm run` so package.json is used.',
        };
    }

    const url = `${serviceBaseUrl}/test/${environmentName}/${app}?group=${groupName}${noVideoParm}${noWaitParm}`;

    return await _getUrl(url);
}

function _sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function _invokeParallel(serviceBaseUrl, environmentName, options = {}, noWaitParm) {
    const app = options.app || process.env.npm_package_name;
    const cypressPath = options.cypressPath || 'cypress';
    const noVideo = options.noVideo || false;
    const noVideoParm = noVideo ? '&noVideo=1' : '';
    const startInterval = options.startInterval || 10000;
    const tag = options.tag || '';

    let groupName = options.groupName || _timeGroup();
    groupName += tag;

    if (!app) {
        return {
            message: 'Cannot determine app name. Supply in options or use `npm run` so package.json is used.',
        };
    }

    const suitePath = `${cypressPath}/integration`;
    if (!fs.existsSync(suitePath)) {
        return { message: `${suitePath} not found` };
    }

    const folder = fs.readdirSync(suitePath);

    const result = [];
    let suitesCount = 0;
    let needPause = false;
    if (folder.length > 0) {
        for (let i = 0; i < folder.length; i++) {
            const item = folder[i];
            if (fs.statSync(suitePath + '/' + item).isDirectory()) {
                suitesCount++;
                if (needPause) {
                    await _sleep(startInterval);
                }
                const url = `${serviceBaseUrl}/test/${environmentName}/${app}?suite=${item}&group=${groupName}${noVideoParm}${noWaitParm}`;
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

async function deployCypressFolder(serviceBaseUrl, environmentName, options = {}) {
    const cypressPath = options.cypressPath ? options.cypressPath : './cypress';
    const app = options.app || process.env.npm_package_name;
    const version = options.version || process.env.npm_package_version;
    const postUrl = `${serviceBaseUrl}/test/${environmentName}/${app}`;

    if (!app) {
        return {
            message: 'Cannot determine app name. Supply in options or use `npm run` so package.json is used.',
        };
    }

    if (!version) {
        return {
            message: 'Cannot determine version. Supply in options or use `npm run` so package.json is used.',
        };
    }

    const zipper = new zip();
    try {
        zipper.addLocalFolder(cypressPath);
    } catch (err) {
        const message = `Tried zipping folder ${cypressPath} but failed. Is that the right path?`;
        return { message: message };
    }
    const zipBuffer = zipper.toBuffer();

    let result;
    try {
        result = await superagent.post(postUrl).field('version', version).attach('uploadFile', zipBuffer, 'uploadFile.zip');
    } catch (err) {
        const message = `Tried posting to ${postUrl} but failed. Is server up?`;
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

async function startParallel(serviceBaseUrl, environmentName, options = {}) {
    const noWaitParm = '&noWait=1';
    return _invokeParallel(serviceBaseUrl, environmentName, options, noWaitParm);
}

async function runParallel(serviceBaseUrl, environmentName, options = {}) {
    const noWaitParm = '&noWait=1';
    await _invokeParallel(serviceBaseUrl, environmentName, options, noWaitParm);

    const app = options.app || process.env.npm_package_name;
    const summaryUrl = `${serviceBaseUrl}/test/${environmentName}/${app}/summary`;
    const resultWaitLoops = options.resultWaitLoops || 60;
    const resultWaitPause = options.resultWaitPause || 10000;
    const urlMessage = ` Summary at ${summaryUrl} `;
    for (let i = 0; i < resultWaitLoops; i++) {
        await _sleep(resultWaitPause);
        const status = JSON.stringify(await _getUrl(summaryUrl));
        if (status.includes('All tests passed')) {
            return { message: `All tests passed.${urlMessage}` };
        }
        if (status.includes('Some tests failed')) {
            return { message: `Some tests failed.${urlMessage}` };
        }
        if (status.includes('There was a crash')) {
            return {
                message: `There was a crash preventing a test start.${urlMessage}`,
            };
        }
    }
    return {
        message: `Tests did not complete within 10 minutes of final test kick off. Check ${summaryUrl} for status.`,
    };
}

async function isRunning(serviceBaseUrl, environmentName, options = {}) {
    const app = options.app || process.env.npm_package_name;
    const statusUrl = `${serviceBaseUrl}/test/${environmentName}/${app}/status`;
    const status = JSON.stringify(await _getUrl(statusUrl));
    if (status.includes('Tests are running')) {
        return true;
    }
    return false;
}

module.exports = {
    deployCypressFolder,
    startSequential,
    runSequential,
    startParallel,
    runParallel,
    isRunning,
};
