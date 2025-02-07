const petPetGif = require('pet-pet-gif');
const Discord = require("discord.js");
const OptionType = require('../util/optiontype');

class Command {
    constructor() {
        this.name = "pet";
        this.description = "make a pet pet gif";
        this.attributes = {
            unlisted: false,
            admin: false,
            lockedToCommands: true,
        };
        this.alias = ["petpet", "petgif"];
    }

    async invoke(message, _, util) {
        let userAvatarURL = message.author.displayAvatarURL({ format: 'png', size: 256 });

        // Check if a user is mentioned in the args
        const mention = message.mentions.users.first();
        if (util.interactionsBlocked(mention)) {
            if (mention.id !== message.author.id) return message.reply('The user you mentioned has interactions disabled.');
        }
        if (mention) {
            userAvatarURL = mention.displayAvatarURL({ format: 'png', size: 256 });
        }
        // check for attachment
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

        const animatedGif = await petPetGif(userAvatarURL)

        // Convert the canvas to a Discord attachment
        const attachment = new Discord.MessageAttachment(animatedGif, 'petpet.gif');
        
        // Send the image as a reply
        message.reply({ files: [attachment] });
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;

//mubi was here :3