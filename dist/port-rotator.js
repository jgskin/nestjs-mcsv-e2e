"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setStartingPort = exports.getNextPort = exports.LOCK_PATH = exports.CONFIG_PATH = void 0;
const fs = require("fs");
exports.CONFIG_PATH = process.env.NM_E2E_FILEPATH || './.nestjs-msvc-e2e';
exports.LOCK_PATH = exports.CONFIG_PATH + '.lock';
const waitTime = 100;
function lock(onAcquired, maxWaitTime = 1000) {
    if (maxWaitTime <= 0) {
        throw new Error('Timeout.');
    }
    if (fs.existsSync(exports.LOCK_PATH)) {
        setTimeout(() => lock(onAcquired, maxWaitTime - waitTime), waitTime);
        return;
    }
    fs.writeFileSync(exports.LOCK_PATH, '');
    onAcquired();
    fs.unlinkSync(exports.LOCK_PATH);
}
function getPortConfig() {
    if (!fs.existsSync(exports.CONFIG_PATH)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(exports.CONFIG_PATH).toString());
}
function getPort(context) {
    const config = getPortConfig();
    if (!config[context]) {
        throw new Error(`Use setStartingPort before running this.`);
    }
    return config[context];
}
function setPort(port, context = 'default') {
    const config = getPortConfig();
    config[context] = port;
    fs.writeFileSync(exports.CONFIG_PATH, JSON.stringify(config));
}
function getNextPort(context = 'default') {
    return new Promise((resolve, reject) => {
        try {
            lock(() => {
                const port = getPort(context);
                setPort(port + 1, context);
                resolve(port);
            });
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.getNextPort = getNextPort;
function setStartingPort(port, context = 'default') {
    if (fs.existsSync(exports.LOCK_PATH)) {
        fs.unlinkSync(exports.LOCK_PATH);
    }
    setPort(port, context);
}
exports.setStartingPort = setStartingPort;
//# sourceMappingURL=port-rotator.js.map