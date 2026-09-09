import {
	TYPE_CREATURE,
	TYPE_MAGI,
	TYPE_RELIC,
	TYPE_SPELL,

	SELECTOR_CREATURES,
	SELECTOR_MAGI,
	SELECTOR_RELICS,
	SELECTOR_OWN_MAGI,
	SELECTOR_ENEMY_MAGI,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_OWN_CREATURES,
	SELECTOR_ENEMY_CREATURES,
	SELECTOR_TOP_MAGI_OF_PILE,
	SELECTOR_OWN_SPELLS_IN_HAND,
	SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_OWN_CARDS_IN_PLAY,
	SELECTOR_CREATURES_OF_TYPE,
	SELECTOR_CREATURES_NOT_OF_TYPE,
	SELECTOR_OWN_CREATURES_OF_TYPE,
	SELECTOR_STATUS,
	SELECTOR_CREATURES_WITHOUT_STATUS,
	SELECTOR_ID,
	SELECTOR_CREATURES_OF_PLAYER,
	SELECTOR_SELF_AND_STATUS,
	SELECTOR_OWN_CREATURES_WITH_STATUS,
	SELECTOR_RANDOM_CARD_IN_HAND,
	SELECTOR_OPPONENT_ID,

	STATUS_BURROWED,

	PROPERTY_ID,
	PROPERTY_TYPE,
	PROPERTY_CONTROLLER,
	PROPERTY_ENERGY_COUNT,
	PROPERTY_REGION,
	PROPERTY_COST,
	PROPERTY_ENERGIZE,
	PROPERTY_MAGI_STARTING_ENERGY,
	PROPERTY_ATTACKS_PER_TURN,
	PROPERTY_CAN_ATTACK_MAGI_DIRECTLY,
	PROPERTY_POWER_COST,
	PROPERTY_CREATURE_TYPES,
	PROPERTY_STATUS_WAS_ATTACKED,
	PROPERTY_STATUS_DEFEATED_CREATURE,
	PROPERTY_ENERGY_LOSS_THRESHOLD,
	PROPERTY_STATUS,
	PROPERTY_ABLE_TO_ATTACK,
	PROPERTY_ABLE_TO_USE_POWERS,
	PROPERTY_MAGI_NAME,
	PROPERTY_CAN_BE_ATTACKED,
	PROPERTY_PROTECTION,
	PROPERTY_CREATURE_NAME,

	CALCULATION_SET,
	CALCULATION_SUBTRACT,
	CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,

	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_HAND,
	ZONE_TYPE_DECK,
} from './const.js';

import CardInGame from './classes/CardInGame.js';
import Zone from './classes/Zone.js';
import { CostEngine } from './CostEngine.js';
import { RestrictionEngine } from './RestrictionEngine.js';
import { LayeredModificationEngine, CardWithModification, EnrichedStaticAbilityType, GameStaticAbility } from './LayeredModificationEngine.js';

import {
	SelectorTypeType,
	PropertyType,
	RestrictionType,
	RestrictionObjectType,
	ContinuousEffectType,
	ZoneType,
	Region,
	MercenneFixed,
} from './types/index.js';
import { StatusType } from './types/common.js';

// ─── Types ────────────────────────────────────────────────────────────────────

// Re-export types from LayeredModificationEngine
export type { CardWithModification, EnrichedStaticAbilityType, GameStaticAbility } from './LayeredModificationEngine.js';

// ─── Context interface ────────────────────────────────────────────────────────

/** Subset of State that SelectorEngine needs. Kept as an interface to avoid a circular import. */
export interface SelectorEngineContext {
	getZone(type: ZoneType, player?: number | null): Zone;
	getOpponent(player: number): number;
	players: number[];
	getContinuousEffects(): ContinuousEffectType[];
	getTwister(): MercenneFixed | null;
}

// ─── SelectorEngine ───────────────────────────────────────────────────────────

export class SelectorEngine extends LayeredModificationEngine {
	private context: SelectorEngineContext;
	private costEngine: CostEngine;
	private restrictionEngine: RestrictionEngine;
	public modifiedCardDataCache: Map<string, CardWithModification> = new Map();

	constructor(context: SelectorEngineContext) {
		super();
		this.context = context;
		this.costEngine = new CostEngine({
			getOwnMagi: this.getOwnMagi.bind(this),
			modifyByStaticAbilities: this.modifyByStaticAbilities.bind(this),
		});
		this.restrictionEngine = new RestrictionEngine({
			getOwnMagi: this.getOwnMagi.bind(this),
			getOwnCreatures: this.getOwnCreatures.bind(this),
			calculateTotalCost: this.costEngine.calculateTotalCost.bind(this.costEngine),
			modifyByStaticAbilities: this.modifyByStaticAbilities.bind(this),
		});
	}

