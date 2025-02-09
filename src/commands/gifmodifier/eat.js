const GifModifierCommand = require('../../basecommands/gifmodifier');
const path = require("path");

// frameSet should align with eat_sheet.png
const frameSet = [
    { x: 0 , y: 0 , },
    { x: 1 , y: 0 , },
    { x: 2 , y: 0 , },
    { x: 3 , y: 0 , },
    { x: 4 , y: 0 , },
    { x: 5 , y: 0 , },
    { x: 6 , y: 0 , },
    { x: 7 , y: 0 , },
    { x: 0 , y: 1 , },
    { x: 1 , y: 1 , },
    { x: 2 , y: 1 , },
    { x: 3 , y: 1 , },
    { x: 4 , y: 1 , },
    { x: 5 , y: 1 , },
    { x: 6 , y: 1 , },
    { x: 7 , y: 1 , },
    { x: 0 , y: 2 , },
    { x: 1 , y: 2 , },
    { x: 2 , y: 2 , },
    { x: 3 , y: 2 , },
    { x: 4 , y: 2 , },
    { x: 5 , y: 2 , },
    { x: 6 , y: 2 , },
    { x: 7 , y: 2 , },
    { x: 0 , y: 3 , },
    { x: 1 , y: 3 , },
    { x: 2 , y: 3 , },
    { x: 3 , y: 3 , },
    { x: 4 , y: 3 , },
    { x: 5 , y: 3 , },
    { x: 6 , y: 3 , },
    { x: 7 , y: 3 , },
    { x: 0 , y: 4 , },
    { x: 1 , y: 4 , },
    { x: 2 , y: 4 , },
    { x: 3 , y: 4 , },
    { x: 4 , y: 4 , },
    { x: 5 , y: 4 , },
    { x: 6 , y: 4 , },
    { x: 7 , y: 4 , },
    { x: 0 , y: 5 , },
    { x: 1 , y: 5 , },
    { x: 2 , y: 5 , },
    { x: 3 , y: 5 , },
    { x: 4 , y: 5 , },
    { x: 5 , y: 5 , },
    { x: 6 , y: 5 , },
    { x: 7 , y: 5 , },
    { x: 0 , y: 6 , },
    { x: 1 , y: 6 , },
    { x: 2 , y: 6 , },
    { x: 3 , y: 6 , },
    { x: 4 , y: 6 , },
    { x: 5 , y: 6 , },
    { x: 6 , y: 6 , },
    { x: 7 , y: 6 , },
    { x: 0 , y: 7 , },
    { x: 1 , y: 7 , },
    { x: 2 , y: 7 , },
    { x: 3 , y: 7 , },
    { x: 4 , y: 7 , },
    { x: 5 , y: 7 , },
    { x: 6 , y: 7 , },
    { x: 7 , y: 7 , },
    { x: 0 , y: 8 , },
    { x: 1 , y: 8 , },
    { x: 2 , y: 8 , },
    { x: 3 , y: 8 , },
    { x: 4 , y: 8 , },
    { x: 5 , y: 8 , },
    { x: 6 , y: 8 , },
    { x: 7 , y: 8 , },
    { x: 0 , y: 9 , },
    { x: 1 , y: 9 , },
    { x: 2 , y: 9 , },
    { x: 3 , y: 9 , },
    { x: 4 , y: 9 , },
    { x: 5 , y: 9 , },
    { x: 6 , y: 9 , },
    { x: 7 , y: 9 , },
    { x: 0 , y: 10, },
    { x: 1 , y: 10, },
    { x: 2 , y: 10, },
    { x: 3 , y: 10, },
    { x: 4 , y: 10, },
    { x: 5 , y: 10, },
    { x: 6 , y: 10, },
    { x: 7 , y: 10, },
    { x: 0 , y: 11, },
    { x: 1 , y: 11, },
    { x: 2 , y: 11, },
    { x: 3 , y: 11, },
    { x: 4 , y: 11, },
    { x: 5 , y: 11, },
    { x: 6 , y: 11, },
    { x: 7 , y: 11, },
    { x: 0 , y: 12, },
    { x: 1 , y: 12, },
    { x: 2 , y: 12, },
    { x: 3 , y: 12, },
    { x: 4 , y: 12, },
    { x: 5 , y: 12, },
    { x: 6 , y: 12, },
    { x: 7 , y: 12, },
];

const drawImageWithBg = (ctx, image, x, y, w, h) => {
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, w, h);
    ctx.drawImage(image, x, y, w, h);
};

class Command extends GifModifierCommand {
    // NOTE: Constructor will be called as a new instance of this class is made when "initialize" happens.
    // New instances are made by the "Editing video" thread to reduce performance impact when running videomodifier commands.
    constructor() {
        super();
        this.name = "eat";
        this.description = "Makes a GIF of eating your image.";
        this.attributes = {
            unlisted: false,
            admin: false,
            lockedToCommands: true,
        };

        this.commandScript = path.join(__dirname, "./eat.js");
        this.requiresImage = true;

        this.frameSheetImage = null;
    }

    async initialize(Canvas) {
        this.frameSheetImage = await Canvas.loadImage('./assets/eat_sheet.png');
    }
    getGIFWidthHeight() {
        return [480, 270];
    }

