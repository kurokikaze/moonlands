"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAction = exports.color = void 0;
const CardInGame_1 = __importDefault(require("./classes/CardInGame"));
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';
const Reset = '\x1b[0m';
exports.color = {
    red: (word) => `${FgRed}${word}${Reset}`,
    green: (word) => `${FgGreen}${word}${Reset}`,
    yellow: (word) => `${FgYellow}${word}${Reset}`,
    blue: (word) => `${FgBlue}${word}${Reset}`,
    magenta: (word) => `${FgMagenta}${word}${Reset}`,
    cyan: (word) => `${FgCyan}${word}${Reset}`,
    white: (word) => `${FgWhite}${word}${Reset}`,
};
const showCard = (card) => (card instanceof CardInGame_1.default) ? `<${exports.color.blue(card.card.name)} [${card.id}]>` : card;
const showAction = (action) => {
    const fields = Object.keys(action).filter(f => f != 'type').map(field => {
        const cards = action[field];
        if (!cards)
            return `\t${field}: Empty card encountered`;
        return `\t${field}: ${(cards instanceof Array) ? cards.map(c => showCard(c)).join(' ') : showCard(cards)}`;
    });
    console.log(`
{
	${exports.color.yellow(action.type)}
${fields.join('\n')}
}`);
};
exports.showAction = showAction;
//# sourceMappingURL=logAction.js.map