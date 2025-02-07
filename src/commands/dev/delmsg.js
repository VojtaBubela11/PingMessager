class Command {
    constructor() {
        this.name = "delmsg";
        this.description = "you cant use it loser";
        this.attributes = {
            unlisted: true,
            permission: 2,
        };
    }

    reject(message) {
        message.reply({
            content: '<:haha:1124199185021927528>'
        });
    }

    extractMessageFromReply(message) {
        if (!(message.reference && message.reference.messageId)) {
            throw new Error('Message is not a reply');
        }
        const reply = message.reference.messageId;
        return message.channel.messages.fetch(reply);
    }
    async invoke(message, args) {
        if (message.author.id !== '462098932571308033') {
            this.reject(message);
            return;
        }

        if (message.reference && message.reference.messageId) {
            const replyMsg = await this.extractMessageFromReply(message);
            replyMsg.delete();
            return;
        }
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
