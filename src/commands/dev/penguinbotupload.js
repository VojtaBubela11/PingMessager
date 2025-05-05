const fs = require('fs');
const fetch = require("node-fetch");

const OptionType = require('../../util/optiontype');
const configuration = require("../../config");
const env = require("../../util/env-util");

const ProjectApi = require("../../util/project-api");

class Command {
    constructor() {
        this.name = "penguinbotupload";
        this.description = "you cant use it loser";
        this.attributes = {
            unlisted: true,
            permission: 3,
        };

        // TODO: should ProjectClient just be a central util?
        if (env.getBool("PENGUINMOD_USE_LOGIN")) {
            this.projectClient = new ProjectApi(env.get("PENGUINMOD_USERNAME"), env.get("PENGUINMOD_PASSWORD"));
        }
    }

    reject(message) {
        message.reply({
            content: 'roses are red, violets are blue, you cant use this command, and ill laugh at you <:haha:1124199185021927528>'
        });
    }

    async invoke(message, args) {
        if (!configuration.permissions.penguinbotupload.includes(message.author.id)) {
            this.reject(message);
            return;
        }

        if (!args[0]) return message.reply("Title is required");

        const attachment = message.attachments.at(0);
        const fileUrl = attachment.url;
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const base64url = Buffer.from(arrayBuffer).toString("base64url");

        const title = args.join(' ');
        const projectImage = fs.readFileSync("./favicon.png").toString("base64url");

        // TODO: this is entirely outdatedl mao
        ProjectClient.uploadProject({
            title: title,
            instructions: '',
            notes: '',
            image: `data:image/png;base64,${projectImage}`,
            project: `data:application/zip;base64,${base64url}`,
        })
            .then((id) => {
                message.channel.send(`Project "${title}" uploaded as https://projects.penguinmod.com/${id}`);
            })
            .catch(err => {
                console.error(err);
                message.channel.send(`Failed to upload "${title}": \`\`\`\n${err.stack ? err.stack : err}\n\`\`\``);
            });
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
