const QuickReplyCommand = require("../../basecommands/quickreply");

class ScratchAuthCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "scratchauth";
        this.description = "ScratchAuth Quick Reply";
        this.message = "If you have errors logging in, it is most likely an issue on Scratch Auth's end. Scratch Auth is not affiliated with PenguinMod, however we are working on our own login method. Please note that this will take time, so please have patience. We apologize for the inconvenience.";
    }
}
class DesktopCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "desktop";
        this.description = "Desktop Quick Reply";
        this.message = "It's in development already. The application will allow you to use the home page & editor, open project files in your file explorer app, and get new updates or revert to a previous update.";
    }
}
class RankupCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "rankup";
        this.description = "Rankup Quick Reply";
        this.message = "The rank requirement is essential to making the website easier to moderate for us. We've seen custom extensions be exploited by new users very easily, so we want to slow that down. **To rank up, upload 3 projects or more and wait 5 days since you first logged in**, or skip those and earn a badge like getting your project featured, having a lot of likes on your project, or donating.";
    }
}
class LoadSB3Command extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "loadsb3";
        this.description = "Load .sb3 Quick Reply";
        this.message = "Want to load your TurboWarp or Scratch project into PenguinMod?\n"
            + "Try this tutorial! https://discord.com/channels/1033551490331197462/1181430242963902565";
    }
}
class CollabCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "collab";
        this.description = "Collab/Blocklive Quick Reply";
        this.message = "This is a cool idea, it really is. But we currently don't know if this would be possible to implement without tons of time or money. Please be patient with us on adding this.";
        this.alias = ["blocklive"];
    }
}
class CommentCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "comment";
        this.description = "Comment Quick Reply";
        this.message = "We are looking into this, but we are spending a lot of time looking for a good way to moderate the comments to make sure the platform is safe for all ages.";
    }
}
class StudioCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "studio";
        this.description = "Studio Quick Reply";
        this.message = "This would be nice to have, but we are currently busy updating the uploading server that handles projects to be a lot faster and better. Once this update is done, we may be able to add studios.";
    }
}
class ServerCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "server";
        this.description = "Server Quick Reply";
        this.message = "It's likely we are having some trouble with services connected to the server. Downtime will be mentioned in <#1040401867924062259> if major reasons are causing downtime.";
        this.alias = ["serverdown"];
    }
}
class SHCommand extends QuickReplyCommand {
    constructor() {
        super();
        this.name = "scratchhelp";
        this.description = "Scratch Help Quick Reply";
        this.message = "This server will not help you with scratch projects! Go to https://discord.gg/7gfPrhWwb2 instead.";
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = {
    scratchauth: ScratchAuthCommand,
    desktop: DesktopCommand,
    rankup: RankupCommand,
    loadsb3: LoadSB3Command,
    collab: CollabCommand,
    comment: CommentCommand,
    studio: StudioCommand,
    server: ServerCommand,
    scratchhelp: SHCommand
};