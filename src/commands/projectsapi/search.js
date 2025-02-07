const ProjectApi = require("../../util/project-api");
const OptionType = require('../../util/optiontype');

class Command {
    constructor() {
        this.name = "search";
        this.description = "Search for projects. Max is 10.";
        this.attributes = {
            unlisted: true,
            permission: 1,
            lockedToCommands: true,
        };
    }

    invoke(message, args, util) {
        message.reply("not implemented");
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;