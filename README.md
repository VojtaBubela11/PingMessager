# PenguinBot-Public
A stripped-down public version of PenguinBot.
Certain features or commands may be missing from this repository.

If you want to restructure the codebase in any way and submit it as a PR, please note we may be very strict about it since we will have to make all of our future contributions under the format of your changes. Ideally, don't mess with how commands are defined but it's cool if you move around folders, modules, classes, or functions & such to reduce clutter.

# Notes
This bot was originally built to be a Private Bot for PenguinMod's Discord Server. If you have any issues relating to server, role, member, or channel specific features not working, this is likely why.

The bot uses many assets that cannot be released inside of this repo.

You can find them here:
https://drive.google.com/file/d/1ERrESIcINxj4AOZT9-DLqsd1MrFEKFDc/view?usp=sharing

Note that **fonts are not included** in this download.

For the most part, you need a good understanding of JavaScript and JSON to make commands or do anything meaningful with the code of this bot.

# License
The code found in this repository is licensed under the GNU General Public License v3.0 as required by some of the modules we use.
Please let us know if this is incorrect or invalid.

The `assets` folder is **NOT** under this license. Content in there may be licensed under, literally anything.

# Setup
1. Install Node.js, preferably v18 or v20
2. Install FFMPEG. Easiest way to check if it's setup properly is to run `ffmpeg` in a terminal with no arguments.
3. Install Git
4. Download the `assets` folder in the link found in the Notes section.
5. Create a `cache`, `databases`, `temp`, and `memes` folder in this folder. (the root folder for PenguinBot basically)
6. Install all of the node modules with `npm i --force` (package conflicts are not resolved yet)
    - If you have `nvm` installed to switch between Node installations, you may need to rebuild canvas every now and then with `npm rebuild canvas`
7. Duplicate `.env.template` and rename it to `.env`, then fill any of the information you can.
    - Certain keys are used only when the bot is ran with `npm run test`, notably the `TEST_TOKEN`.
8. Run the bot with `npm run test` for development and `npm start` or `node permrun.js` for production.
    - If you want to run the bot once in development, use `node src/index.js test`. This is not recommended for production as the bot can be restarted via commands.
    - When the bot is online, you can use the `restart` command in Discord to restart the bot.

# Basic Commands Template
```js
const OptionType = require('../util/optiontype');

class Command {
    constructor() {
        this.name = "base";
        this.description = "Description";
        this.attributes = {
            unlisted: true,
            permission: 3
        };
    }

    invoke(message) {

    }
}

// needs to do new Command() in index.js because typing static every time STINKS!
module.exports = Command;
```

# Signoffs
Have a good life! Don't ever think you can't do something, you always can when you're programming something.

- MubiLop | 08/02/2024
