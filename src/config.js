const env = require("./util/env-util");

// Seperated from .env since these are mostly cosmetic changes or big lists.
const configuration = {
    // Used in cases like "Welcome to the {NAME} server!" and "Do not post NSFW invites in the {NAME} server."
    nameReference: "Sprunki Pyramixed",

    // The bot has many auto responses, toggled using the RESPOND_TO_KEYWORDS env. They will only be usable in these channels:
    autoResponseChannels: [
        // These are the channels used in pyramix's server:
        // dont include things like bug reports or suggestions
        '1361858381802901667', // general
        '1361878790363680849', // commands
        '1368994959277035633', // server-test
    ],

    // Used to link to channels within the server. These IDs are the ones we use in PenguinMod.
    channels: {
        // A channel for PenguinBot testing and occasional logging.
        botTestingChannel: "1368994959277035633",

        // A channel dedicated to bot commands.
        commands: "1361878790363680849",

        // A channel dedicated to bot commands for developers.
        commandsDev: "1368995128018079775",

        // The channel where blocked automod alerts are sent. PenguinBot will send automod bypass alerts here too, if the basic_automod file is added.
        // See src/util/utility.js to see where basic_automod is used.
        automod: "1368995390808133746",
//        help: "1090809014343974972",
//        spaces: "1181097377730400287",
//        teamWanted: "1095867529169207416",
//        spam: "1040077506029551647",
    },

    permissions: {
        // Permission Level 1: A low permission level that isnt used much.
        permission1: [
            "1170911460948451438", // Bot Developer
        ],
        // Permission Level 2: Reserved for moderator commands.
        permission2: [
            "1161720252913168474", // Discord Mods
            "1173376969900052492", // Secondary Mods
        ],
        // Permission Level 3: Mostly developer commands.
        permission3: [
            "1038234739708006481", // Developer
            "1081053191602450552", // Retired Developer
        ],

        // User IDs that can always use donator commands:
        exclusiveUsers: [env.get("OWNER"), "462098932571308033"],

        // Role IDs considered "exclusive", so Server booster & Donator
        exclusiveRoles: [
            "1150383694842953778", // Donator
            "1102050296265445436", // Server Booster
        ],

        // On top of the permission check, who can use pm!eval (run custom code)
        eval: [env.get("OWNER"), "462098932571308033"],

        // On top of the permission check, who can use pm!echo
        echo: [env.get("OWNER"), "462098932571308033"],

        // On top of the permission check, who can use pm!delmsg
        delmsg: [env.get("OWNER"), "462098932571308033"],

        // On top of the permission check, who can use pm!penguinbotupload
        penguinbotupload: [env.get("OWNER"), "462098932571308033"],

        // Who can use "force" options in pm!exclusiverole
        exclusiveroleForce: [env.get("OWNER"), "462098932571308033"],
    },
};

module.exports = configuration;
