/**
 * Get the milliseconds for a time string.
 * Formatting is (number) followed by either w, d, h, m or s
 * @param {string} timestring ex: 1h30m10s
 * @returns {number} The milliseconds for the input timestring.
 */
const parseFormattedTime = (timestring) => {
    // filter is used since ideally we shouldnt check empty strings
    timestring = String(timestring).replace(/ /g, '')
    const times = timestring.toLowerCase().split(/[a-z]+/gmi).filter(value => value).map(value => Number(value));
    const units = timestring.toLowerCase().split(/[0-9]+/gmi).filter(value => value);
    let ms = 0;
    // loop through each
    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const unit = units[i];
        switch (unit) {
            case 'w':
                ms += 6.048e+8 * time;
                break;
            case 'd':
                ms += 8.64e+7 * time;
                break;
            case 'h':
                ms += 3600000 * time;
                break;
            case 'm':
                ms += 60000 * time;
                break;
            case 's':
                ms += 1000 * time;
                break;
        }
    }
    return ms;
};

/**
 * Format a millisecond number to a user friendly time output.
 * @param {number} milliseconds ex: 921110000
 * @returns {string} Timestring formatted like "1w 3d 15h 51m 50s"
 */
const formatTime = (milliseconds) => {
    milliseconds = Number(milliseconds);
    let seconds = Math.floor((milliseconds / 1000) % 60);
    let minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    let hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    let days = Math.floor((milliseconds / (1000 * 60 * 60 * 24)) % 7);
    let weeks = Math.floor((milliseconds / (1000 * 60 * 60 * 24 * 7)));

    const parts = [];
    if (weeks > 0) parts.push(`${weeks}w`);
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(' ');
};

module.exports = {
    parseFormattedTime,
    formatTime,
};