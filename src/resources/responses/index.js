const fs = require('fs');
const path = require("path");

const responses = [];
const files = fs.readdirSync(path.join(__dirname, '..', 'responses'));
for (const file of files) {
    if (file === 'index.js') continue;
    if (file === 'custom') continue;
    const data = require(`./${file}`);
    for (const check of data.terms) {
        responses.push({
            check,
            data: data.message
        });
    }
}

// dont include things like bug reports or suggestions
const autoResponseChannels = [
    '1038238583686967428',
    '1161202733269930075',
    '1052023660594081862',
    '1038236110335266907',
    '1038251459843723274',
    '1038261660164563044',
    '1159749391628902410',
    '1164835671152803860',
    '1161439112096665711',
    '1165775549751361616',
    '1139749855913316474',
];

module.exports = (message) => {
    const content = String(message.cleanContent).toLowerCase().replace(/[ \n\t',.!?]+/gmi, '');
    if (!autoResponseChannels.includes(message.channel.id)) {
        return;
    }
    for (const { check, data } of responses) {
        if (content.includes(check)) {
            let msg = data.message ?? data;
            // custom responses (for example run actions on the message after responding)
            if (data.custom) {
                const module = require(`./custom/${data.custom}.js`);
                module(message);
                return;
            }
            if (data.oneof) {
                const random = Math.floor(Math.random() * data.messages.length);
                msg = data.messages[random];
            }
            if (data.onlyfiles) {
                msg = { files: [msg] };
            }
            message.reply(msg);
            return true;
        }
    }
}