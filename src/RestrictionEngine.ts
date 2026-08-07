import {
	TYPE_CREATURE,
	TYPE_MAGI,
	RESTRICTION_CREATURE_NAME,
	RESTRICTION_CREATURE_TYPE,
	RESTRICTION_TYPE,
	RESTRICTION_PLAYABLE,
	RESTRICTION_MAGI_WITHOUT_CREATURES,
	RESTRICTION_REGION,
	RESTRICTION_REGION_IS_NOT,
	RESTRICTION_ENERGY_LESS_THAN_STARTING,
	RESTRICTION_ENERGY_LESS_THAN,
	RESTRICTION_CREATURE_WAS_ATTACKED,
	RESTRICTION_OWN_CREATURE,
	RESTRICTION_OPPONENT_CREATURE,
	RESTRICTION_STATUS,
	RESTRICTION_ENERGY_EQUALS,
	PROPERTY_STATUS,
} from './const';

import CardInGame from './classes/CardInGame';
import { RestrictionObjectType, RestrictionType } from './types';

export interface RestrictionEngineContext {
	getOwnMagi(player: number): CardInGame[];
	getOwnCreatures(player: number): CardInGame[];
	calculateTotalCost(card: CardInGame): number;
	modifyByStaticAbilities(target: CardInGame, property: typeof PROPERTY_STATUS, subProperty?: string | null): boolean;
}

export class RestrictionEngine {
	private context: RestrictionEngineContext;

	constructor(context: RestrictionEngineContext) {
		this.context = context;
	}

	makeChecker(restriction: RestrictionType, restrictionValue: any): (card: CardInGame) => boolean {
		switch (restriction) {
			case RESTRICTION_CREATURE_NAME:
				return (card: CardInGame) => card.card.name === restrictionValue;
			case RESTRICTION_CREATURE_TYPE:
				if (restrictionValue instanceof Array) {
					return (card: CardInGame) => card.card.name.split(' ').some(type => restrictionValue.includes(type));
				}
				return (card: CardInGame) => card.card.name.split(' ').includes(restrictionValue);
			case RESTRICTION_TYPE:
				return (card: CardInGame) => card.card.type === restrictionValue;
			case RESTRICTION_PLAYABLE:
				return (card: CardInGame) => {
					const magi = this.context.getOwnMagi(card.owner)[0];
					const cardCost = this.context.calculateTotalCost(card);

					return magi.data.energy >= cardCost;
				};
			case RESTRICTION_MAGI_WITHOUT_CREATURES:
				return (card: CardInGame): boolean => {
					if (card.card.type !== TYPE_MAGI) return false;
					const creatures = this.context.getOwnCreatures(card.owner);

					return creatures instanceof Array && creatures.length === 0;
				};
			case RESTRICTION_REGION:
				return (card: CardInGame) => card.card.region === restrictionValue;
			case RESTRICTION_REGION_IS_NOT:
				return (card: CardInGame) => card.card.region !== restrictionValue;
			case RESTRICTION_ENERGY_LESS_THAN_STARTING:
				return (card: CardInGame) => Boolean(card.card.type === TYPE_CREATURE && card.card.cost && typeof card.card.cost == 'number' && card.data.energy < card.card.cost);
			case RESTRICTION_ENERGY_LESS_THAN:
				return (card: CardInGame) => card.card.type === TYPE_CREATURE && card.data.energy < restrictionValue;
			case RESTRICTION_CREATURE_WAS_ATTACKED:
				return (card: CardInGame) => card.card.type === TYPE_CREATURE && card.data.wasAttacked === true;
			case RESTRICTION_OWN_CREATURE:
				return (card: CardInGame) => card.data.controller === restrictionValue;
			case RESTRICTION_OPPONENT_CREATURE:
				return (card: CardInGame) => card.data.controller !== restrictionValue;
			case RESTRICTION_STATUS:
				return (card: CardInGame) => this.context.modifyByStaticAbilities(card, PROPERTY_STATUS, restrictionValue);
			case RESTRICTION_ENERGY_EQUALS:
				return (card: CardInGame) => card.card.type === TYPE_CREATURE && card.data.energy === restrictionValue;
			default:
				return () => true;
		}
	}

	checkAnyCardForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any) {
		return cards.some(this.makeChecker(restriction, restrictionValue));
	}

	checkAnyCardForRestrictions(cards: CardInGame[], restrictions: RestrictionObjectType[]) {
		return cards.some(this.makeCardFilter(restrictions));
	}

	checkCardsForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any) {
		return cards.every(this.makeChecker(restriction, restrictionValue));
	}

	makeCardFilter(restrictions: RestrictionObjectType[] = []): (c: CardInGame) => boolean {
		const checkers = restrictions.map(({ type, value }) => this.makeChecker(type, value));
		return card => checkers.every(checker => checker(card));
	}
}
