const childProcess = require("child_process");

class Command {
    constructor() {
        this.name = "installmodule";
        this.description = "install modules";
        this.attributes = {
            unlisted: true,
            permission: 3,
        };
    }

    async invoke(message, args, util) {
        const shouldntAllow = util.request('preventRuntimeChanges');
        if (shouldntAllow) {
            message.reply('Variable `PREVENT_UPDATES` is set to true on this host.');
            return;
        }
        
        const repliedMessage = await message.reply(`Installing ${args[0] ? `\`\`${args.join(' ')}\`\`` : 'modules'}, please wait... <:juice:1158872031211831377>`);
        childProcess.execSync(`npm i ${args.join(' ')} --force`);
        childProcess.execSync('git commit -a -m "Update package.json"');
        childProcess.execSync('git push origin main');
        repliedMessage.edit('Updated! <:good:1118293837773807657>');
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;