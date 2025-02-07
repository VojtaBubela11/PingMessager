const CommandUtility = require("../../util/utility.js");

const handleInviteBlock = require('../../util/inviteblock.js');
const handlePingMessage = require('../../util/pingmessage.js');
const handleBotAutoResponse = require('../../resources/responses/index.js');

// functions
const getBoolEnv = (env) => {
    const value = process.env[env];
    return String(value) === 'true';
};

const isInTestMode = process.argv[2] === 'test';
const prefix = isInTestMode ? process.env.PREFIX_TEST : process.env.PREFIX;

class BotEvent {
    constructor(client) {
        this.listener = "messageCreate";
        this.once = false;

        this.client = client;
    }

    async invoke(client, state, message) {
        // ignore bots
        if (!message.author) return;
        if (message.author.bot) return;
        if (message.author.system) return;
        if (message.system) return;
    
        // ignore #spam
        if (
            message.channel.id === '1040077506029551647'
            || (message.channel.parent && message.channel.parent.id === '1040077506029551647')
        ) return;
    
        // handle invites
        if (!isInTestMode && CommandUtility.containsInvite(message.content, {
            includeShorteners: true
        })) {
            handleInviteBlock(message, client, CommandUtility);
        }

        CommandUtility.state = state;
    
        // handle the case where they are not using a cmd but we can still do stuff
        if (!message.content.startsWith(prefix)) {
            // try ping message
            const canHandlePingMsg = !message.system && message.guild && message.mentions && message.mentions.members;
            if (canHandlePingMsg && !isInTestMode) {
                let replyingUser = null;
                if (message.reference && message.reference.messageId) {
                    let replyMessage;
                    try {
                        replyMessage = await message.channel.messages.fetch(message.reference.messageId);
                    } catch {
                        replyMessage = null;
                    }
                    if (replyMessage) {
                        replyingUser = replyMessage.author.id;
                    }
                }
                // if we are in a dm then it doesnt matter & we must actually have mentions stuff
                const didReturnVal = await handlePingMessage(message, replyingUser);
                if (didReturnVal === true) return; // dont check for auto response
            }
    
            // check for stuff we can reply to in a helpful way
            if (getBoolEnv('RESPONDTOKEYWORDS') && !isInTestMode) {
                handleBotAutoResponse(message);
            }
    
            return;
        }
    
        // handle cmds
        // this is perhaps a command
        const split = message.content.split(' ');
        split[0] = split[0].replace(prefix, '');
        if (!(split[0] in state.commands)) {
            message.reply({
                content: `Command not found. Did you mean something else?\nUse \`${prefix}help\` to see a list of commands.`,
                allowedMentions: {
                    parse: [],
                    users: [],
                    roles: [],
                    repliedUser: true
                }
            });
            return;
        }
    
        const commandName = split[0];
        const command = state.commands[commandName];
    
        const isBlocked = CommandUtility.handleCommandBlock(command, message, split);
        if (isBlocked) return;
    
        // remove the command name argument
        split.shift();

        // some commands can allow number conversion
        const convertNums = command.attributes.numberConversion === true;
        const args = convertNums ? split.map(argument => {
            if (isNaN(Number(argument))) {
                return String(argument);
            }
            return Number(argument);
        }) : split;
    
        // use command now
        try {
            /* client is passed so the command can send messages in arbitrary channels */
            await command.invoke(message, args, CommandUtility, client);
        } catch (err) {
            console.error(err);
            message.reply({
                content: `An unknown error occurred.\n${err}`,
                allowedMentions: {
                    parse: [],
                    users: [],
                    roles: [],
                    repliedUser: true
                }
            });
        }
    }
}

module.exports = BotEvent;