    async drawGif(ctx, encoder, image, usingGif, width, height, args) {
        encoder.start();
        encoder.setRepeat(0); // 0 means "to repeat"
        encoder.setDelay(30); // 30ms delay in the original

        // rendering in 1.5x res because it looks better
        for (let i = 0; i < frameSet.length; i++) {
            const frame = frameSet[i];
            const xMult = 320; // width of each frame
            const yMult = 180; // height of each frame
            ctx.drawImage(this.frameSheetImage, frame.x * xMult, frame.y * yMult, xMult, yMult, 0, 0, 480, 270);

            if (i === 0) drawImageWithBg(ctx, image, 163, 172, 41, 40);
            if (i === 1) drawImageWithBg(ctx, image, 169, 163, 41, 40);
            if (i === 2) drawImageWithBg(ctx, image, 160, 136, 41, 40);
            if (i === 3) drawImageWithBg(ctx, image, 157, 128, 41, 40);
            if (i === 4) drawImageWithBg(ctx, image, 142, 116, 41, 40);
            if (i === 5) drawImageWithBg(ctx, image, 129, 117, 41, 40);
            if (i === 6) drawImageWithBg(ctx, image, 126, 120, 41, 40);
            if (i === 7) drawImageWithBg(ctx, image, 125, 128, 41, 40);

            if (i === 8) drawImageWithBg(ctx, image, 126, 133, 41, 40);
            if (i === 9) drawImageWithBg(ctx, image, 132, 133, 41, 40);
            if (i === 10) drawImageWithBg(ctx, image, 140, 130, 41, 40);
            if (i === 11) drawImageWithBg(ctx, image, 143, 127, 41, 40);
            if (i === 12) drawImageWithBg(ctx, image, 140, 127, 41, 40);
            if (i === 13) drawImageWithBg(ctx, image, 134, 132, 41, 40);
            if (i === 14) drawImageWithBg(ctx, image, 131, 137, 41, 40);
            if (i === 15) drawImageWithBg(ctx, image, 128, 142, 41, 40);

            if (i === 16) drawImageWithBg(ctx, image, 124, 149, 41, 40);
            if (i === 17) drawImageWithBg(ctx, image, 123, 158, 41, 40);
            if (i === 18) drawImageWithBg(ctx, image, 121, 165, 41, 40);
            if (i === 19) drawImageWithBg(ctx, image, 118, 173, 41, 40);
            if (i === 20) drawImageWithBg(ctx, image, 121, 184, 41, 40);
            if (i === 21) drawImageWithBg(ctx, image, 125, 194, 41, 40);
            if (i === 22) drawImageWithBg(ctx, image, 138, 201, 41, 40);
            if (i === 23) drawImageWithBg(ctx, image, 151, 206, 41, 40);

            if (i === 24) drawImageWithBg(ctx, image, 163, 210, 41, 40);
            if (i === 25) drawImageWithBg(ctx, image, 177, 207, 41, 40);
            if (i === 26) drawImageWithBg(ctx, image, 184, 204, 41, 40);
            if (i === 27) drawImageWithBg(ctx, image, 202, 192, 41, 40);
            if (i === 28) drawImageWithBg(ctx, image, 210, 178, 41, 40);
            if (i === 29) drawImageWithBg(ctx, image, 216, 167, 38, 36);
            if (i === 30) drawImageWithBg(ctx, image, 218, 158, 36, 31);
            if (i === 31) drawImageWithBg(ctx, image, 219, 149, 32, 31);

            if (i === 32) drawImageWithBg(ctx, image, 218, 138, 34, 32);
            if (i === 33) drawImageWithBg(ctx, image, 217, 135, 33, 29);
            if (i === 34) drawImageWithBg(ctx, image, 216, 132, 33, 30);
            if (i === 35) drawImageWithBg(ctx, image, 218, 132, 31, 28);
            if (i === 36) drawImageWithBg(ctx, image, 217, 132, 32, 28);
            if (i === 37) drawImageWithBg(ctx, image, 217, 132, 32, 28);
            if (i === 38) drawImageWithBg(ctx, image, 217, 132, 32, 28);
            if (i === 39) drawImageWithBg(ctx, image, 220, 130, 31, 28);

            if (i === 40) drawImageWithBg(ctx, image, 219, 131, 30, 25);
            if (i === 41) drawImageWithBg(ctx, image, 219, 131, 31, 25);
            if (i === 42) drawImageWithBg(ctx, image, 219, 131, 31, 25);
            if (i === 43) drawImageWithBg(ctx, image, 221, 130, 30, 21);
            if (i === 44) drawImageWithBg(ctx, image, 222, 131, 29, 20);
            if (i === 45) drawImageWithBg(ctx, image, 223, 131, 29, 16);
            if (i === 46) drawImageWithBg(ctx, image, 225, 132, 27, 11);
            if (i === 47) drawImageWithBg(ctx, image, 224, 131, 27, 12);

            if (i === 48) drawImageWithBg(ctx, image, 225, 134, 25, 7);
            if (i === 49) drawImageWithBg(ctx, image, 231, 133, 18, 5);
            
            encoder.addFrame(ctx);
        }
        
        encoder.finish();
        return encoder.out.getData();
    }
}

module.exports = Command;