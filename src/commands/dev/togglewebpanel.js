class Command {
    constructor() {
        this.name = "togglewebpanel";
        this.description = "Enable or disable the web panel. Provide a boolean if you don't want a toggle.";
        this.attributes = {
            unlisted: true,
            permission: 1,
        };
    }

    invoke(message, args, util) {
        if (!args[0]) {
            util.state.panelForcedDisabled = !util.state.panelForcedDisabled;
            message.reply(`Web Panel enabled = ${!util.state.panelForcedDisabled}`);
            return;
        }
        util.state.panelForcedDisabled = String(args[0]).toLowerCase().trim() !== 'true';
        message.reply(`Web Panel enabled = ${!util.state.panelForcedDisabled}`);
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;