const CommandUtility = new (require("../../util/utility.js"))();

class BotEvent {
    constructor(client) {
        this.listener = "interactionCreate";
        this.once = false;

        this.client = client;
    }

    async invoke(client, state, interaction) {
        if (!interaction.isCommand()) return;
        const commandName = interaction.commandName;
        const command = state.commands[commandName];
        const commandConversion = state.slash[commandName];
    
        if (!command || !commandConversion) {
            return interaction.reply({
                content: 'This command is not supported for slash yet.',
                ephemeral: true
            });
        }
    
        // overwrite message functions for compat
        const fakeBlockedMessage = {};
        fakeBlockedMessage.reply = (textOrOptions) => {
            if (typeof textOrOptions === 'string') {
                interaction.reply({
                    content: textOrOptions,
                    ephemeral: true
                });
                return;
            }
            interaction.reply({
                ...textOrOptions,
                ephemeral: true
            });
        };
        fakeBlockedMessage.channel = interaction.channel;
        fakeBlockedMessage.guild = interaction.guild;
        fakeBlockedMessage.author = interaction.member.user;
        fakeBlockedMessage.member = interaction.member;
    
        // check if blocked
        const isBlocked = CommandUtility.handleCommandBlock(command, fakeBlockedMessage, []);
        if (isBlocked) return;
    
        const convertedInfo = await (commandConversion.bind(command))(interaction, CommandUtility, fakeBlockedMessage);
        if (convertedInfo === false) {
            return interaction.reply({
                content: 'This command is not supported for slash yet.',
                ephemeral: true
            });
        }
    
        // use converted info to invoke the command normally
        command.invoke(...convertedInfo);    
    }
}

module.exports = BotEvent;