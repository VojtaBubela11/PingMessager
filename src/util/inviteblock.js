const Discord = require('discord.js');
const commandUtility = require("./utility.js");
const { default: axios } = require('axios');

const configuration = require("../config.js");
const env = require("./env-util.js");

/**
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 * @param {commandUtility} commandUtility
 */
module.exports = async (message, client, commandUtility) => {
    const isAllowedServer = message.guildId === env.get("SERVER_ID") ||
        (env.getBool("CHECK_FOR_DEFAULT_TEST_SERVERS") && message.guildId === "746156168560508950");
    if (!isAllowedServer) return;

    // ignore #team-wanted
    if (
        message.channel.id === configuration.channels.teamWanted
        || (message.channel.parent && message.channel.parent.id === configuration.channels.teamWanted)
    ) return;

    if (!message.content) return;
    if (!message.author) return;
    if (message.system) return;

    if (commandUtility.getPermissionLevel(message) >= 2) return;

    const containsDscGG = commandUtility.containsInviteShorteners(message.content);
    if (containsDscGG) {
        await message.delete();
        message.author.send(`:warning: **Discord Invite URL shorteners are not allowed in the ${configuration.nameReference} server.**`
            + `\nPlease use the original invite link instead.`);
        return;
    }

    const invites = commandUtility.extractInvites(message.content, {
        includeShorteners: false,
        inviteCodes: true
    });
    if (invites.length > 2) {
        await message.delete();
        message.author.send(`:warning: You sent too many invites in one message in the ${configuration.nameReference} server. Use less invites!`);
        return;
    }

    // TODO: Limit the amount of invites sent. If a user sends too many NSFW invites, its likely a hacked account and should be autobanned.
    const messageAuthorText = `<@${message.author.id}> (${message.author.id})`;
    const guildIsNSFW = async (inviteCode, guildName) => {
        const logChannel = client.channels.cache.get(configuration.channels.automod);
        const embed = new Discord.MessageEmbed();
        embed.setColor('RED');
        embed.setTitle('User sent NSFW server invite');
        embed.setFields([
            {
                name: 'Invite code',
                value: inviteCode || '(unknown)'
            },
            {
                name: 'Server name',
                value: guildName || '(unknown)'
            },
            {
                name: 'Member who sent invite',
                value: messageAuthorText
            }
        ]);
        embed.setFooter({ text: "Member has been timed out for 1 hour" });
        embed.setTimestamp(Date.now());
        await logChannel.send({
            embeds: [embed]
        });

        await message.delete();
        message.author.send(`:warning: **Do NOT send NSFW invite links in the ${configuration.nameReference} server.**`
            + `\nYou have been timed out for 1 hour. You may receive further punishment for posting NSFW invite links.`);

        try {
            message.member.timeout(60 * 60 * 1000, "Posting NSFW invites"); // 60 minutes
        } catch {
            console.error("Failed to timeout member for NSFW invite link", message.author.id)
        }
    };
    for (const inviteCode of invites) {
        try {
            const response = await axios.get(`https://discord.com/api/invites/${inviteCode}`);
            const guild = response.data.guild;
            const guildName = String(guild.name || '');

            // 1: EXPLICIT, 3: AGE_RESTRICTED
            const guildNSFW = guild.nsfw === true || guild.nsfw_level === 1 || guild.nsfw_level === 3;
            // NOTE: Maybe at some point we should add more words to this, 🤷‍♂️
            const nameIsUnsafe = !!(guildName.replace(/\s/g, '').match(/(18\+|penguinbot|nsfw|onlyfans|boobs|porn|hentai|momm|moms|dick|yiff|🔞|🍑|🍆)/i))
            if (guildNSFW || nameIsUnsafe) {
                return guildIsNSFW(inviteCode, guildName);
            }
        } catch {
            continue;
        }
    }
};