const progressBars = {
    empty: ['<:empty_1:1180017169526947890>', '<:empty_2:1180017168193167371>', '<:empty_3:1180017166695792680>'],
    red: ['<:fill_red_1:1337321639360200726>', '<:fill_red_2:1337321659824345098>', '<:fill_red_3:1337321677197148191>'],
    yellow: ['<:fill_yellow_1:1337321638081073183>', '<:fill_yellow_2:1337321658934886450>', '<:fill_yellow_3:1337321676194713600>'],
    green: ['<:fill_green_1:1337321636986093618>', '<:fill_green_2:1337321657978589186>', '<:fill_green_3:1337321674382770238>'],
    blue: ['<:fill_blue_1:1337321635736195105>', '<:fill_blue_2:1337321656787664907>', '<:fill_blue_3:1337321673749434401>'],
    white: ['<:fill_white_1:1337321634566242304>', '<:fill_white_2:1337321655331979307>', '<:fill_white_3:1337321672956710944>'],
    pink: ['<:fill_pink_1:1180017173436043284>', '<:fill_pink_2:1180017171607326741>', '<:fill_pink_3:1180017170495852605>'],
};

const emojiProgressBar = (color, length, percentage) => {
    if (!(color in progressBars)) {
        throw new Error(`Could not find progress bar emojis colored ${color}`);
    }

    const emojiSet = progressBars[color];
    const displayedPercentage = Math.round((percentage / 100) * length);
    const emojiArray = displayedPercentage === 0 ? progressBars.empty : emojiSet;
    if (displayedPercentage === 0 || displayedPercentage === length) {
        return `${emojiArray[0]}${emojiArray[1].repeat(length - 2)}${emojiArray[2]}`;
    }

    let text = '';
    for (let i = 0; i < length; i++) {
        const emojiIndex = i === 0 ? 0 :
            (i === length - 1 ? 2 : 1);
        const thisEmojiSet = i + 1 <= displayedPercentage ?
            emojiSet : progressBars.empty;
        text += thisEmojiSet[emojiIndex];
    }
    return text;
};

module.exports = emojiProgressBar;