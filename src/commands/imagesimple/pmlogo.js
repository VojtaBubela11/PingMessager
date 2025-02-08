const { createCanvas, loadImage } = require('canvas');
const OptionType = require('../../util/optiontype');
const Discord = require('discord.js');

class Command {
    constructor() {
        this.name = "pmlogo";
        this.description = "Generate a photo with the Penguin Mod logo on top of the mentioned user's avatar or a custom background color.";
        this.attributes = {
            unlisted: false,
            admin: false,
            lockedToCommands: true,
        };
    }

    async invoke(message, _, util) {
        // Default values
        let userAvatarURL = message.author.displayAvatarURL({ format: 'png', size: 512 });

        // Check if a user is mentioned in the args
        const mention = message.mentions.users.first();
        if (util.interactionsBlocked(mention)) {
            if (mention.id !== message.author.id) return message.reply('The user you mentioned has interactions disabled.');
        }
        if (mention) {
            userAvatarURL = mention.displayAvatarURL({ format: 'png', size: 512 });
        }
        if ((message.attachments && message.attachments.size > 0)) {
            const attachment = message.attachments.at(0);
            try {
                const endingType = attachment.contentType.split(';')[0].split('/')[1];
                if (endingType !== 'png') {
                    throw new Error('invalid type');
                }
            } catch {
                return message.reply('Please use a valid image in `.png` format.');
            }
            const imageUrl = attachment.url;
            userAvatarURL = imageUrl;
        }

        // Load second image
        const secondImage = await loadImage('./assets/pm_transparent_dropshadow.png');

        // Create a 512x512 canvas
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');

        // Set the background color or draw user's avatar as the background
        const userAvatar = await loadImage(userAvatarURL);
        ctx.drawImage(userAvatar, 0, 0, 512, 512);

        // Draw the second image on top
        ctx.drawImage(secondImage, 0, 0, 512, 512);

        // Convert the canvas to a Discord attachment
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'you_pm.png');

        // Send the image as a reply
        message.reply({ files: [attachment] });
    }
}

module.exports = Command;
//mubi was here :3