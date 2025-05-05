const tryCatch = (callback) => {
    try {
        return callback();
    } catch {
        return;
    }
};

module.exports = tryCatch;