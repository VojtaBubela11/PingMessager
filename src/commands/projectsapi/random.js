const axios = require('axios');
const { MessageEmbed } = require("discord.js");
const ProjectApi = require('../../util/project-api');
const OptionType = require('../../util/optiontype');

const safeNumber = (num) => {
    const number = Number(num);
    if (isNaN(number)) return 0;
    return number;
};
const unixToDisplayDate = (unix) => {
    unix = Number(unix);
    return `${new Date(unix).toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true
    })}`;
}

class Command {
    constructor() {
        this.name = "random";
        this.description = "Gets a random PenguinMod project.";
        this.attributes = {
            unlisted: false,
            admin: false,
            lockedToCommands: true,
        };
        this.slash = {
            options: []
        };
    }

    convertSlashCommand(interaction) {
        return [interaction];
    }

    async invoke(message) {
        const response = await axios.get('https://projects.penguinmod.com/api/projects/search?random=true');
        const project = await ProjectApi.getProjectMeta(response.data.id);

        const embed = new MessageEmbed()
            .setTitle(project.name)
            .setColor("#00c3ff")
            .setURL(`https://studio.penguinmod.com/#${project.id}`)
            .setImage(`https://projects.penguinmod.com/api/pmWrapper/iconUrl?id=${project.id}`);

        const extraFlags = [];
        if (project.remix) {
            extraFlags.push(`<:pm_play:1118916330272329839> [This project is a remix.](https://studio.penguinmod.com/#${project.remix})`);
            embed.setColor("#00ff00");
        }
        if (project.featured) {
            extraFlags.push('<:favorite:1158864719764017212> This project is featured!');
            embed.setColor("#ffcc00");
        }

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
        const projectDate = `${unixToDisplayDate(numberDate)}`;
        embed.setFooter({
            text: projectDate
        });

        message.reply({ embeds: [embed] });
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
