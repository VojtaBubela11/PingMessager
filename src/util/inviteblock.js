const Discord = require('discord.js');
const commandUtility = require("./utility.js");
const { default: axios } = require('axios');

/**
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 * @param {commandUtility} commandUtility
 */
module.exports = async (message, client, commandUtility) => {
    if (message.guildId !== '1033551490331197462') return;

    // ignore #team-wanted
    if (
        message.channel.id === '1095867529169207416'
        || (message.channel.parent && message.channel.parent.id === '1095867529169207416')
    ) return;

    if (!message.content) return;
    if (!message.author) return;
    if (message.system) return;

    if (commandUtility.getPermissionLevel(message) >= 2) return;

    const containsDscGG = commandUtility.containsInviteShorteners(message.content);
    if (containsDscGG) {
        await message.delete();
        message.channel.send(':warning: **Discord Invite URL shorteners are not allowed here.**'
            + `\nPlease use the original invite link instead <@${message.author.id}>.`);
        return;
    }

    const invites = commandUtility.extractInvites(message.content, {
        includeShorteners: false,
        inviteCodes: true
    });
    if (invites.length > 2) {
        await message.delete();
        message.channel.send(`:warning: Use less invites <@${message.author.id}>!`);
        return;
    }

    const messageAuthorText = `<@${message.author.id}> (${message.author.id})`;
    const guildIsNSFW = async (inviteCode, guildName) => {
        const logChannel = client.channels.cache.get('1174360726765305987');
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
        embed.setTimestamp(Date.now());
        await logChannel.send({
            embeds: [embed]
        });

        await message.delete();
        message.channel.send(`:warning: **Do NOT send NSFW invite links here <@${message.author.id}>!**`);
    };
    for (const inviteCode of invites) {
        try {
            const response = await axios.get(`https://discord.com/api/invites/${inviteCode}`);
            const guild = response.data.guild;
            const guildName = String(guild.name || '');

            // 1: EXPLICIT, 3: AGE_RESTRICTED
            const guildNSFW = guild.nsfw === true || guild.nsfw_level === 1 || guild.nsfw_level === 3;
            // NOTE: Maybe at some point we should add more words to this, 🤷‍♂️
            const nameIsUnsafe = !!(guildName.replace(/\s/g, '').match(/(18\+|nsfw|onlyfans|boobs|porn|hentai|momm|moms|dick|yiff|🔞|🍑|🍆)/i))
            if (guildNSFW || nameIsUnsafe) {
                return guildIsNSFW(inviteCode, guildName);
            }
        } catch {
            continue;
        }
    }
};