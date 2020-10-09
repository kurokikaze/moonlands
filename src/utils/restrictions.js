import {
	TYPE_CREATURE,

	RESTRICTION_TYPE,
	RESTRICTION_ENERGY_LESS_THAN_STARTING,
	RESTRICTION_REGION,
	RESTRICTION_CREATURE_TYPE,
	RESTRICTION_PLAYABLE,
} from '../const.js';

export const getRestrictionFilter = (restriction, value, magiEnergy) => {
	switch(restriction) {
		case RESTRICTION_TYPE:
			return card => card.card.type === value;
		case RESTRICTION_REGION:
			return card => card.card.region === value;
		case RESTRICTION_CREATURE_TYPE:
			return card => (card.card.type === TYPE_CREATURE && card.card.name.split(' ').includes(value));
		case RESTRICTION_ENERGY_LESS_THAN_STARTING:
			return card => (card.card.type === TYPE_CREATURE && card.data.energy < card.card.cost);
		case RESTRICTION_PLAYABLE:
			return card => (card.card.cost <= magiEnergy);
	}
};

export const makeCardFilter = (restrictions = [], magiEnergy = 0) => {
	const checkers = restrictions.map(({type, value}) => getRestrictionFilter(type, value, magiEnergy));
	return card =>
		checkers.map(checker => checker(card)).every(a => a === true); // combine checkers
};
