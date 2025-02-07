const fs = require('fs');
const path = require('path');

const isInTestMode = process.argv[2] === 'test';
if (isInTestMode) {
    console.log('Launched WEB PANEL in test mode');
}

const getBoolEnv = (env) => {
    const value = process.env[env];
    return String(value) === 'true';
};
const getNumberEnv = (env) => {
    const value = process.env[env];
    return Number(value);
};
const getEnv = (env) => {
    const value = process.env[env];
    return String(value);
};

const memesFolder = path.join(__dirname, '../../memes');

const handleDoAction = async (req, res, client, state) => {
    if (!req.body) return res.status(400).send("-1");
    if (req.body.username !== getEnv("WEB_PANEL_USERNAME")) return res.status(403).send("-1");
    if (req.body.password !== getEnv("WEB_PANEL_PASSWORD")) return res.status(403).send("-1");

    switch (req.body.action) {
        case 'validate':
            res.status(200).send('done');
            return;
        case 'restart': {
            res.status(200).send('restarting');

            const mainChannel = await client.channels.cache.get('1139749855913316474');
            await mainChannel.send({
                content: "Restart triggered from remote, please wait..."
            });
            process.exit(50);
            return;
        }
        case 'sendmsg': {
            const mainChannel = await client.channels.cache.get('1139749855913316474');
            await mainChannel.send({
                content: String(req.body.text)
            });

            res.status(200).json({ success: true });
            return;
        }
        case 'loadmemes': {
            const memeFiles = fs.readdirSync(memesFolder)
                .filter(file => !file.endsWith('Thumbs.db'));

            res.status(200).json(memeFiles);
            break;
        }
        case 'getmeme': {
            const sanitizedName = String(req.body.file).replace(/[\/\\]/g, '');
            res.status(200).sendFile(memesFolder + '/' + sanitizedName);
            break;
        }
        default:
            res.status(403).send("-1");
            return;
    }
};

module.exports = handleDoAction;
