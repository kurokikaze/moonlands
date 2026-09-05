import CardInGame from './classes/CardInGame.js';
import { ACTION_ENTER_PROMPT, ACTION_RESOLVE_PROMPT } from './const.js';
const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';
const Reset = '\x1b[0m';
export const color = {
    red: (word) => `${FgRed}${word}${Reset}`,
    green: (word) => `${FgGreen}${word}${Reset}`,
    yellow: (word) => `${FgYellow}${word}${Reset}`,
    blue: (word) => `${FgBlue}${word}${Reset}`,
    magenta: (word) => `${FgMagenta}${word}${Reset}`,
    cyan: (word) => `${FgCyan}${word}${Reset}`,
    white: (word) => `${FgWhite}${word}${Reset}`,
};
const showCard = (card) => (card instanceof CardInGame) ? `<${color.blue(card.card.name)} [${card.id}]>` : card;
export const showAction = (action) => {
    const fields = Object.keys(action).filter(f => f != 'type').map(field => {
        if (field == 'promptParams') {
            return `\t${field}: ${JSON.stringify(action[field], null, 2)}`;
        }
        const cards = action[field];
        if (!cards)
            return `\t${field}: Empty card encountered`;
        return `\t${field}: ${(cards instanceof Array) ? cards.map(c => showCard(c)).join(' ') : showCard(cards)}`;
    });
    console.log(`
{
	${(action.type == ACTION_ENTER_PROMPT || action.type == ACTION_RESOLVE_PROMPT) ? color.blue(action.type) : color.yellow(action.type)}
${fields.join('\n')}
}`);
};
//# sourceMappingURL=logAction.js.map