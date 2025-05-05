// TODO: Get characters from Phonetic Extensions and after: https://symbl.cc/en/unicode/blocks/phonetic-extensions/
const getRealCharacter = (char) => {
    switch (char) {
        case "Α": // Greek and Coptic
        case "А": // Cyrillic
        case "Ꭺ": // Cherokee
        case "Ꭿ": // Cherokee
            return "A";
        case "ʙ": // IPA Extensions
        case "Β": // Greek and Coptic
        case "В": // Cyrillic
        case "Ᏼ": // Cherokee
        case "ᏼ": // Cherokee
            return "B";
        case "Ϲ": // Greek and Coptic
        case "С": // Cyrillic
        case "Ꮯ": // Cherokee
        case "Ꮳ": // Cherokee
            return "C";
        case "Ꭰ": // Cherokee
            return "D";
        case "Ε": // Greek and Coptic
        case "Е": // Cyrillic
        case "Ꭼ": // Cherokee
            return "E";
        case "Ϝ": // Greek and Coptic
            return "F";
        case "Ɠ": // Latin Extended-B
        case "ɢ": // IPA Extensions
        case "Ԍ": // Cyrillic
        case "ԍ": // Cyrillic
        case "Ꮆ": // Cherokee
        case "Ꮐ": // Cherokee
        case "Ᏽ": // Cherokee
        case "ᏻ": // Cherokee
        case "ᏽ": // Cherokee
            return "G";
        case "ʜ": // IPA Extensions
        case "Η": // Greek and Coptic
        case "Н": // Cyrillic
        case "Ң": // Cyrillic
        case "Ҥ": // Cyrillic
        case "Ꮋ": // Cherokee
            return "H";
        case "Ι": // Greek and Coptic
        case "І": // Cyrillic
        case "Ӏ": // Cyrillic
        case "ӏ": // Cyrillic
        case "Ꮖ": // Cherokee
            return "I";
        case "Ϳ": // Greek and Coptic
        case "Ј": // Cyrillic
        case "Ꭻ": // Cherokee
            return "J";
        case "Ƙ": // Latin Extended-B
        case "Κ": // Greek and Coptic
        case "κ": // Greek and Coptic
        case "К": // Cyrillic
        case "Қ": // Cyrillic
        case "Ҝ": // Cyrillic
        case "Ҡ": // Cyrillic
        case "Ꮶ": // Cherokee
            return "K";
        case "ʟ": // IPA Extensions
        case "Ꮮ": // Cherokee
            return "L";
        case "Μ": // Greek and Coptic
        case "Ϻ": // Greek and Coptic
        case "М": // Cyrillic
        case "Ꮇ": // Cherokee
            return "M";
        case "ɴ": // IPA Extensions
        case "Ν": // Greek and Coptic
            return "N";
        case "Ο": // Greek and Coptic
        case "О": // Cyrillic
        case "ଠ": // Oriya
        case "᱐": // Ol Chiki
        case "ᱛ": // Ol Chiki
        case "Ჿ": // Georgian Extended
            return "O";
        case "Ρ": // Greek and Coptic
        case "Р": // Cyrillic
        case "Ꮲ": // Cherokee
            return "P";
        case "Ԛ": // Cyrillic
            return "Q";
        case "Ɍ": // Latin Extended-B
        case "ʀ": // IPA Extensions
        case "Ꭱ": // Cherokee
            return "R";
        case "Ѕ": // Cyrillic
        case "Տ": // Armenian
        case "Ⴝ": // Georgian
        case "Ꮪ": // Cherokee
        case "Ჽ": // Georgian Extended
            return "S";
        case "Ͳ": // Greek and Coptic
        case "ͳ": // Greek and Coptic
        case "Τ": // Greek and Coptic
        case "Т": // Cyrillic
        case "Ҭ": // Cyrillic
        case "Ꭲ": // Cherokee
            return "T";
        case "Ѵ": // Cyrillic
        case "Ꮩ": // Cherokee
            return "V";
        case "Ԝ": // Cyrillic
        case "Ꮃ": // Cherokee
            return "W";
        case "Χ": // Greek and Coptic
        case "Х": // Cyrillic
        case "Ҳ": // Cyrillic
            return "X";
        case "Ƴ": // Latin Extended-B
        case "Υ": // Greek and Coptic
        case "Ү": // Cyrillic
            return "Y";
        case "Ζ": // Greek and Coptic
        case "Ꮓ": // Cherokee
            return "Z";
        case "ɑ": // IPA Extensions
        case "α": // Greek and Coptic
        case "а": // Cyrillic
            return "a";
        case "Ƅ": // Latin Extended-B
        case "ƅ": // Latin Extended-B
        case "в": // Cyrillic
        case "Ꮟ": // Cherokee
            return "b";
        case "ʗ": // IPA Extensions
        case "ϲ": // Greek and Coptic
        case "с": // Cyrillic
        case "ᲃ": // Cyrillic Extended C
            return "c";
        case "ɗ": // IPA Extensions
        case "Ԁ": // Cyrillic
        case "ԁ": // Cyrillic
            return "d";
        case "е": // Cyrillic
        case "Ҽ": // Cyrillic
        case "ҽ": // Cyrillic
        case "ᧉ": // New Tai Lue
            return "e";
        case "ϝ": // Greek and Coptic
            return "f";
        case "ɡ": // IPA Extensions
            return "g";
        case "н": // Cyrillic
        case "ң": // Cyrillic
        case "ҥ": // Cyrillic
        case "Ꮒ": // Cherokee
            return "h";
        case "ɪ": // IPA Extensions
        case "і": // Cyrillic
        case "Ꭵ": // Cherokee
            return "i";
        case "ȷ": // Latin Extended-B
        case "ϳ": // Greek and Coptic
        case "ј": // Cyrillic
            return "j";
        case "ƙ": // Latin Extended-B
        case "к": // Cyrillic
        case "қ": // Cyrillic
        case "ҝ": // Cyrillic
        case "ҡ": // Cyrillic
            return "k";
        case "Ɩ": // Latin Extended-B
        case "ɩ": // IPA Extensions
        case "ɭ": // IPA Extensions
        case "ι": // Greek and Coptic
            return "l";
        case "м": // Cyrillic
            return "m";
        case "ο": // Greek and Coptic
        case "σ": // Greek and Coptic
        case "о": // Cyrillic
        case "ߋ": // NKo
        case "୦": // Oriya
        case "௦": // Tamil
        case "ం": // Telugu
        case "౦": // Telugu
        case "ಂ": // Kannada
        case "൦": // Malayalam
        case "๐": // Thai
        case "໐": // Lao
        case "࿀": // Tibetan
        case "࿁": // Tibetan
        case "ဝ": // Myanmar
        case "၀": // Myanmar
        case "ჿ": // Georgian
        case "ᦞ": // New Tai Lue
        case "᧐": // New Tai Lue
            return "o";
        case "ƿ": // Latin Extended-B
        case "ρ": // Greek and Coptic
        case "р": // Cyrillic
            return "p";
        case "Ɋ": // Latin Extended-B
        case "ɋ": // Latin Extended-B
        case "ԛ": // Cyrillic
            return "q";
        case "ɼ": // IPA Extensions
        case "Ꮢ": // Cherokee
            return "r";
        case "ѕ": // Cyrillic
            return "s";
        case "ʈ": // IPA Extensions
        case "т": // Cyrillic
        case "ҭ": // Cyrillic
            return "t";
        case "υ": // Greek and Coptic
            return "u";
        case "ν": // Greek and Coptic
        case "ѵ": // Cyrillic
            return "v";
        case "ԝ": // Cyrillic
            return "w";
        case "×": // Latin-1
        case "χ": // Greek and Coptic
        case "х": // Cyrillic
        case "ҳ": // Cyrillic
            return "x";
        case "ƴ": // Latin Extended-B
        case "ʏ": // IPA Extensions
        case "γ": // Greek and Coptic
        case "ϒ": // Greek and Coptic
        case "у": // Cyrillic
        case "ү": // Cyrillic
        case "Ꭹ": // Cherokee
        case "Ꮍ": // Cherokee
            return "y";
        case "ୀ": // Oriya
            return "1";
        case "Ʒ": // Latin Extended-B
        case "Ȝ": // Latin Extended-B
        case "ȝ": // Latin Extended-B
        case "ʒ": // IPA Extensions
        case "Ӡ": // Cyrillic
        case "ӡ": // Cyrillic
            return "3";
        case "Ꮞ": // Cherokee
            return "4";
        case "Ƽ": // Latin Extended-B
            return "5";
        case "Ϭ": // Greek and Coptic
        case "ϭ": // Greek and Coptic
        case "Ꮾ": // Cherokee
            return "6";
        case "ǃ": // Latin Extended-B
            return "!";
    }

    return char;
};

module.exports = {
    getRealCharacter
};