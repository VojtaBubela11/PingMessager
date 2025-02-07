const { Permissions } = require('discord.js');

class Command {
    constructor() {
        this.name = "addemoji";
        this.description = "Add one or more emojis to the server.";
        this.attributes = {
            unlisted: true,
            adminInclusive: ['1160426569156808734'], // just to add economy emojis
            permission: 3
        };
    }

    invoke(message) {
        message.reply("no work");
    }
}

// why are the Template wrong wtf
module.exports = Command;