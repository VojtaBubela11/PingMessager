const Database = require('./easy-json-database');
const DisabledInteractionsDB = new Database('./databases/disabled-interactions.json');

const automodKeywords = require('../resources/basic_automod');

/**
 * @classdesc Meant to be a helper for common discord-related functions.
 * state is also included as it contains global info about the discord bot.
 */
class CommandUtility {
    static state = {};

    // used as a cleaner way to access values in the main bot process
    static request(value) {
        return this.state[value];
    }

    static getPermissionLevel(message) {
        if (message.member._roles.includes('1038234739708006481') || message.member._roles.includes('1081053191602450552')) return 3; // developers
        if (message.member._roles.includes('1161720252913168474') || message.member._roles.includes('1173376969900052492')) return 2; // mods
        if (message.member._roles.includes('1170911460948451438')) return 1; // mubi (bleh)
        return 0;
    }
    static isFromExclusive(message) {
        const isExclusive = message.member._roles.includes('1150383694842953778') // donator
            || message.member._roles.includes('1102050296265445436'); // server booster
        return isExclusive;
    }

    static getReply(message) {
        return new Promise((resolve) => {
            if (!(message.reference && message.reference.messageId)) {
                resolve(undefined);
                return;
            }
            const reply = message.reference.messageId;
            message.channel.messages.fetch(reply).then(repliedMessage => {
                resolve(repliedMessage);
            });
        });
    }
    static interactionsBlocked(userOrId) {
        if (!userOrId) return false;
        let id = userOrId;
        if (typeof id !== 'string') {
            id = userOrId.id;
        }
        if (!id || typeof id !== 'string') return false;
        const isBlocked = DisabledInteractionsDB.get(id);
        return isBlocked === true;
    }

    static automodAllows(text) {
        text = String(text)
            .toLowerCase()
            .replaceAll(' ', '')
            .replaceAll('\n', '')
            .replaceAll('\r', '');
        for (const keyword of automodKeywords) {
            if (text.includes(keyword)) {
                return false;
            }
        }
        return true;
    }

    static extractInviteShorteners(messageContent = '') {
        // this only matches invite shorteners, not discord.com, discord.gg, etc
        const shortenerRegex = /(https?:\/\/)(www\.)?(r\.)?(dsc\.gg\/?|dsc\.com\/invite)\/[^\s\/]+/gmi;

        const matches = messageContent.match(shortenerRegex);
        return matches || []; // no matches will return null
    }
    static containsInviteShorteners(messageContent = '') {
        const shorteners = this.extractInviteShorteners(messageContent);
        return shorteners.length > 0;
    }
    static extractInvites(messageContent = '', options = {
        includeShorteners: false,
        inviteCodes: false,
    }) {
        // includeShorteners will use shortenerRegex, which also matches dsc.gg and r.dsc.gg
        const nonShortenerRegex = /(https?:\/\/)?(www\.)?((discord\.(gg|io|me|li))|((discordapp|discord)\.com\/invite))(\/invite|)\/[^\s\/]+/gmi;
        const shortenerRegex = /(https?:\/\/)?(www\.)?(((r\.|)(discord|dsc)\.(gg|io|me|li))|((discordapp|discord|dsc)\.com\/invite))(\/invite|)\/[^\s\/]+/gmi;

        // no matches will return null
        const matches = messageContent.match(options.includeShorteners ? shortenerRegex : nonShortenerRegex) || [];
        return options.inviteCodes ? matches.map(url => url.split('/').pop()) : matches;
    }
    static containsInvite(messageContent = '', options = { includeShorteners: false }) {
        const invites = this.extractInvites(messageContent, options);
        return invites.length > 0;
    }

    static _commandBlockReject(command, message, split, reason) {
        if (typeof command.reject === "function") {
            command.reject(message, split, this);
        } else {
            message.reply(reason);
        }
    }
    static _inclusiveAllowsUser(userId, userRoles, requiredRoles) {
        const containsUser = requiredRoles.includes(userId);
        if (containsUser) return true;
        for (const userRole of userRoles) {
            if (requiredRoles.includes(userRole)) return true;
        }
        return false;
    }

