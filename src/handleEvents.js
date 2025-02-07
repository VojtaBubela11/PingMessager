const fs = require("fs");
const path = require("path");

const createEventsWithArgs = (client, isInTestMode, filePaths, folder, ...eventArgs) => {
    for (const file of filePaths) {
        const baseEvent = require(`./events/${folder}/${file}`);
        const event = new baseEvent(client);

        if (event.productionOnly && isInTestMode) continue;

        if (event.once) {
            client.once(event.listener, (...args) => event.invoke(...eventArgs, ...args));
        } else {
            client.on(event.listener, (...args) => event.invoke(...eventArgs, ...args));
        }
    }
};
const handleEvents = (client, botstate, isInTestMode) => {
    // each folder in the events folder will have different args passed to the event files within
    const eventFolder = fs.readdirSync(path.join(__dirname, `./events`));
    for (const folder of eventFolder) {
        const eventFiles = fs.readdirSync(path.join(__dirname, `./events/${folder}`))
            .filter(file => file.endsWith(`.js`));
        
        // this is where the event files in each folder are given their args
        switch (folder) {
            case "client":
                createEventsWithArgs(client, isInTestMode, eventFiles, folder, client, botstate);
                break;
            case "guilds":
                createEventsWithArgs(client, isInTestMode, eventFiles, folder, client);
                break;
        }
    }
};

module.exports = {
    handleEvents,
    createEventsWithArgs,
};