const path = require('path');
const childProcess = require('child_process');

const env = require("./env-util");

// FYI, Canvas support is very rough with worker_threads for some reason. We use child_process to work around that.
const runNewThread = (workerSrc, commandSrc, serializableData) => {
    if (env.getBool("DISABLE_FORKING")) {
        console.log("forking disabled, creating fake fork of ", workerSrc);
        const runWorker = require(workerSrc);
        return runWorker({ workerSrc, commandSrc, ...serializableData });
    }

    return new Promise((resolve, reject) => {
        workerSrc = path.resolve(workerSrc);
        commandSrc = path.resolve(commandSrc);

        // We provide commandSrc so all command logic is still in the same file.
        const child = childProcess.fork(workerSrc);
        child.send({ workerSrc, commandSrc, ...serializableData });

        child.on('message', (message) => {
            if (message.success) return resolve();
            reject(message.error);
        });
        child.on('exit', (code) => {
            if (code === 0) return;
            reject(`Child process exited with code ${code}`);
        });
    });
};

module.exports = runNewThread;