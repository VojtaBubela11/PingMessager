class Command {
    constructor(client) {
        this.name = "eval";
        this.description = "admin";
        this.attributes = {
            unlisted: true,
            permission: 3,
        };

        this.alias = ["e"]
        this.client = client;
    }

    reject(message) {
        message.reply({
            files: ['./assets/randomImages/iknow.png']
        });
    }

    run(message, args, util) {
        if (message.author.id !== process.env.OWNER && message.author.id !== "462098932571308033") {
            this.reject(message);
            return;
        }

        this._lastMessage = message;
        this._alreadyReplied = false;

        let result = '';
        let failed = false;
        try {
            const command = args.join(' ');
            console.log('\n');
            console.log(`${message.author.username}:`);
            console.log(command);
            console.log('\n');
            result = eval(command);
        } catch (err) {
            result = String(err);
            failed = true;

            if (err.stack) {
                result = `${err.stack}`;
            }
        }
        message.reply(`${failed ? '❌ - epic fucking fail loser\n' : ''}\`\`\`${failed ? result : JSON.stringify(result)}\`\`\``);
    }
    invoke(message, args, util) {
        try {
            this.run(message, args, util);
        } catch (err) {
            message.reply('erm, error? 👉👈');
            console.log(err);
        }
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
