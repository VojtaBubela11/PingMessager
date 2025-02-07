const { MessageEmbed } = require('discord.js');
const Sokoban = require('../../util/sokoban');
const db = require('../../util/sokobandb');

class BotEvent {
    constructor(client) {
        this.listener = "interactionCreate";
        this.once = false;

        this.client = client;
    }

    async invoke(client, state, interaction) {
        if (!interaction.isButton()) return;

        const userId = interaction.user.id;

        if (interaction.customId.includes("move_")) {
            try {
                const customEmojis = db.get(`${userId}_emojis`) || {
                    wall: ':red_square:',
                    player: ':flushed:',
                    empty: '⬛',
                    goal: '🎯',
                    box: '📦'
                };

                const gameState = db.get(userId);
                if (!gameState) return;

                const game = new Sokoban(gameState, customEmojis);
                const direction = interaction.customId.split('_')[1];
                let response = game.move(direction);

                if (game.isLevelCompleted()) {
                    game.levelNumber++;
                    game.generateNewLevel();
                    response = 'Level completed! Generating a new level...\n';
                    response += game.getLevelWithEmojis();
                }

                db.set(userId, game.serialize());

                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Level ${game.levelNumber} | Sokoban`)
                    .setDescription(response)
                    .setFooter('Use the buttons below to move');

                await interaction.update({ embeds: [embed] });
            } catch (error) {
                console.error('Error handling move interaction:', error);
                await interaction.reply({ content: 'There was an error processing your move.', ephemeral: true });
            }
        } else if (interaction.customId === "del") {
            try {
                const threadId = db.get(`${userId}_threadId`);
                if (threadId) {
                    const gameThread = await interaction.guild.channels.fetch(threadId);
                    if (gameThread) {
                        await gameThread.delete();
                    }
                }
                db.deleteLocal(userId);
                db.deleteLocal(`${userId}_gameMessageId`);
                db.deleteLocal(`${userId}_threadId`);
                db.saveDataToFile();
                await interaction.user.send('Your game has been deleted.');
                await interaction.reply({ content: 'Your game has been deleted.', ephemeral: true });
            } catch (error) {
                console.error('Error deleting game thread:', error);
                await interaction.reply({ content: 'There was an error deleting your game thread.', ephemeral: true });
            }
        }
    }
}

module.exports = BotEvent;