    // Generic "cannot use this command" handler for use by text + slash commands. Returns true on blocked message.
    static handleCommandBlock(command, message, split) {
        let permission = command.attributes.permission;
        if (permission === undefined) {
            permission = 0;
            if (command.attributes.admin === true) permission = 3;
        }
        if (this.getPermissionLevel(message) < permission) {
            if (command.attributes.adminInclusive && this._inclusiveAllowsUser(message.author.id, message.member._roles, command.attributes.adminInclusive)) return;
            this._commandBlockReject(command, message, split, `You need a permission level of ${permission} to run this command, yours is currently ${this.getPermissionLevel(message)}.`);
            return true;
        }
        if (command.attributes.exclusive === true) {
            let canBeUsed = message.author.id === '462098932571308033';
            if (message.guild && message.guild.id === '1033551490331197462') {
                canBeUsed = canBeUsed || this.isFromExclusive(message);
            }
            // lmao
            if (command.attributes.exclusiveInclusive) {
                canBeUsed = canBeUsed || this._inclusiveAllowsUser(message.author.id, message.member._roles, command.attributes.exclusiveInclusive);
            }
            if (!canBeUsed) {
                this._commandBlockReject(command, message, split, "Only donators & server boosters can run this command.");
                return true;
            }
        }
        if (Array.isArray(command.attributes.lockedToChannels)) {
            // check which channel we are in
            const lockedChannels = command.attributes.lockedToChannels;
            const canBeUsed = lockedChannels.includes(message.channel.id);
            if (!canBeUsed) {
                this._commandBlockReject(command, message, split, `This command can only be used in these channels: ${lockedChannels.map(id => `<#${id}>`).join(', ')}`);
                return true;
            }
        }
        if (command.attributes.lockedToCommands === true) {
            // check which channel we are in
            let canBeUsed = true;
            if (message.guild && message.guild.id === '1033551490331197462') { // i have a test server so
                canBeUsed = message.channel.id === '1038251459843723274' // commands
                    || message.channel.parentId === '1038251459843723274' // in a thread in commands
                    || message.channel.id === '1174359501688803358' // dev-commands
                    || message.channel.parentId === '1174359501688803358' // in a thread in dev-commands
                    // private chats cause those are chill and dont need to be worried about
                    || message.channel.id === '1143305846227476511' // dev-github-logs
                    || message.channel.id === '1038251742439149661' // dev-chat
                    || message.channel.id === '1139749855913316474' // penguinbot-test
                    || message.channel.id === '1146290116583751681' // web-mod-chat
                    || message.channel.id === '1038252107846930513' // server-mod-chat
                    || message.channel.id === '1176024649390366780' // admin-chat
                    || message.channel.id === '1176024748300443698' // admin-furry-rp
                    || message.channel.id === '1126699478607470652';// mod-furry-rp
                if (command.attributes.unlockedChannels) {
                    // there are other conditions here
                    canBeUsed = canBeUsed
                        || command.attributes.unlockedChannels.includes(message.channel.id)
                        || command.attributes.unlockedChannels.includes(message.channel.parentId);
                }
            }
            if (!canBeUsed) {
                this._commandBlockReject(command, message, split, "This command can only be used in <#1038251459843723274>.");
                return true;
            }
        }
        if (command.attributes.lockedToHelp) {
            // check which channel we are in
            let canBeUsed = true;
            if (message.guild && message.guild.id === '1033551490331197462') { // jeremy has a test server ig
                canBeUsed = message.channel.parent.id === '1090809014343974972' // help
                    || message.channel.id === '1139749855913316474'; // penguinbot-test
                if (command.attributes.unlockedChannels) {
                    // there are other conditions here
                    canBeUsed = canBeUsed
                        || command.attributes.unlockedChannels.includes(message.channel.id)
                        || command.attributes.unlockedChannels.includes(message.channel.parent.id);
                }
            }
            if (!canBeUsed) {
                this._commandBlockReject(command, message, split, "This command can only be used in <#1090809014343974972>.");
                return true;
            }
        }
        if (command.attributes.spaceOwner === true) {
            // this command is locked to #spaces forum & the post's owner
            let canBeUsed = false;
            if (
                message.channel.parentId === '1181097377730400287'
                && message.channel.ownerId === message.author.id
            ) {
                canBeUsed = true;
            }
            if (!canBeUsed) {
                this._commandBlockReject(command, message, split, "This command can only be used in <#1181097377730400287> that you have created.");
                return true;
            }
        }
        return false;
    }
}

module.exports = CommandUtility;
