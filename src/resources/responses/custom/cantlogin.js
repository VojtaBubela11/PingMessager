const axios = require('axios');

const statusChannelId = "1040401867924062259";

const responses = {
    unknown: "Our servers are probably down right now.",
    up: "Our servers seem to be online right now. It's possible something else may be wrong.",
    slow: "Our server seems to be unstable or slow at the moment.",
};
let currentResponse = responses.unknown;

const intervalTime = 60000; // 60 secs
const intervalCallback = async () => {
    const startTime = Date.now();
    try {
        const response = await axios.get('https://projects.penguinmod.com/api/v1');
        const currentTime = Date.now();
        const amountOfTime = currentTime - startTime;
        currentResponse = responses.unknown;
        if (response.status === 200) {
            currentResponse = responses.up;
            if (amountOfTime > 2500) {
                currentResponse = responses.slow
            }
        }
    } catch {
        currentResponse = responses.unknown;
    }
};
setInterval(intervalCallback, intervalTime);
intervalCallback();

const invoke = (message) => {
    message.reply("Can't sign in or upload projects? "
        + `${currentResponse}\n`
        + `Make sure to check <#${statusChannelId}> for PenguinMod server status updates.`);
};

module.exports = invoke;