	private getOwnMagi(player: number): CardInGame[] {
		return this.useSelector(SELECTOR_OWN_MAGI, player);
	}

	private getOwnCreatures(player: number): CardInGame[] {
		return this.useSelector(SELECTOR_OWN_CREATURES, player);
	}

	clearModifiedCardDataCache(): void {
		this.modifiedCardDataCache.clear();
	}

	// ── Nth / random card helpers ────────────────────────────────────────────

	selectNthCardOfZone(player: number, zoneType: ZoneType, cardNumber: number, restrictions?: RestrictionObjectType[]): CardInGame[] {
		const zoneCards = this.context.getZone(zoneType, player).cards;
		const filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
		const index = cardNumber - 1; // 1-based indexing, for better card data readability

		if (filteredCards.length < index + 1) {
			return [];
		} else {
			return [filteredCards[index]];
		}
	}

	selectRandomCardOfZone(player: number, zoneType: ZoneType): CardInGame[] {
		const zoneCards = this.context.getZone(zoneType, player).cards;
		const twister = this.context.getTwister();
		// @ts-ignore
		const randomValue = twister ? twister.random() : Math.random();
		const index = Math.floor(randomValue * zoneCards.length);

		if (zoneCards.length === 0) {
			return [];
		} else {
			return [zoneCards[index]];
		}
	}

	// ── useSelector overloads ────────────────────────────────────────────────

