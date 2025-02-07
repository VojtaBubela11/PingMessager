const childProcess = require("child_process");

class Command {
    constructor() {
        this.name = "pull";
        this.description = "Pull from branch";
        this.attributes = {
            unlisted: true,
            adminInclusive: ['1160426569156808734'],
            permission: 1,
        };
    }

    async invoke(message, args, util) {
        const shouldntAllow = util.request('preventRuntimeChanges');
        if (shouldntAllow) {
            message.reply('Variable `PREVENT_UPDATES` is set to true on this host.');
            return;
        }

        const repliedMessage = await message.reply('Pulling changes from the GitHub, please wait... <:juice:1158872031211831377>');
        childProcess.execSync("git pull origin main");
        if (args[0] === 'restart') {
            repliedMessage.edit('Updated! <:good:1118293837773807657>\nBot is restarting... <:juice:1158872031211831377>');
            setTimeout(() => {
                process.exit(50);
            }, 1000);
        } else {
            repliedMessage.edit('Updated! <:good:1118293837773807657>');
        }
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
