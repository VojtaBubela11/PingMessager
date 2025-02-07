const discord = require("discord.js");

const FormatTime = require('../../util/format-time');
const OptionType = require('../../util/optiontype');

const ProjectApi = require("../../util/project-api");

const safeNumber = (num) => {
    const number = Number(num);
    if (isNaN(number)) return 0;
    return number;
};

class Command {
    constructor() {
        this.name = "project";
        this.description = "Get details about a project using it's ID or searching by name.";
        this.attributes = {
            unlisted: false,
            admin: false,
            lockedToCommands: true,
        };
        this.example = [
            { text: "pm!project z", image: "project_example1.png" }
        ];

        // remember, network usage
        this.cachedProjects = {};
    }

    handleProjectResponse(message, project) {
        // todo: run "notfound" if the author is not the message author (requires account linking)
        if (project === 'notfound') {
            return message.reply('No such project was found. Please ensure you typed it correctly.');
        }

        let extraFlags = [];
        const embed = new discord.MessageEmbed();
        embed.setTitle(project.name);

        // set color & extra flags
        embed.setColor("#00c3ff");
        if (project.remix) {
            extraFlags.push(`<:pm_play:1118916330272329839> [This project is a remix.](https://studio.penguinmod.com/#${project.remix})`);
            embed.setColor("#00ff00");
        }
        if (project.featured) {
            extraFlags.push('<:favorite:1158864719764017212> This project is featured!');
            embed.setColor("#ffcc00");
        }
        if (project.accepted === false) {
            extraFlags.push('<:pm_stop:1118916327680266240> This project is not approved. Be careful when playing it.');
            embed.setColor("#ff0000");
        }

        embed.setImage(`https://projects.penguinmod.com/api/pmWrapper/iconUrl?id=${project.id}`);

        const fullText = `${project.instructions}\n\n${project.notes}`;
        const fullTextToolong = fullText.length > 512;
        const description = fullTextToolong ? fullText.substring(0, 512 - 3) + '...' : fullText.substring(0, 512);
        embed.setDescription(extraFlags.length > 0 ? `${description}\n\n${extraFlags.map(value => (`**${value}**`)).join('\n')}` : description);
        embed.addFields([
            {
                name: "Stats",
                value: `❤️ ${safeNumber(project.loves)
                    } | ⭐ ${safeNumber(project.votes)
                    } | <:pm_play:1118916330272329839> ${safeNumber(project.views)
                    }`
            }
        ]);

        const numberDate = Number(project.date);
        const projectDate = `${new Date(numberDate).toDateString()} at ${new Date(numberDate).toLocaleTimeString()}`;
        embed.setFooter({
            text: projectDate
        });
        embed.setURL(`https://studio.penguinmod.com/#${project.id}`);

        message.reply({
            embeds: [embed]
        });
    }
    setCacheTimeout(id, ms) {
        setTimeout(() => {
            delete this.cachedProjects[id];
        }, ms);
    }

    /**
     * @param {string[]} args
     */
    invoke(message, args) {
        if (!args[0]) return message.reply('Please specify a project ID or Name.');

        const isSearchingForId =
            (args.length <= 1)
            && (args[0].charAt(0).match(/[0-9]/gmi));
        if (isSearchingForId) {
            const sanitizedId = String(args[0]).replace(/[^0-9]+/gmi, "");

            // check for cache
            if (this.cachedProjects[sanitizedId]) {
                return this.handleProjectResponse(message, this.cachedProjects[sanitizedId]);
            }
            ProjectApi.getProjectMeta(sanitizedId).then(data => {
                this.cachedProjects[sanitizedId] = data;
                this.setCacheTimeout(sanitizedId, FormatTime.parseFormattedTime('15m'));
                this.handleProjectResponse(message, data);
            }).catch(err => {
                message.reply('No such project with that ID exists.');
                console.error(err);
            });

            return;
        }

        // we are'nt doin that
        // do a search instead
        const searchQuery = args.join(' ');
        ProjectApi.searchProjects(searchQuery).then(projects => {
            if (projects.length <= 0) {
                message.reply('No projects fit the search query.');
                return;
            }

            const slice = projects.slice(0, 10);
            const names = slice.map(project => project.name);
            const channel = message.channel;

            message.reply(`Choose a project.\n${names.map((name, idx) => `**${idx + 1}.** ${name}`).join('\n')}\nType the number, or type \`random\` for a random one.`);
            channel.awaitMessages({
                filter: (filterMessage) => filterMessage.author.id === message.author.id,
                time: FormatTime.parseFormattedTime("2m"),
                max: 1
            }).then(collected => {
                const newMessage = collected.first();
                if (!newMessage) return;
                const index = newMessage.content.toLowerCase() === 'random' ?
                    Math.round(Math.random() * (slice.length - 1)) + 1
                    : Number(newMessage.content.replace(/[^0-9]+/gmi, ""));
                if (index <= 0) return;
                if (index > 10) return;
                if (isNaN(index)) return;
                // index is valid
                const project = slice[index - 1];
                const sanitizedId = String(project.id);
                // check for cache
                if (this.cachedProjects[sanitizedId]) {
                    return this.handleProjectResponse(message, this.cachedProjects[sanitizedId]);
                }
                // no cache
                ProjectApi.getProjectMeta(sanitizedId).then(data => {
                    this.cachedProjects[sanitizedId] = data;
                    this.setCacheTimeout(sanitizedId, FormatTime.parseFormattedTime('20m'));
                    this.handleProjectResponse(message, data);
                }).catch(err => {
                    message.reply('An unknown error occurred. Please try again later.');
                    console.error(err);
                });
            });
        }).catch(err => {
            message.reply('An error occurred. Please try again later.');
            console.error(err);
        });
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;