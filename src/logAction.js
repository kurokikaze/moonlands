import CardInGame from './classes/CardInGame';

const FgRed = '\x1b[31m';
const FgGreen = '\x1b[32m';
const FgYellow = '\x1b[33m';
const FgBlue = '\x1b[34m';
const FgMagenta = '\x1b[35m';
const FgCyan = '\x1b[36m';
const FgWhite = '\x1b[37m';

const Reset = '\x1b[0m';

export const color = {
	red: word => `${FgRed}${word}${Reset}`,
	green: word => `${FgGreen}${word}${Reset}`,
	yellow: word => `${FgYellow}${word}${Reset}`,
	blue: word => `${FgBlue}${word}${Reset}`,
	magenta: word => `${FgMagenta}${word}${Reset}`,
	cyan: word => `${FgCyan}${word}${Reset}`,
	white: word => `${FgWhite}${word}${Reset}`,
};

const showCard = card => (card instanceof CardInGame) ? `<${color.blue(card.card.name)} [${card.id}]>` : card;

export const showAction = action => {
	const fields = Object.keys(action).filter(f => f != 'type').map(field => {
		return `\t${field}: ${showCard(action[field])}`;
	});
	console.log(`
{
	${color.yellow(action.type)}
${fields.join('\n')}
}`);
};

