const axios = require('axios');
const { MessageEmbed } = require("discord.js");
const OptionType = require('../../util/optiontype');

class Command {
    constructor() {
        this.name = "top5";
        this.description = "Gets all Top 5 Featured Projects.";
        this.attributes = {
            unlisted: false,
            admin: false,
        };
    }

    async invoke(message, args) {
        try {
          // Make a request to the API
          const response = await axios.get('https://projects.penguinmod.com/api/projects/max?amount=5&featured=true');
          
          // Process the data and create fields
          const fields = response.data.map(project => {
            return {
              name: project.name,
              value: `Creator: ${project.owner}\nViews: ${project.views}`,
              inline: false,
            };
          });
    
          // Build the message with the fields
          const embed = new MessageEmbed()
            .setTitle('Featured Projects')
            .addFields(fields)
            .setTimestamp();
    
          // Send the message with the projects
          message.reply({ content: "Here are some featured projects:", embeds: [embed] });
        } catch (error) {
          console.error('Error fetching projects:', error);
          message.reply('Sorry, there was an error fetching the projects.');
        }
    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
