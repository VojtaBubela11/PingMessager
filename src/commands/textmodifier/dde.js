const TextModifierCommand = require('../../basecommands/textmodifier');

class Command extends TextModifierCommand {
    constructor(client) {
        super(client);
        this.name = "ddededodediamante";
        this.description = "Make your text ddededodediamantey!";
        this.textDescription = "Text to ddededodediamanteify.";
        this.example = [
            { text: "pm!ddededodediamante", image: "example1.png" },
            { text: "pm!ddededodediamante Hello my text is here" },
            { text: "pm!ddededodediamante (replying to a message)" },
        ];
        this.setSlashDetail();
    }

    /**
     * Transform the input text.
     * @param {string} text 
     * @returns {string}
     */
    modify(text) {
        function transformWordy(word) {
            if (word === 'diamante') return 'ddededodediamante';
            else if (word === 'joe') return 'jujujujujoe';
            else if (word.length < 4) return word;

            const firstLetter = word[0];
            let firstVar = '';
            let secondVar = '';
            function chooseLetter(exclude) {
                let vowels = 'aeiou'.replace(firstLetter, '');
                const letters = word.split('').filter(char => char !== firstLetter && char !== exclude);
                const vowelOptions = letters.filter(char => vowels.includes(char));
                return vowelOptions.length > 0 ? vowelOptions[0] : letters[0];
            }; firstVar = chooseLetter(''); secondVar = chooseLetter(firstVar);
            if (firstVar === firstLetter) firstVar = chooseLetter(firstLetter);
            else if (secondVar === firstLetter || secondVar === firstVar) secondVar = chooseLetter(firstVar);
            let transformedPrefix = 'dde'.replace(/d/g, firstLetter).replace(/e/g, firstVar).replace(/o/g, secondVar);
            return transformedPrefix + word;
        }; let transformedTexty = text.split(/\b/).map(word => transformWordy(word)).join('');
        let emojeans = [
            "😀", "☺️", "😗", "🤨", "😒", "😩", "😔", "🤓", "😋", "😌",
            "🙃", "🥳", "🤬", "😶🌫️", "😬", "😲", "🎞️", "🦯", "😷",
            "😕", "😄", "💋", "😮", "🚽", "😟", "⏫", "✴️", "💨", "🇩",
            "😘", "🚀", "❤️🩹", "🙌", "🆗", "🚫", "😞", " 🎉tada🎉 ", " ddededodediamante "
        ]; let randomEmojiCounty = Math.floor(Math.random() * 13) + 3;
        for (let i = 0; i < randomEmojiCounty; i++) { transformedTexty += emojeans[Math.floor(Math.random() * emojeans.length)]; }
        return transformedTexty;
    }
}

module.exports = Command;