	useSelector(selector: typeof SELECTOR_STATUS, player: null, argument: StatusType): CardInGame[]
	useSelector(selector: typeof SELECTOR_CREATURES_WITHOUT_STATUS, player: null, argument: StatusType): CardInGame[]
	useSelector(selector: typeof SELECTOR_CREATURES, player: null): CardInGame[]
	useSelector(selector: typeof SELECTOR_OWN_CREATURES_OF_TYPE, player: number, argument: string): CardInGame[]
	useSelector(selector: typeof SELECTOR_CREATURES_OF_TYPE, player: null, argument: string): CardInGame[]
	useSelector(selector: typeof SELECTOR_CREATURES_NOT_OF_TYPE, player: null, argument: string): CardInGame[]
	useSelector(selector: typeof SELECTOR_CREATURES_NOT_OF_REGION, player: number, argument: Region): CardInGame[]
	useSelector(selector: typeof SELECTOR_CREATURES_OF_REGION, player: number, argument: Region): CardInGame[]
	useSelector(selector: typeof SELECTOR_OPPONENT_ID, player: number | null, argument: number): number
	useSelector(selector: typeof SELECTOR_TOP_MAGI_OF_PILE, player: number): CardInGame[]
	useSelector(selector: typeof SELECTOR_OWN_MAGI, player: number): CardInGame[]
	useSelector(selector: typeof SELECTOR_ENEMY_MAGI, player: number): CardInGame[]
	useSelector(selector: typeof SELECTOR_OWN_CREATURES, player: number): CardInGame[]
	useSelector(selector: typeof SELECTOR_CREATURES_OF_PLAYER, player: number): CardInGame[]
	useSelector(selector: typeof SELECTOR_OWN_CARDS_IN_PLAY, player: number): CardInGame[]
	useSelector(selector: typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, player: number): CardInGame[]
	useSelector(selector: typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE, player: null): CardInGame[]
	useSelector(selector: typeof SELECTOR_RELICS, player: null): CardInGame[]
	useSelector(selector: typeof SELECTOR_RANDOM_CARD_IN_HAND, player: null): CardInGame[]
	useSelector(selector: SelectorTypeType, player: number | null, argument?: any): CardInGame[] | number {
		const { getZone, getOpponent, players } = this.context;
		switch (selector) {
			case SELECTOR_OWN_CARDS_IN_PLAY: {
				return getZone(ZONE_TYPE_IN_PLAY).cards
					.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player);
			}
			case SELECTOR_RELICS: {
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == TYPE_RELIC);
			}
			case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
				return [
					...getZone(ZONE_TYPE_IN_PLAY).cards
						.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
					...getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards
						.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
				];
			}
			case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
				return [
					...getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
					...getZone(ZONE_TYPE_ACTIVE_MAGI, players[0]).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
					...getZone(ZONE_TYPE_ACTIVE_MAGI, players[1]).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
				];
			}
			case SELECTOR_OPPONENT_ID:
				return players.find(id => id != argument) || 999;
			case SELECTOR_CREATURES:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == TYPE_CREATURE);
			case SELECTOR_MAGI:
				return [
					...getZone(ZONE_TYPE_ACTIVE_MAGI, players[0]).cards,
					...getZone(ZONE_TYPE_ACTIVE_MAGI, players[1]).cards,
				].filter(Boolean);
			case SELECTOR_TOP_MAGI_OF_PILE: {
				const topMagi = getZone(ZONE_TYPE_MAGI_PILE, player).cards[0];
				return [topMagi]; // Selectors always have to return array
			}
			case SELECTOR_OWN_MAGI:
				return getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards;
			case SELECTOR_OWN_SPELLS_IN_HAND:
				return getZone(ZONE_TYPE_HAND, player).cards.filter(card => card.card.type == TYPE_SPELL);
			case SELECTOR_ENEMY_MAGI:
				return getZone(ZONE_TYPE_ACTIVE_MAGI, getOpponent(player || 0)).cards;
			case SELECTOR_OWN_CREATURES:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && card.card.type == TYPE_CREATURE);
			case SELECTOR_ENEMY_CREATURES:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) != player && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_OF_REGION:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_REGION) == argument && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_NOT_OF_REGION:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_REGION) != argument && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_OF_TYPE:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_NOT_OF_TYPE:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => !card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE);
			case SELECTOR_OWN_CREATURES_OF_TYPE:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card =>
					this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player &&
					card.card.type == TYPE_CREATURE &&
					card.card.name.split(' ').includes(argument)
				);
			case SELECTOR_STATUS:
				return getZone(ZONE_TYPE_IN_PLAY).cards.filter(card =>
					this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument),
				);
			case SELECTOR_CREATURES_WITHOUT_STATUS:
				return getZone(ZONE_TYPE_IN_PLAY).cards
					.filter(card => card.card.type == TYPE_CREATURE)
					.filter(card => !this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument));
			default:
				return [];
		}
	}

	useSelectorAny(selector: SelectorTypeType, player: number | null, argument?: any): CardInGame[] | number {
		return this.useSelector(selector as any, player as any, argument);
	}



	// ── isCardAffectedByStaticAbility ────────────────────────────────────────

	isCardAffectedByStaticAbility(card: CardInGame | CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): boolean {
		const { getZone } = this.context;
		switch (staticAbility.selector) {
			case SELECTOR_ID: {
				return card.id === staticAbility.selectorParameter;
			}
			case SELECTOR_SELF_AND_STATUS: {
				return !!('card' in staticAbility &&
					staticAbility.card &&
					card.id === staticAbility.card.id &&
					this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter as StatusType));
			}
			case SELECTOR_CREATURES: {
				return card.card.type === TYPE_CREATURE &&
					getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id);
			}
			case SELECTOR_OWN_CREATURES: {
				return card.card.type === TYPE_CREATURE &&
					getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
					card.data.controller === staticAbility.player;
			}
			case SELECTOR_OWN_CREATURES_OF_TYPE: {
				return card.card.type === TYPE_CREATURE &&
					getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
					card.data.controller === staticAbility.player &&
					card.card.name.split(' ').includes(staticAbility?.selectorParameter?.toString() || 'no matches');
			}
			case SELECTOR_CREATURES_OF_PLAYER: {
				return card.card.type === TYPE_CREATURE &&
					getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
					card.data.controller == staticAbility.selectorParameter;
			}
			case SELECTOR_OWN_MAGI: {
				return card.card.type === TYPE_MAGI &&
					getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
					(getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player)?.card?.id === card.id);
			}
			case SELECTOR_STATUS: {
				return !!this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter as StatusType);
			}
			case SELECTOR_OWN_CREATURES_WITH_STATUS: {
				return !!this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter as StatusType) &&
					card.data.controller === staticAbility.player;
			}
			case SELECTOR_OWN_SPELLS_IN_HAND: {
				return getZone(ZONE_TYPE_HAND, staticAbility.player).cards.some(({ id }) => id === card.id && card.card.type == TYPE_SPELL);
			}
			default: {
				console.error(`Unknown static ability selector: ${staticAbility.selector}`);
				return false;
			}
		}
	}

	// ── modifyByStaticAbilities ──────────────────────────────────────────────

	modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty: string | null | undefined = null): any {
		if (!target) {
			return null;
		}

		const cached = this.modifiedCardDataCache.get(target.id);
		if (cached) {
			const freshData = {
				...cached.data,
				energy: target.data.energy,
				attacked: target.data.attacked,
				actionsUsed: target.data.actionsUsed,
				energyLostThisTurn: target.data.energyLostThisTurn,
				defeatedCreature: target.data.defeatedCreature,
				hasAttacked: target.data.hasAttacked,
				wasAttacked: target.data.wasAttacked,
				attachedTo: target.data.attachedTo,
			};
			// @ts-ignore
			return this.getByProperty({ ...cached, data: freshData }, property, subProperty);
		}

		const { getZone, players, getContinuousEffects } = this.context;
		const PLAYER_ONE = players[0];
		const PLAYER_TWO = players[1];

		const gameStaticAbilities: GameStaticAbility[] = [
			{
				name: 'Burrowed - Energy loss',
				text: 'Your burrowed creatures may not lose more than 2 energy each turn',
				selector: SELECTOR_STATUS,
				selectorParameter: STATUS_BURROWED,
				property: PROPERTY_ENERGY_LOSS_THRESHOLD,
				modifier: {
					operator: CALCULATION_SET,
					operandOne: 2,
				},
			},
			{
				name: 'Burrowed - Ability to attack',
				text: 'Your burrowed creatures cannot attack',
				selector: SELECTOR_STATUS,
				selectorParameter: STATUS_BURROWED,
				property: PROPERTY_ABLE_TO_ATTACK,
				modifier: {
					operator: CALCULATION_SET,
					operandOne: false,
				},
			},
		];

		const allZonesCards = [
			...getZone(ZONE_TYPE_IN_PLAY).cards,
			...getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards,
			...getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards,
		];

		const continuousStaticAbilities: EnrichedStaticAbilityType[] = getContinuousEffects().map(
			effect => effect.staticAbilities?.map(a => ({ ...a, player: effect.player })) || []
		).flat();

		const propertyLayers = {
			[PROPERTY_CONTROLLER]: 0,
			[PROPERTY_POWER_COST]: 1,
			[PROPERTY_COST]: 1,
			[PROPERTY_ENERGIZE]: 2,
			[PROPERTY_STATUS]: 3,
			[PROPERTY_ATTACKS_PER_TURN]: 4,
			[PROPERTY_CAN_ATTACK_MAGI_DIRECTLY]: 5,
			[PROPERTY_ENERGY_LOSS_THRESHOLD]: 6,
			[PROPERTY_ABLE_TO_ATTACK]: 7,
			[PROPERTY_ABLE_TO_USE_POWERS]: 8,
			[PROPERTY_PROTECTION]: 9,
		};

		const zoneAbilities: EnrichedStaticAbilityType[] = allZonesCards.reduce<EnrichedStaticAbilityType[]>(
			(acc, cardInPlay) => cardInPlay.card.data.staticAbilities ? [
				...acc,
				...(cardInPlay.card.data.staticAbilities.map(a => ({ ...a, player: cardInPlay.data.controller, card: cardInPlay })))
			] : acc,
			[],
		);

		const staticAbilities = [...gameStaticAbilities, ...zoneAbilities, ...continuousStaticAbilities].sort((a, b) => propertyLayers[a.property as keyof typeof propertyLayers] - propertyLayers[b.property as keyof typeof propertyLayers]);

		let initialCardData: CardWithModification = {
			card: target.card,
			modifiedCard: {
				...target.card,
				data: {
					protection: undefined,
					...target.card.data,
					energyLossThreshold: 0,
					ableToAttack: 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true,
				},
			},
			data: {
				...target.data,
			},
			id: target.id,
			owner: target.owner,
		};

		const modifiedCardData: CardWithModification = staticAbilities.reduce<CardWithModification>(this.layeredDataReducer.bind(this), initialCardData);

		this.modifiedCardDataCache.set(target.id, modifiedCardData);

		// @ts-ignore
		return this.getByProperty(modifiedCardData, property, subProperty);
	}



	// ── Restriction checkers ─────────────────────────────────────────────────

	makeChecker(restriction: RestrictionType, restrictionValue: any): (card: CardInGame) => boolean {
		return this.restrictionEngine.makeChecker(restriction, restrictionValue);
	}

	checkAnyCardForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any) {
		return this.restrictionEngine.checkAnyCardForRestriction(cards, restriction, restrictionValue);
	}

	checkAnyCardForRestrictions(cards: CardInGame[], restrictions: RestrictionObjectType[]) {
		return this.restrictionEngine.checkAnyCardForRestrictions(cards, restrictions);
	}

	checkCardsForRestriction(cards: CardInGame[], restriction: RestrictionType, restrictionValue: any) {
		return this.restrictionEngine.checkCardsForRestriction(cards, restriction, restrictionValue);
	}

	makeCardFilter(restrictions: RestrictionObjectType[] = []): (c: CardInGame) => boolean {
		return this.restrictionEngine.makeCardFilter(restrictions);
	}

	// ── calculateTotalCost ───────────────────────────────────────────────────

	calculateTotalCost(card: CardInGame): number {
		return this.costEngine.calculateTotalCost(card);
	}
}
