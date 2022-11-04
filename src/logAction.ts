import CardInGame from './classes/CardInGame';
import { AnyEffectType } from './types';

const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const Reset = '\x1b[0m';

export const color = {
	red: (word: string) => `${FgRed}${word}${Reset}`,
	green: (word: string) => `${FgGreen}${word}${Reset}`,
	yellow: (word: string) => `${FgYellow}${word}${Reset}`,
	blue: (word: string) => `${FgBlue}${word}${Reset}`,
	magenta: (word: string) => `${FgMagenta}${word}${Reset}`,
	cyan: (word: string) => `${FgCyan}${word}${Reset}`,
	white: (word: string) => `${FgWhite}${word}${Reset}`,
};

const showCard = (card: CardInGame | string) => (card instanceof CardInGame) ? `<${color.blue(card.card.name)} [${card.id}]>` : card;

export const showAction = (action: AnyEffectType) => {
	const fields = Object.keys(action).filter(f => f != 'type').map(field => {
    const cards = action[field as keyof typeof action]
		return `\t${field}: ${(cards instanceof Array) ? cards.map(c => showCard(c)).join(' ') : showCard(cards)}`;
	});
	console.log(`
{
	${color.yellow(action.type)}
${fields.join('\n')}
}`);
};

