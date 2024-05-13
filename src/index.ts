import { nanoid } from 'nanoid';
import { MersenneTwister } from './mersenneTwister';
import {
	TYPE_CREATURE,
	TYPE_MAGI,
	TYPE_RELIC,
	TYPE_SPELL,

	ACTION_PASS,
	ACTION_PLAY,
	ACTION_POWER,
	ACTION_EFFECT,
	ACTION_SELECT,
	ACTION_CALCULATE,
	ACTION_ENTER_PROMPT,
	ACTION_RESOLVE_PROMPT,
	ACTION_GET_PROPERTY_VALUE,
	ACTION_ATTACK,
	ACTION_PLAYER_WINS,
	ACTION_CONCEDE,
	ACTION_TIME_NOTIFICATION,
	ACTION_EXIT_PROMPTS,

	ACTION_PROPERTY,

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
	PROPERTY_MAGI_NAME,
	PROPERTY_CAN_BE_ATTACKED,

	CALCULATION_SET,
	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_MAX,

	SELECTOR_CREATURES,
	SELECTOR_MAGI,
	SELECTOR_CREATURES_AND_MAGI,
	SELECTOR_RELICS,
	SELECTOR_OWN_MAGI,
	SELECTOR_ENEMY_MAGI,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_OWN_CREATURES,
	SELECTOR_ENEMY_CREATURES,
	SELECTOR_TOP_MAGI_OF_PILE,
	SELECTOR_MAGI_OF_REGION,
	SELECTOR_OPPONENT_ID,
	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_OWN_SPELLS_IN_HAND,
	SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_OWN_CARDS_IN_PLAY,
	SELECTOR_CREATURES_OF_TYPE,
	SELECTOR_CREATURES_NOT_OF_TYPE,
	SELECTOR_OWN_CREATURES_OF_TYPE,
	SELECTOR_OTHER_CREATURES_OF_TYPE,
	SELECTOR_STATUS,
	SELECTOR_OWN_CREATURES_WITH_STATUS,
	SELECTOR_CREATURES_WITHOUT_STATUS,
	SELECTOR_ID,
	SELECTOR_CREATURES_OF_PLAYER,
	SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY,

	STATUS_BURROWED,

	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_RELIC,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_OWN_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
	PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI,
	PROMPT_TYPE_CHOOSE_CARDS,
	PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE,
	PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
	PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES,
	PROMPT_TYPE_MAY_ABILITY,
	PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES,
	PROMPT_TYPE_PLAYER,

	NO_PRIORITY,
	PRIORITY_PRS,
	PRIORITY_ATTACK,
	PRIORITY_CREATURES,

	EFFECT_TYPE_START_TURN,
	EFFECT_TYPE_START_STEP,
	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
	EFFECT_TYPE_RESHUFFLE_DISCARD,
	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_PLAY_CREATURE,
	EFFECT_TYPE_PLAY_RELIC,
	EFFECT_TYPE_PLAY_SPELL,
	EFFECT_TYPE_CREATURE_ENTERS_PLAY,
	EFFECT_TYPE_RELIC_ENTERS_PLAY,
	EFFECT_TYPE_MAGI_IS_DEFEATED,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
	EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
	EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_ENERGIZE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
	EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
	EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
	EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
	EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
	EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
	EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
	EFFECT_TYPE_BEFORE_DAMAGE,
	EFFECT_TYPE_DEAL_DAMAGE,
	EFFECT_TYPE_AFTER_DAMAGE,
	EFFECT_TYPE_CREATURE_ATTACKS,
	EFFECT_TYPE_CREATURE_IS_ATTACKED,
	EFFECT_TYPE_START_OF_TURN,
	EFFECT_TYPE_END_OF_TURN,
	EFFECT_TYPE_MAGI_FLIPPED,
	EFFECT_TYPE_FIND_STARTING_CARDS,
	EFFECT_TYPE_DRAW_REST_OF_CARDS,
	EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
	EFFECT_TYPE_ATTACK,
	EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT,

	REGION_UNIVERSAL,

	RESTRICTION_TYPE,
	RESTRICTION_REGION,
	RESTRICTION_ENERGY_LESS_THAN_STARTING,
	RESTRICTION_ENERGY_LESS_THAN,
	RESTRICTION_CREATURE_TYPE,
	RESTRICTION_OWN_CREATURE,
	RESTRICTION_OPPONENT_CREATURE,
	RESTRICTION_PLAYABLE,
	RESTRICTION_CREATURE_WAS_ATTACKED,
	RESTRICTION_MAGI_WITHOUT_CREATURES,
	RESTRICTION_STATUS,
	RESTRICTION_REGION_IS_NOT,
	RESTRICTION_ENERGY_EQUALS,

	COST_X,
	COST_X_PLUS_ONE,

	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DECK,
	ZONE_TYPE_DEFEATED_MAGI,

	LOG_ENTRY_PLAY,
	LOG_ENTRY_DRAW,
	LOG_ENTRY_CHOOSES_STARTING_CARDS,
	LOG_ENTRY_POWER_ACTIVATION,
	LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
	LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
	LOG_ENTRY_TARGETING,
	LOG_ENTRY_NUMBER_CHOICE,
	LOG_ENTRY_ATTACK,
	LOG_ENTRY_CREATURE_ENERGY_LOSS,
	LOG_ENTRY_MAGI_ENERGY_LOSS,
	LOG_ENTRY_CREATURE_ENERGY_GAIN,
	LOG_ENTRY_MAGI_ENERGY_GAIN,
	LOG_ENTRY_MAGI_DEFEATED,

	ACTION_NONE,

	EXPIRATION_ANY_TURNS,
	EXPIRATION_NEVER,
	EXPIRATION_OPPONENT_TURNS,

	PROTECTION_FROM_POWERS,
	PROTECTION_FROM_SPELLS,
	PROTECTION_TYPE_DISCARDING_FROM_PLAY,
	PROTECTION_TYPE_GENERAL,
	CARD_COUNT,
	PROPERTY_PROTECTION,
	PROTECTION_FROM_ATTACKS,
	CALCULATION_MULTIPLY,
	EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
	PROTECTION_TYPE_ENERGY_LOSS,
	PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE,
	SELECTOR_NTH_CARD_OF_ZONE,
	EFFECT_TYPE_DIE_ROLLED,
	LOG_ENTRY_DIE_ROLLED,
	PROPERTY_CREATURE_NAME,
	RESTRICTION_CREATURE_NAME,
	PROMPT_TYPE_NUMBER_OF_CREATURES,
	PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED,
	SELECTOR_SELF_AND_STATUS,
	EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
	PROMPT_TYPE_POWER_ON_MAGI,
	PROMPT_TYPE_ALTERNATIVE,
	SELECTOR_OWN_CARDS_IN_HAND,
	SELECTOR_CARDS_IN_HAND,
	PROMPT_TYPE_PAYMENT_SOURCE,
	EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
	LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
	SELECTOR_MAGI_OF_PLAYER,
	SELECTOR_RANDOM_CARD_IN_HAND,
	EFFECT_TYPE_PLAY_FINISHED,
	EFFECT_TYPE_TRIGGERED_ABILITY_FINISHED,
	EFFECT_TYPE_POWER_FINISHED,
	PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES,
} from './const';

import { actionMap } from './actionMaps/effects';
import { showAction } from './logAction';

import clone from './clone';

import { byName } from './cards';
import CardInGame, { ConvertedCard, InGameData } from './classes/CardInGame';
import Card, { CostType, ModifiedCardType } from './classes/Card';
import Zone from './classes/Zone';
import {
	AnyEffectType,
	PromptTypeType,
	RestrictionObjectType,
	RestrictionType,
	SelectorTypeType,
	LogEntryType,
	PropertyType,
	PromptType,
	EnrichedAction,
	StaticAbilityType,
	OperatorType,
	ConditionType,
	FindType,
	TriggerEffectType,
	ReplacementEffectType,
	ContinuousEffectType,
	EffectType,
	PropertyGetterType,
	ZoneType,
	Region,
	ProtectionType,
	ReplacingEffectType,
	NoneType,
} from './types';
import { EnhancedDelayedTriggerType, ExecutePowerEffect, StartingEnergyOnCreatureEffect } from './types/effect';
import { CardType, StatusType } from './types/common';
import { AlternativeType, PromptTypeMayAbility } from './types/prompt';
import { ActionTransformer } from './actionMaps/actionMapTypes';

const convertCard = (cardInGame: CardInGame): ConvertedCard => ({
	id: cardInGame.id,
	owner: cardInGame.owner,
	card: cardInGame.card.name,
	data: cardInGame.data,
});

type EnrichedStaticAbilityType = StaticAbilityType & {
	player: number;
	card?: CardInGame;
}

type GameStaticAbility = StaticAbilityType & {
	selector: typeof SELECTOR_STATUS;
}

type PriorityType = typeof NO_PRIORITY | typeof PRIORITY_PRS | typeof PRIORITY_ATTACK | typeof PRIORITY_CREATURES;

type ProtoSelectEffect = {
	type: typeof ACTION_SELECT,
	selector: SelectorTypeType,
	variable: string,
}

type ProtoEnergizeEffect = {
	type: typeof ACTION_EFFECT,
	effectType: typeof EFFECT_TYPE_ENERGIZE,
	target: string,
}

type ProtoBeforeDrawEffect = {
	type: typeof ACTION_EFFECT,
	effectType: typeof EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
}

type ProtoDrawEffect = {
	type: typeof ACTION_EFFECT,
	effectType: typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
	numberOfCards: 2,
}

type ProtoMagiFlippedEffect = {
	type: typeof ACTION_EFFECT,
	effectType: typeof EFFECT_TYPE_MAGI_FLIPPED,
	target: CardInGame,
}

type ProtoAddStartingEnergyEffect = {
	type: typeof ACTION_EFFECT,
	effectType: typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
	target: string,
}

type ProtoChooseCardsPrompt = {
	type: typeof ACTION_ENTER_PROMPT,
	promptType: typeof PROMPT_TYPE_CHOOSE_CARDS,
	promptParams: {
		startingCards: string[],
		availableCards: string[],
	},
	variable?: string,
}

type ProtoFindStartingCardsEffect = {
	type: typeof ACTION_EFFECT,
	effectType: typeof EFFECT_TYPE_FIND_STARTING_CARDS,
	cards: string,
}

type ProtoDrawRestOfCardsEffect = {
	type: typeof ACTION_EFFECT,
	effectType: typeof EFFECT_TYPE_DRAW_REST_OF_CARDS,
	drawnCards: string,
}

type ProtoEffectType = ProtoSelectEffect |
	ProtoEnergizeEffect |
	ProtoBeforeDrawEffect |
	ProtoDrawEffect |
	ProtoMagiFlippedEffect |
	ProtoAddStartingEnergyEffect |
	ProtoChooseCardsPrompt |
	ProtoFindStartingCardsEffect |
	ProtoDrawRestOfCardsEffect

type StepType = {
	name: string,
	priority: PriorityType;
	automatic: boolean;
	effects?: ProtoEffectType[]
}

type CardWithModification = {
	card: Card;
	data: InGameData;
	modifiedCard: ModifiedCardType;
	id: string;
	owner: number;
}

export const DEFAULT_PROMPT_VARIABLE: Record<PromptTypeType, string> = {
	[PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE]: 'targetCards',
	[PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]: 'cardsOrder',
	[PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE]: 'targetCards',
	[PROMPT_TYPE_NUMBER]: 'number',
	[PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE]: 'target',
	[PROMPT_TYPE_RELIC]: 'target',
	[PROMPT_TYPE_OWN_SINGLE_CREATURE]: 'target',
	[PROMPT_TYPE_SINGLE_CREATURE_FILTERED]: 'target',
	[PROMPT_TYPE_MAGI_WITHOUT_CREATURES]: 'target',
	[PROMPT_TYPE_SINGLE_CREATURE]: 'target',
	[PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI]: 'target',
	[PROMPT_TYPE_SINGLE_MAGI]: 'targetMagi',
	[PROMPT_TYPE_CHOOSE_CARDS]: 'selectedCards',
	[PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES]: 'energyOnCreatures',
	[PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]: 'energyOnCreatures',
	[PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]: 'damageOnCreatures',
	[PROMPT_TYPE_PLAYER]: 'targetPlayer',
	[PROMPT_TYPE_NUMBER_OF_CREATURES]: 'targets',
	[PROMPT_TYPE_NUMBER_OF_CREATURES_FILTERED]: 'targets',
	[PROMPT_TYPE_POWER_ON_MAGI]: 'chosenPower',
	[PROMPT_TYPE_ALTERNATIVE]: 'alternative',
	[PROMPT_TYPE_PAYMENT_SOURCE]: 'paymentSource',
	[PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES]: 'cardsInZones',
	[PROMPT_TYPE_MAY_ABILITY]: '', // Special case, doesn't use variables
};

const steps: StepType[] = [
	{
		name: 'Energize',
		priority: NO_PRIORITY,
		automatic: true,
		effects: [
			{
				type: ACTION_SELECT,
				selector: SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
				variable: 'energize',
			},
			{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_ENERGIZE,
				target: '$energize',
			},
		],
	},
	{
		name: 'Powers/Relics/Spells',
		priority: PRIORITY_PRS,
		automatic: false,
	},
	{
		name: 'Attack',
		priority: PRIORITY_ATTACK,
		automatic: false,
	},
	{
		name: 'Play Dream Creatures',
		priority: PRIORITY_CREATURES,
		automatic: false,
	},
	{
		name: 'Powers/Relics/Spells',
		priority: PRIORITY_PRS,
		automatic: false,
	},
	{
		name: 'Draw',
		priority: NO_PRIORITY,
		automatic: true,
		effects: [
			{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_BEFORE_DRAWING_CARDS_IN_DRAW_STEP,
			},
			{
				type: ACTION_EFFECT,
				effectType: EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
				numberOfCards: 2,
			},
		],
	},
];

const defaultState: StateShape = {
	actions: [],
	savedActions: [],
	delayedTriggers: [],
	mayEffectActions: [],
	fallbackActions: [],
	continuousEffects: [],
	activePlayer: 0,
	prompt: false,
	promptType: null,
	promptParams: {},
	log: [],
	step: 0,
	turn: 0,
	zones: [],
	players: [],
	spellMetaData: {},
	attachedTo: {},
	cardsAttached: {},
};

const oneOrSeveral = <T>(targets: T | T[], callback: (t: T) => void): void => {
	if (targets instanceof Array) {
		if (targets.length > 0) {
			targets.forEach(target => callback(target));
		}
	} else {
		callback(targets);
	}
};

const updateContinuousEffects = (player: number) => (effect: ContinuousEffectType) => {
	switch (effect.expiration.type) {
		case EXPIRATION_ANY_TURNS: {
			const turnCount = effect.expiration.turns;
			if (turnCount > 1) {
				return {
					...effect,
					expiration: {
						type: effect.expiration.type,
						turns: turnCount - 1,
					}
				};
			} else {
				return null;
			}
		}
		case EXPIRATION_OPPONENT_TURNS: {
			const turnCount = effect.expiration.turns;
			if (player !== effect.player) {
				if (turnCount > 0) {
					return {
						...effect,
						expiration: {
							type: effect.expiration.type,
							turns: turnCount - 1,
						}
					};
				} else {
					return null;
				}
			} else {
				return effect;
			}
		}
		case EXPIRATION_NEVER: {
			return effect;
		}
	}
};

type PromptParamsType = {
	cards?: ConvertedCard[]
	source?: CardInGame
	availableCards?: string[]
	startingCards?: string[]
	paymentType?: typeof TYPE_CREATURE | typeof TYPE_RELIC | typeof TYPE_SPELL
	paymentAmount?: number
	numberOfCards?: number
	restrictions?: RestrictionObjectType[] | null
	restriction?: RestrictionType
	amount?: number
	zone?: ZoneType
	zoneOwner?: number
	sourceZone?: ZoneType
	sourceZoneOwner?: number
	targetZones?: ZoneType[]
	magi?: CardInGame[]
	min?: number
	max?: number
	alternatives?: AlternativeType[]
}

export type MetaDataValue = CardInGame | CardInGame[] | Region | number | Record<string, number> | string;
export type MetaDataRecord = Record<string, MetaDataValue>
export type StateShape = {
	step: number | null;
	turn?: number;
	prompt: boolean;
	players: number[];
	promptType: PromptTypeType | null;
	promptMessage?: string;
	promptPlayer?: number;
	promptGeneratedBy?: string;
	promptVariable?: string;
	promptParams: PromptParamsType;
	activePlayer: number;
	goesFirst?: number;
	zones: Zone[];
	log: LogEntryType[];
	actions: AnyEffectType[];
	savedActions: AnyEffectType[];
	mayEffectActions: AnyEffectType[]; // Actions to apply if we allow may effect or may effect replacement
	fallbackActions: AnyEffectType[]; // Actions to apply if we deny may effect replacement
	continuousEffects: ContinuousEffectType[]; // Continuous effects created by cards
	spellMetaData: Record<string, MetaDataRecord>;
	cardsAttached: Record<string, string[]>; // Two-way attachment hashes
	attachedTo: Record<string, string>;
	delayedTriggers: EnhancedDelayedTriggerType[];
}

type DeckType = {
	player: number,
	deck: CardInGame[]
}

export class State {
	state: StateShape;
	players: number[] = [0, 1];
	decks: DeckType[];
	winner: boolean | number;
	debug: boolean;
	twister: typeof MersenneTwister | null = null;
	twisterSeed: number = 0
	turn: number | null;
	rollDebugValue: number | null;
	actionsOne: any[];
	actionsTwo: any[];
	onAction: Function | null = null;
	turnTimer: number | null = null;
	timerEnabled: boolean;
	turnTimeout: NodeJS.Timer | null;
	turnNotifyTimeout: NodeJS.Timer | null;

	constructor(state: StateShape) {
		this.state = {
			...clone(defaultState),
			...state,
		};

		this.decks = [];
		this.winner = false;
		this.debug = false;
		this.turn = null;
		this.timerEnabled = false;
		this.turnTimeout = null;
		this.turnNotifyTimeout = null;

		this.rollDebugValue = null,

			this.actionsOne = [];
		this.actionsTwo = [];
	}

	// @deprecated
	closeStreams() { }

	initiatePRNG(seed: number) {
		this.twisterSeed = seed;
		this.twister = new (MersenneTwister as any)(seed);
	}

	setOnAction(callback: (e: AnyEffectType) => void) {
		this.onAction = callback
	}

	addActionToStream(action: AnyEffectType): void {
		const actionWithValues = this.addValuesToAction(action);

		// Do not send outside CALCULATE, SELECT and so on
		if (![ACTION_CALCULATE, ACTION_SELECT, ACTION_GET_PROPERTY_VALUE].includes(action.type) && this.onAction) {
			this.onAction(actionWithValues);
			// this.actionStreamOne.emit('action', actionWithValues);
			// this.actionStreamTwo.emit('action', actionWithValues);
		}

		// this.logStream.emit('action', actionWithValues);
	}

	addValuesToAction(action: AnyEffectType): AnyEffectType {
		switch (action.type) {
			case ACTION_ENTER_PROMPT: {
				switch (action.promptType) {
					case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
						if (Object.hasOwn(action, 'restrictions') && action.restrictions) {
							const restrictionsWithValues = action.restrictions.map(({ type, value }: RestrictionObjectType) => ({
								type,
								value: this.getMetaValue(value, action.generatedBy),
							}));

							return {
								...action,
								restrictions: restrictionsWithValues,
							};
						} else {
							return {
								...action,
								restrictionValue: this.getMetaValue(action.restrictionValue, action.generatedBy),
							};
						}
					}
				}
				return action;
			}
			case ACTION_EFFECT: {
				switch (action.effectType) {
					case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
						return {
							...action,
							staticAbilities: action.staticAbilities?.map(ability => {
								let selectorParameter = ability.selectorParameter;
								if (ability.selector === SELECTOR_ID) {
									selectorParameter = ability.selectorParameter ? this.getMetaValue(ability.selectorParameter, action.generatedBy)?.id : null;
								} else {
									selectorParameter = this.getMetaValue(ability.selectorParameter, action.generatedBy);
								}
								return {
									...ability,
									modifier: {
										operandOne: this.getMetaValue(ability.modifier.operandOne, action.generatedBy),
										operator: ability.modifier.operator,
									},
									selectorParameter,
								};
							}),
						}
					}
				}
			}
			default:
				return action;
		}
	}

	enableDebug() {
		this.debug = true;
	}

	setRollDebugValue(value: number) {
		this.rollDebugValue = value;
	}

	resetRollDebugValue() {
		this.rollDebugValue = null;
	}

	setWinner(player: number) {
		this.winner = player;
	}

	hasWinner() {
		return this.winner !== false;
	}

	clone(): State {
		const newObject = new State(clone(this.state))
		newObject.winner = this.winner
		newObject.rollDebugValue = this.rollDebugValue
		newObject.players = this.players
		newObject.decks = this.decks

		if (this.twister) {
			newObject.twister = new (MersenneTwister as any)(this.twisterSeed);
		}
		return newObject
	}

	setPlayers(player1: number, player2: number) {
		this.players = [player1, player2];

		return this;
	}

	setDeck(player: number, cardNames: string[]) {
		if (this.players.includes(player)) {
			const deck = cardNames.map(card => {
				const cardObject = byName(card)
				if (!cardObject) {
					throw new Error(`Unknown card in deck: ${card}`)
				}
				return new CardInGame(cardObject, player)
			});
			this.decks.push({
				player,
				deck,
			});
		} else {
			throw new Error(`Non-existing player: ${player}`);
		}
	}

	enableTurnTimer(timer = 75) {
		this.turnTimer = timer;
		this.timerEnabled = true;
	}

	startTurnTimer() {
		if (this.turnTimer && this.turnTimer > 0) {
			this.turnTimeout = setTimeout(() => {
				this.endTurn()
			}, this.turnTimer * 1000);

			if (this.turnTimer > 20) {
				this.turnNotifyTimeout = setTimeout(() => {
					this.update({ type: ACTION_TIME_NOTIFICATION, player: this.state.activePlayer });
				}, 20000);
			}
		}
	}

	stopTurnTimer() {
		if (this.turnTimeout) {
			clearTimeout(this.turnTimeout)
		}
		if (this.turnNotifyTimeout) {
			clearTimeout(this.turnNotifyTimeout)
		}
	}

	endTurn() {
		const { activePlayer } = this.state;
		this.update({ type: ACTION_EXIT_PROMPTS });
		while (this.state.activePlayer === activePlayer) {
			this.update({ type: ACTION_PASS, player: activePlayer });
		}
	}

	addActionToLog(action: AnyEffectType) {
		var newLogEntry: LogEntryType | boolean = false;

		try {
			switch (action.type) {
				case ACTION_PLAY: {
					if ('payload' in action) {
						newLogEntry = {
							type: LOG_ENTRY_PLAY,
							card: action.payload.card.card.name,
							player: action.player,
						};
					} else {
						const metaValue = this.getMetaValue(action.card, action.generatedBy);
						const metaCard = Array.isArray(metaValue) ? metaValue[0] : metaValue;

						newLogEntry = {
							type: LOG_ENTRY_PLAY,
							card: metaCard.card.name,
							player: Number(action.player),
						};
					}
					break;
				}
				case ACTION_POWER: {
					newLogEntry = {
						type: LOG_ENTRY_POWER_ACTIVATION,
						card: action.source.card.name,
						name: action.power.name,
						player: action.player,
					};
					break;
				}
				case ACTION_EFFECT: {
					switch (action.effectType) {
						case EFFECT_TYPE_DRAW: {
							newLogEntry = {
								type: LOG_ENTRY_DRAW,
								player: this.getMetaValue(action.player, action.generatedBy),
							};
							break;
						}
						case EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE: {
							const target = this.getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
										card: target[0].card.name,
										amount: this.getMetaValue(action.amount, action.generatedBy),
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_CREATURE_ENERGY_LOSS,
									card: target.card.name,
									amount: this.getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_ADD_ENERGY_TO_CREATURE: {
							const target = this.getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
										card: target[0].card.name,
										amount: this.getMetaValue(action.amount, action.generatedBy),
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_CREATURE_ENERGY_GAIN,
									card: target.card.name,
									amount: this.getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI: {
							const target = this.getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_MAGI_ENERGY_LOSS,
										card: target[0].card.name,
										amount: this.getMetaValue(action.amount, action.generatedBy),
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_MAGI_ENERGY_LOSS,
									card: target.card.name,
									amount: this.getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_DIE_ROLLED: {
							newLogEntry = {
								type: LOG_ENTRY_DIE_ROLLED,
								result: action.result,
								player: action.player,
							}
							break;
						}
						case EFFECT_TYPE_ADD_ENERGY_TO_MAGI: {
							const target = this.getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_MAGI_ENERGY_GAIN,
										card: target[0].card.name,
										amount: this.getMetaValue(action.amount, action.generatedBy),
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_MAGI_ENERGY_GAIN,
									card: target.card.name,
									amount: this.getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case EFFECT_TYPE_FIND_STARTING_CARDS: {
							newLogEntry = {
								type: LOG_ENTRY_CHOOSES_STARTING_CARDS,
								player: action.player || 0,
							};
							break;
						}
						case EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY: {
							const target = this.getMetaValue(action.target, action.generatedBy);
							if (!Array.isArray(target)) {
								newLogEntry = {
									type: LOG_ENTRY_CREATURE_DISCARDED_FROM_PLAY,
									card: target.card.name,
									player: action.player,
								};
							}
							break;
						}
						case EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY: {
							const target = this.getMetaValue(action.target, action.generatedBy);
							if (Array.isArray(target)) {
								if (target.length) {
									newLogEntry = {
										type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
										card: target[0].card.name,
										player: action.player,
									};
								}
							} else {
								newLogEntry = {
									type: LOG_ENTRY_RELIC_DISCARDED_FROM_PLAY,
									card: target.card.name,
									player: action.player,
								};
							}
							break;
						}
						case EFFECT_TYPE_MAGI_IS_DEFEATED: {
							newLogEntry = {
								type: LOG_ENTRY_MAGI_DEFEATED,
								card: this.getMetaValue(action.target, action.generatedBy).card.name,
								player: action.player,
							};
							break;
						}
						case EFFECT_TYPE_CREATURE_ATTACKS: {
							newLogEntry = {
								type: LOG_ENTRY_ATTACK,
								source: this.getMetaValue(action.source, action.generatedBy).card.name,
								target: this.getMetaValue(action.target, action.generatedBy).card.name,
								packHuntAttack: Boolean(action.packHuntAttack),
							};
							break;
						}
						case EFFECT_TYPE_DISCARD_CARD_FROM_HAND: {
							newLogEntry = {
								type: LOG_ENTRY_CARD_DISCARDED_FROM_HAND,
								card: this.getMetaValue(action.target, action.generatedBy).card.name,
								player: action.player || 1,
							}
							break;
						}
						case EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT: {
							// This requires the useSelector method to accept SELECTOR_ID type, so I will do it a bit later
							break;
							/*if (action.staticAbilities) {
								for (let staticAbility of action.staticAbilities) {
									// Targeting gets a little complicated here because we aren't explicitly saying "this creature is burrowed for X turns"
									// Rather, we create a continuous effect of "creatures satisfying this selector have this property modified in this way with such-and-such expiration conditions"
									// if (staticAbility.property === PROPERTY_STATUS && staticAbility.selector == SELECTOR_ID) {
									// 	const id = this.getMetaValue(staticAbility.selectorParameter, action.generatedBy);
									// 	const target = this.useSelector(SELECTOR_ID, action.player, id);
									// 	if (target) {
									// 		newLogEntry = {
									// 			type: LOG_ENTRY_CONTINUOUS_EFFECT_CREATED,
									// 			property: PROPERTY_STATUS,
									// 			turns: this.getMetaValue(action.expiration.turns, action.generatedBy),
									// 		}
									// 	}
									// }
								}
							}
							break;*/
						}
					}
					break;
				}
				case ACTION_RESOLVE_PROMPT: {
					if (
						(
							this.state.promptType === PROMPT_TYPE_SINGLE_CREATURE ||
							this.state.promptType === PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE ||
							this.state.promptType === PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI ||
							this.state.promptType === PROMPT_TYPE_OWN_SINGLE_CREATURE ||
							this.state.promptType === PROMPT_TYPE_SINGLE_MAGI
						) && 'target' in action
					) {
						newLogEntry = {
							type: LOG_ENTRY_TARGETING,
							card: action.target?.card?.name || 'unknown card',
							player: action.player,
						};
					}
					if (this.state.promptType === PROMPT_TYPE_NUMBER && 'number' in action) {
						newLogEntry = {
							type: LOG_ENTRY_NUMBER_CHOICE,
							number: (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10),
							player: action.player,
						};
					}
					break;
				}
			}
		} catch (e) {
			console.error('Log entry creation failed');
			console.dir(action);
			// console.dir(e);
		}

		if (newLogEntry) {
			this.state.log = [
				...this.state.log,
				newLogEntry,
			];
		}

	}

	createZones() {
		const [playerOne, playerTwo] = this.players;

		const deck1 = new Zone('Player 1 deck', ZONE_TYPE_DECK, playerOne)
		const deck2 = new Zone('Player 2 deck', ZONE_TYPE_DECK, playerTwo)
		if (this.twister) {
			deck1.setPRNG(this.twister)
			deck2.setPRNG(this.twister)
		}

		return [
			new Zone('Player 1 hand', ZONE_TYPE_HAND, playerOne),
			new Zone('Player 2 hand', ZONE_TYPE_HAND, playerTwo),
			deck1,
			deck2,
			new Zone('Player 1 discard', ZONE_TYPE_DISCARD, playerOne),
			new Zone('Player 2 discard', ZONE_TYPE_DISCARD, playerTwo),
			new Zone('Player 1 active magi', ZONE_TYPE_ACTIVE_MAGI, playerOne),
			new Zone('Player 2 active magi', ZONE_TYPE_ACTIVE_MAGI, playerTwo),
			new Zone('Player 1 magi pile', ZONE_TYPE_MAGI_PILE, playerOne),
			new Zone('Player 2 magi pile', ZONE_TYPE_MAGI_PILE, playerTwo),
			new Zone('Player 1 magi pile', ZONE_TYPE_DEFEATED_MAGI, playerOne),
			new Zone('Player 2 magi pile', ZONE_TYPE_DEFEATED_MAGI, playerTwo),
			new Zone('In play', ZONE_TYPE_IN_PLAY, null),
		];
	}

	serializeData(playerId: number, hideZones = true) {
		const gameEnded = !(this.winner === false);

		const opponentId = this.players.find(player => player !== playerId);
		return {
			zones: this.serializeZones(playerId, hideZones),
			continuousEffects: this.state.continuousEffects,
			step: this.state.step,
			turn: this.state.turn,
			goesFirst: this.state.goesFirst,
			activePlayer: this.state.activePlayer,
			prompt: this.state.prompt,
			promptType: this.state.promptType,
			promptMessage: this.state.promptMessage,
			promptPlayer: this.state.promptPlayer,
			promptGeneratedBy: this.state.promptGeneratedBy,
			promptParams: this.state.promptParams,
			opponentId,
			log: this.state.log,
			gameEnded,
			winner: gameEnded ? this.winner : null,
			cardsAttached: this.state.cardsAttached,
		};
	}

	serializeZones(playerId: number, hideZones = true) {
		const opponentId = this.getOpponent(playerId);
		return {
			playerHand: this.getZone(ZONE_TYPE_HAND, playerId).serialize(),
			opponentHand: this.getZone(ZONE_TYPE_HAND, opponentId).serialize(hideZones),
			playerDeck: this.getZone(ZONE_TYPE_DECK, playerId).serialize(hideZones),
			opponentDeck: this.getZone(ZONE_TYPE_DECK, opponentId).serialize(hideZones),
			playerActiveMagi: this.getZone(ZONE_TYPE_ACTIVE_MAGI, playerId).serialize(),
			opponentActiveMagi: this.getZone(ZONE_TYPE_ACTIVE_MAGI, opponentId).serialize(),
			playerMagiPile: this.getZone(ZONE_TYPE_MAGI_PILE, playerId).serialize(),
			opponentMagiPile: this.getZone(ZONE_TYPE_MAGI_PILE, opponentId).serialize(hideZones),
			inPlay: this.getZone(ZONE_TYPE_IN_PLAY).cards.map(c => c.serialize()),
			playerDefeatedMagi: this.getZone(ZONE_TYPE_DEFEATED_MAGI, playerId).serialize(),
			opponentDefeatedMagi: this.getZone(ZONE_TYPE_DEFEATED_MAGI, opponentId).serialize(),
			playerDiscard: this.getZone(ZONE_TYPE_DISCARD, playerId).serialize(),
			opponentDiscard: this.getZone(ZONE_TYPE_DISCARD, opponentId).serialize(),
		};
	}

	setup() {
		if (this.players.length < 2) {
			throw new Error('Not enough players');
		}
		if (this.decks.length < 2) {
			throw new Error('Not enough decks for players');
		}

		const zones = this.state.zones.length == 0 ? this.createZones() : this.state.zones;

		this.state.zones = zones;

		this.decks.forEach(({ player, deck }) => {
			const magi = deck.filter(card => card.card.type === TYPE_MAGI);
			const rest = deck.filter(card => card.card.type != TYPE_MAGI);

			this.getZone(ZONE_TYPE_MAGI_PILE, player).add(magi);
			this.getZone(ZONE_TYPE_DECK, player).add(rest).shuffle();
		});

		// @ts-ignore
		const randomValue = this.twister ? this.twister.random() : Math.random();
		const goesFirst = this.players[(randomValue > 0.5 ? 0 : 1)];

		this.state = {
			...this.state,
			zones,
			step: null,
			turn: 1,
			goesFirst,
			activePlayer: goesFirst,
		};
	}

	getOpponent(player: number): number {
		const opponent = this.players.find(pl => pl != player)
		return opponent || 0
	}

	getZone(type: ZoneType, player: number | null = null): Zone {
		return this.state.zones.find(zone => zone.type === type && (zone.player == player || player == null)) || new Zone('Empty zone', ZONE_TYPE_DECK);
	}

	getCurrentStep() {
		return this.state.step;
	}

	getActivePlayer() {
		return this.state.activePlayer;
	}

	getCurrentPriority(): PriorityType {
		return this.state.step === null ? 0 : steps[this.state.step].priority;
	}

	addActions(...args: AnyEffectType[]) {
		this.state.actions.push(...args);
	}

	transformIntoActions(...args: AnyEffectType[]) {
		this.state.actions.unshift(...args);
	}

	removeDelayedTrigger(triggerId: string) {
		this.state.delayedTriggers = this.state.delayedTriggers.filter(({ id }) => id != triggerId);
	}

	private getNextAction() {
		return this.state.actions.shift();
	}

	hasActions() {
		return this.state.actions.length > 0;
	}

	setSpellMetadata(metadata: any, spellId: string): void {
		this.state = {
			...this.state,
			spellMetaData: {
				...this.state.spellMetaData,
				[spellId]: metadata,
			}
		};
	}

	getSpellMetadata(spellId: string): MetaDataRecord {
		return this.state.spellMetaData[spellId] ? this.state.spellMetaData[spellId] : {};
	}

	setSpellMetaDataField(field: string, value: any, spellId: string): void {
		if (!spellId) {
			throw new Error('Saving spell metadata field without spellId');
		}
		const metaData = this.getSpellMetadata(spellId);
		this.setSpellMetadata({
			...metaData,
			[field]: value,
		}, spellId);
	}

	getMetaValue<T>(value: string | T, spellId: string | undefined): T | any {
		if (
			typeof value == 'string' &&
			value[0] == '$' &&
			spellId
		) {
			const variableName = value.slice(1);
			const spellMetaData = this.getSpellMetadata(spellId);
			return (variableName in spellMetaData) ? spellMetaData[variableName] : null;
		} else {
			return value;
		}
	}

	/**
		 * Same as getMetaValue, but instead of $-variables it uses %-variables
		 * $-variables are kept intact, we probably need them
		 * %-variables include usual "self": link to trigger source
		 */
	prepareMetaValue<T>(value: string | T, action: AnyEffectType, self: CardInGame, spellId: string): T | any {
		if (value === '%self') return self;

		if (
			typeof value == 'string' &&
			value[0] == '%'
		) {
			const variableName = value.slice(1);

			// %-variables first refer to action's properties
			if (Object.hasOwn(action, variableName)) return (action as unknown as Record<string, T>)[variableName] as T;

			// if not, we use spellMetaData
			const spellMetaData = this.getSpellMetadata(spellId);
			return Object.hasOwn(spellMetaData, variableName) ? spellMetaData[variableName] : null;
		} else {
			return value;
		}
	}

	selectNthCardOfZone(player: number, zoneType: ZoneType, cardNumber: number, restrictions?: RestrictionObjectType[]): CardInGame[] {
		const zoneCards = this.getZone(zoneType, player).cards;
		const filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;
		const index = cardNumber - 1; // 1-based indexing, for better card data readability

		if (filteredCards.length < index + 1) {
			return []
		} else {
			return [filteredCards[index]];
		}
	}

	selectRandomCardOfZone(player: number, zoneType: ZoneType): CardInGame[] {
		const zoneCards = this.getZone(zoneType, player).cards;
		// const filteredCards = (restrictions && restrictions.length) ? zoneCards.filter(this.makeCardFilter(restrictions)) : zoneCards;

		// @ts-ignore
		const randomValue = this.twister ? this.twister.random() : Math.random();

		const index = Math.floor(randomValue * zoneCards.length);

		if (zoneCards.length == 0) {
			return []
		} else {
			return [zoneCards[index]];
		}
	}

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
		switch (selector) {
			case SELECTOR_OWN_CARDS_IN_PLAY: {
				return this.getZone(ZONE_TYPE_IN_PLAY).cards
					.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player);
			}
			case SELECTOR_RELICS: {
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == TYPE_RELIC);
			}
			case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
				return [
					...this.getZone(ZONE_TYPE_IN_PLAY).cards
						.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
					...this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards
						.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
				];
			}
			case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
				return [
					...this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
					...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
					...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_ENERGIZE) > 0),
				];
			}
			case SELECTOR_OPPONENT_ID:
				return this.players.find(id => id != argument) || 999;
			case SELECTOR_CREATURES:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type == TYPE_CREATURE);
			case SELECTOR_MAGI:
				return [
					...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[0]).cards,
					...this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.players[1]).cards,
				].filter(Boolean);
			case SELECTOR_TOP_MAGI_OF_PILE: {
				const topMagi = this.getZone(ZONE_TYPE_MAGI_PILE, player).cards[0];
				return [topMagi]; // Selectors always have to return array
			}
			case SELECTOR_OWN_MAGI:
				return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).cards;
			// case SELECTOR_OWN_MAGI_SINGLE:
			// 	return this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
			case SELECTOR_OWN_SPELLS_IN_HAND:
				return this.getZone(ZONE_TYPE_HAND, player).cards.filter(card => card.card.type == TYPE_SPELL);
			case SELECTOR_ENEMY_MAGI:
				return this.getZone(ZONE_TYPE_ACTIVE_MAGI, this.getOpponent(player || 0)).cards;
			case SELECTOR_OWN_CREATURES:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player && card.card.type == TYPE_CREATURE);
			case SELECTOR_ENEMY_CREATURES:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) != player && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_OF_REGION:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_REGION) == argument && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_NOT_OF_REGION:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => this.modifyByStaticAbilities(card, PROPERTY_REGION) != argument && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_OF_TYPE:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE);
			case SELECTOR_CREATURES_NOT_OF_TYPE:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => !card.card.name.split(' ').includes(argument) && card.card.type == TYPE_CREATURE);
			case SELECTOR_OWN_CREATURES_OF_TYPE:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card =>
					this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player &&
					card.card.type == TYPE_CREATURE &&
					card.card.name.split(' ').includes(argument)
				);
			case SELECTOR_STATUS:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card =>
					this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument),
				);
			case SELECTOR_CREATURES_WITHOUT_STATUS:
				return this.getZone(ZONE_TYPE_IN_PLAY).cards
					.filter(card => card.card.type == TYPE_CREATURE)
					.filter(card => !this.modifyByStaticAbilities(card, PROPERTY_STATUS, argument));
			default:
				return []
		}
	}

	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ABLE_TO_ATTACK): boolean
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_ATTACK_MAGI_DIRECTLY): boolean
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CAN_BE_ATTACKED): boolean
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ATTACKS_PER_TURN): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGIZE): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_ENERGY_COUNT): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_POWER_COST, subProperty: string): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CONTROLLER): number
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_PROTECTION): ProtectionType | undefined
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_MAGI_NAME): string
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_TYPE): CardType
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_TYPES): string[]
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_CREATURE_NAME): string
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_COST): CostType
	getByProperty(target: CardInGame | CardWithModification, property: typeof PROPERTY_STATUS, subProperty: typeof STATUS_BURROWED): boolean
	getByProperty(target: CardInGame | CardWithModification, property: PropertyType, subProperty: null | typeof STATUS_BURROWED | string = null): any {
		switch (property) {
			case PROPERTY_ID:
				return target.id;
			case PROPERTY_TYPE:
				return target.card.type;
			case PROPERTY_CREATURE_TYPES:
				return target.card.name.split(' ');
			case PROPERTY_CREATURE_NAME:
				return target.card.name;
			case PROPERTY_MAGI_NAME:
				return target.card.name;
			case PROPERTY_CONTROLLER:
				return target.data.controller;
			case PROPERTY_ENERGY_COUNT:
				return target.data.energy;
			case PROPERTY_ATTACKS_PER_TURN:
				return target.modifiedCard ?
					target.modifiedCard.data.attacksPerTurn :
					target.card.data.attacksPerTurn;
			case PROPERTY_COST:
				return target.modifiedCard ?
					target.modifiedCard.cost :
					target.card.cost;
			case PROPERTY_ENERGIZE:
				return target.modifiedCard ?
					target.modifiedCard.data.energize :
					target.card.data.energize;
			case PROPERTY_REGION:
				return target.card.region;
			case PROPERTY_CAN_ATTACK_MAGI_DIRECTLY:
				return target.modifiedCard ?
					target.modifiedCard.data.canAttackMagiDirectly :
					target.card.data.canAttackMagiDirectly;
			case PROPERTY_MAGI_STARTING_ENERGY:
				return target.modifiedCard ?
					target.modifiedCard.data.startingEnergy :
					target.card.data.startingEnergy;
			case PROPERTY_POWER_COST:
				const powers = target.modifiedCard ? target.modifiedCard.data?.powers : target.card.data.powers;
				return (powers && powers.length) ? powers.find(({ name }) => name === subProperty)?.cost : 0;
			case PROPERTY_STATUS_WAS_ATTACKED:
				return target.data.wasAttacked || false;
			case PROPERTY_CAN_BE_ATTACKED:
				return target.modifiedCard.data.canBeAttacked;
			case PROPERTY_STATUS_DEFEATED_CREATURE:
				return target.data.defeatedCreature || false;
			case PROPERTY_PROTECTION:
				return target.modifiedCard ?
					target.modifiedCard.data.protection :
					target.card.data.protection;
			case PROPERTY_STATUS: {
				switch (subProperty) {
					case STATUS_BURROWED:
						return Object.hasOwnProperty.call(target.data, 'burrowed') ?
							target.data.burrowed :
							target.card.data.burrowed;
					default:
						return false;
				}
			}
			// These properties can only be modified by static abilities / continuous effects
			case PROPERTY_ENERGY_LOSS_THRESHOLD:
				return target.modifiedCard ?
					target.modifiedCard.data.energyLossThreshold : 0;
			case PROPERTY_ABLE_TO_ATTACK:
				const defaultValue = 'ableToAttack' in target.card.data ? target.card.data.ableToAttack : true;
				return target.modifiedCard ?
					target.modifiedCard.data.ableToAttack : defaultValue;
		}
	}

	isCardAffectedByEffect(card: CardInGame, effect: EnrichedAction & EffectType) {
		const protection = this.modifyByStaticAbilities(card, PROPERTY_PROTECTION);

		if (protection) {
			// Is the `from` right?
			if (
				(effect.spell && protection.from && protection.from.includes(PROTECTION_FROM_SPELLS)) ||
				(effect.power && protection.from && protection.from.includes(PROTECTION_FROM_POWERS)) ||
				(effect.attack && protection.from && protection.from.includes(PROTECTION_FROM_ATTACKS))
			) {

				if (
					effect.effectType === EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE &&
					protection.type === PROTECTION_TYPE_ENERGY_LOSS
				) {
					const source = effect.source;

					if (protection.restrictions) {
						const cardFilter = this.makeCardFilter(protection.restrictions);

						return !cardFilter(source);
					} else {
						return false;
					}
				}

				if (
					(effect.effectType === EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY && protection.type === PROTECTION_TYPE_DISCARDING_FROM_PLAY) ||
					protection.type === PROTECTION_TYPE_GENERAL
				) {
					const source = effect.source;
					if (!source) return false;

					if (protection.restrictions) {
						const cardFilter = this.makeCardFilter(protection.restrictions);

						return !cardFilter(source);
					} else {
						return false;
					}
				}

				if (
					protection.type === PROTECTION_TYPE_GENERAL
				) {
					if (protection.restrictions) {
						const source = effect.source;
						if (!source) return false;

						const cardFilter = this.makeCardFilter(protection.restrictions);

						return !cardFilter(source);
					} else {
						return false;
					}
				}
			}
		}

		// Energy stasis check
		if (card.modifiedCard.data.energyStasis) {
			if (
				effect.effectType === EFFECT_TYPE_ADD_ENERGY_TO_CREATURE ||
				effect.effectType === EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE ||
				effect.effectType === EFFECT_TYPE_MOVE_ENERGY
			) {
				if (effect.source && effect.source.data.controller === card.data.controller &&
					(
						effect.spell ||
						effect.power
					)) {
					return false;
				}
			}
		}
		return true;
	}

	isCardAffectedByStaticAbility(card: CardInGame | CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility) {
		switch (staticAbility.selector) {
			case SELECTOR_ID: {
				return card.id === staticAbility.selectorParameter;
			}
			case SELECTOR_SELF_AND_STATUS: {
				return 'card' in staticAbility &&
					staticAbility.card &&
					card.id === staticAbility.card.id &&
					this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter as StatusType);
			}
			case SELECTOR_CREATURES: {
				return card.card.type === TYPE_CREATURE &&
					this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id);
			}
			case SELECTOR_OWN_CREATURES: {
				return card.card.type === TYPE_CREATURE &&
					this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
					card.data.controller === staticAbility.player;
			}
			case SELECTOR_OWN_CREATURES_OF_TYPE: {
				return card.card.type === TYPE_CREATURE &&
					this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
					card.data.controller === staticAbility.player &&
					card.card.name.split(' ').includes(staticAbility?.selectorParameter?.toString() || 'no matches');
			}
			case SELECTOR_CREATURES_OF_PLAYER: {
				return card.card.type === TYPE_CREATURE &&
					this.getZone(ZONE_TYPE_IN_PLAY).cards.some(({ id }) => id === card.id) &&
					card.data.controller == staticAbility.selectorParameter;
			}
			case SELECTOR_OWN_MAGI: {
				return card.card.type === TYPE_MAGI &&
					this.getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player).cards.length === 1 &&
					this.getZone(ZONE_TYPE_ACTIVE_MAGI, staticAbility.player)?.card?.id === card.id;
			}
			case SELECTOR_STATUS: {
				return this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter as StatusType);
			}
			case SELECTOR_OWN_CREATURES_WITH_STATUS: {
				return this.getByProperty(card, PROPERTY_STATUS, staticAbility.selectorParameter as StatusType) &&
					card.data.controller === staticAbility.player;
			}
			case SELECTOR_OWN_SPELLS_IN_HAND: {
				return this.getZone(ZONE_TYPE_HAND, staticAbility.player).cards.some(({ id }) => id === card.id && card.card.type == TYPE_SPELL);
			}
			default: {
				console.error(`Unknown static ability selector: ${staticAbility.selector}`)
				return false;
			}
		}
	}

	modifyByStaticAbilities(target: CardInGame, property: PropertyType, subProperty: string | null | undefined = null): any {
		if (!target) {
			return null;
		}

		const PLAYER_ONE = this.players[0];
		const PLAYER_TWO = this.players[1];

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

		// gathering static abilities from the field, adding players Magi to them
		const allZonesCards = [
			...this.getZone(ZONE_TYPE_IN_PLAY).cards,
			...this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE).cards,
			...this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO).cards,
		];

		const continuousStaticAbilities: EnrichedStaticAbilityType[] = this.state.continuousEffects.map(
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
			[PROPERTY_PROTECTION]: 8,
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

		// Okay, sooner or later this should be rewritten
		// Here we should construct new CardInGame object containing new Card object (both with new values)
		const modifiedCardData: CardWithModification = staticAbilities.reduce<CardWithModification>(this.layeredDataReducer.bind(this), initialCardData);

		// @ts-ignore
		return this.getByProperty(modifiedCardData, property, subProperty);
	}

	layeredDataReducer(currentCard: CardWithModification, staticAbility: EnrichedStaticAbilityType | GameStaticAbility): CardWithModification {
		if (this.isCardAffectedByStaticAbility(currentCard, staticAbility)) {
			switch (staticAbility.property) {
				case PROPERTY_COST: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_COST);
					const { operator, operandOne } = staticAbility.modifier;

					if (typeof initialValue !== 'number') {
						return {
							...currentCard,
							modifiedCard: {
								...currentCard.modifiedCard,
								cost: initialValue,
							},
						}
					}
					const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
						this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
						this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							cost: resultValue,
						},
					};
				}
				case PROPERTY_ENERGIZE: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
					const { operator, operandOne } = staticAbility.modifier;

					const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
						this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
						this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								energize: resultValue,
							},
						},
					};
				}
				case PROPERTY_ATTACKS_PER_TURN: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_ATTACKS_PER_TURN);
					const { operator, operandOne } = staticAbility.modifier;

					const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
						this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
						this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								attacksPerTurn: resultValue,
							},
						},
					};
				}
				case PROPERTY_ENERGY_LOSS_THRESHOLD: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_ENERGIZE);
					const { operator, operandOne } = staticAbility.modifier;

					const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
						this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
						this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

					return {
						...currentCard,
						modifiedCard: {
							...currentCard.modifiedCard,
							data: {
								...currentCard.modifiedCard.data,
								energyLossThreshold: resultValue,
							},
						},
					};
				}
				case PROPERTY_ABLE_TO_ATTACK: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_ABLE_TO_ATTACK);
					const { operator, operandOne } = staticAbility.modifier;

					const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

					if (typeof resultValue == 'boolean') {
						return {
							...currentCard,
							modifiedCard: {
								...currentCard.modifiedCard,
								data: {
									...currentCard.modifiedCard.data,
									ableToAttack: resultValue,
								},
							},
						};
					} else {
						return { ...currentCard }
					}
				}
				case PROPERTY_CAN_BE_ATTACKED: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_CAN_BE_ATTACKED);
					const { operator, operandOne } = staticAbility.modifier;

					const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

					if (typeof resultValue == 'boolean') {
						return {
							...currentCard,
							modifiedCard: {
								...currentCard.modifiedCard,
								data: {
									...currentCard.modifiedCard.data,
									canBeAttacked: resultValue,
								},
							},
						};
					} else {
						return {
							...currentCard,
						};
					}
				}
				case PROPERTY_CONTROLLER: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_CONTROLLER);
					const { operator, operandOne } = staticAbility.modifier;
					const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

					if (typeof resultValue == 'number') {
						return {
							...currentCard,
							data: {
								...currentCard.data,
								controller: resultValue,
							},
						};
					} else {
						return { ...currentCard }
					}
				}
				case PROPERTY_STATUS: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_STATUS, staticAbility.subProperty as StatusType);
					const { operator, operandOne } = staticAbility.modifier;

					const resultValue = (operator === CALCULATION_SET) ? operandOne : initialValue;

					if (typeof resultValue == 'boolean') {
						switch (staticAbility.subProperty) {
							case STATUS_BURROWED: {
								return {
									...currentCard,
									data: {
										...currentCard.data,
										burrowed: resultValue,
									},
								};
							}
							default: {
								return currentCard;
							}
						}
					} else {
						return { ...currentCard }
					}
				}
				case PROPERTY_PROTECTION: {
					const initialValue = this.getByProperty(currentCard, PROPERTY_PROTECTION);
					const { operator, operandOne } = staticAbility.modifier;

					const resultValue = (operator === CALCULATION_SET) ? operandOne as ProtectionType[] : initialValue;

					if (typeof resultValue == 'object' && 'from' in resultValue) {
						return {
							...currentCard,
							modifiedCard: {
								...currentCard.modifiedCard,
								data: {
									...currentCard.modifiedCard.data,
									protection: resultValue,
								},
							}
						};
					} else {
						return {
							...currentCard,
						}
					}
				}
				case PROPERTY_POWER_COST: {
					if (currentCard.modifiedCard.data.powers) {
						const updatedPowers = currentCard.modifiedCard.data.powers.map(power => {
							const initialValue = this.getByProperty(currentCard, PROPERTY_POWER_COST, power.name);
							const { operator, operandOne } = staticAbility.modifier;

							const resultValue = (operator === CALCULATION_SUBTRACT || operator === CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE) ?
								this.performCalculation(operator, initialValue, (typeof operandOne === 'number') ? operandOne : 0) :
								this.performCalculation(operator, (typeof operandOne === 'number') ? operandOne : 0, initialValue);

							return {
								...power,
								cost: resultValue,
							};
						});

						return {
							...currentCard,
							modifiedCard: {
								...currentCard.modifiedCard,
								data: {
									...currentCard.modifiedCard.data,
									powers: updatedPowers,
								},
							},
						};
					}

					return currentCard;
				}
				default: {
					return currentCard;
				}
			}
		}

		return currentCard;
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
					const magi = this.useSelector(SELECTOR_OWN_MAGI, card.owner)[0];
					const cardCost = this.calculateTotalCost(card);

					return magi.data.energy >= cardCost;
				};
			case RESTRICTION_MAGI_WITHOUT_CREATURES:
				return (card: CardInGame): boolean => {
					if (card.card.type !== TYPE_MAGI) return false;
					const creatures = this.useSelector(SELECTOR_OWN_CREATURES, card.owner);

					return (creatures && creatures instanceof Array && creatures.length === 0);
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
			// For own and opponents creatures we pass effect controller as restrictionValue
			case RESTRICTION_OWN_CREATURE:
				return (card: CardInGame) => card.data.controller === restrictionValue;
			case RESTRICTION_OPPONENT_CREATURE:
				return (card: CardInGame) => card.data.controller !== restrictionValue;
			case RESTRICTION_STATUS:
				return (card: CardInGame) => this.modifyByStaticAbilities(card, PROPERTY_STATUS, restrictionValue);
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
		return card =>
			checkers.every(checker => checker(card)); // combine checkers
	}

	getObjectOrSelf(action: AnyEffectType, self: CardInGame, object: string | number | boolean, property: boolean) {
		if (typeof object === 'boolean' || typeof object === 'number') {
			return object;
		}
		if (object === 'self') {
			return self;
		}
		return property ? this.getMetaValue(action[object as keyof typeof action], action.generatedBy) : object;
	}

	replaceByReplacementEffect(action: AnyEffectType): AnyEffectType[] {
		const PLAYER_ONE = this.players[0];
		const PLAYER_TWO = this.players[1];

		const allZonesCards = [
			...(this.getZone(ZONE_TYPE_IN_PLAY) || { cards: [] }).cards,
			...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE)).cards,
			...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO)).cards,
		];

		interface WithSelf {
			self: CardInGame;
		}

		type ReplacementEffectEnhanced = ReplacementEffectType<FindType> & WithSelf;
		const zoneReplacements: ReplacementEffectEnhanced[] = allZonesCards.reduce<ReplacementEffectEnhanced[]>(
			(acc, cardInPlay) => cardInPlay.card.data.replacementEffects ? [
				...acc,
				...cardInPlay.card.data.replacementEffects
					.filter(effect => !effect.oncePerTurn || (effect.oncePerTurn && !cardInPlay.wasActionUsed(effect.name || 'unknown effect')))
					.map(effect => ({ ...effect, self: cardInPlay })),
			] : acc,
			[],
		);

		let replacementFound: boolean = false;
		let appliedReplacerId: string | null = null;
		let appliedReplacerSelf: CardInGame | null = null;
		let replaceWith: Omit<ReplacingEffectType | EffectType | PromptType | NoneType, 'generatedBy'>[] | null = null;
		let foundReplacer: ReplacementEffectEnhanced | null = null;

		for (let replacer of zoneReplacements) {
			const replacerId = replacer.self.id; // Not really, but will work for now

			if ('replacedBy' in action && action.replacedBy?.includes(replacerId)) {
				break;
			}

			if (this.matchAction(action, replacer.find, replacer.self)) {
				foundReplacer = replacer;
				replacementFound = true;
				appliedReplacerSelf = replacer.self;
				appliedReplacerId = replacerId;
				replaceWith = (replacer.replaceWith instanceof Array) ? replacer.replaceWith : [replacer.replaceWith];
			}
		}

		const previouslyReplacedBy = ('replacedBy' in action && action.replacedBy) ? action.replacedBy : [];

		if (replacementFound && replaceWith) {

			const resultEffects: AnyEffectType[] = appliedReplacerSelf ? replaceWith.map(((appliedReplacerSelf: CardInGame) => (replacementEffect) => {
				if ('type' in replacementEffect && replacementEffect.type == ACTION_EXIT_PROMPTS) {
					throw new Error('Cannot replace anything with ACTION_EXIT_PROMPTS');
				}

				if (!('type' in replacementEffect)) {
					const resultEffect = {
						type: ACTION_EFFECT,
						...replacementEffect,
						replacedBy: appliedReplacerId ? [
							...previouslyReplacedBy,
							appliedReplacerId,
						] : previouslyReplacedBy,
						generatedBy: action.generatedBy || nanoid(),
						player: appliedReplacerSelf.data.controller,
					} as AnyEffectType;

					Object.keys(replacementEffect)
						.filter(key => !['type', 'effectType'].includes(key))
						.forEach(key => {
							const value = this.prepareMetaValue(replacementEffect[key as keyof typeof replacementEffect], action, appliedReplacerSelf, action.generatedBy || 'thegame');
							resultEffect[key as keyof AnyEffectType] = value;
						});

					return resultEffect
				}
				let resultEffect/*: WithReplacementValues<EffectType, EffectType>*/ = {
					...replacementEffect,
					replacedBy: appliedReplacerId ? [
						...previouslyReplacedBy,
						appliedReplacerId,
					] : previouslyReplacedBy,
					generatedBy: action.generatedBy || nanoid(),
					player: appliedReplacerSelf.data.controller,
				};

				// prepare %-values on created action
				Object.keys(replacementEffect)
					.filter(key => !['type', 'effectType'].includes(key))
					.forEach(key => {
						const value = this.prepareMetaValue(replacementEffect[key as keyof typeof replacementEffect], action, appliedReplacerSelf, action.generatedBy || 'thegame');
						resultEffect[key as keyof AnyEffectType] = value;
					});

				return resultEffect as AnyEffectType;
			})(appliedReplacerSelf)) : [];

			// If the replacer is one-time, set the action usage
			if (appliedReplacerSelf && foundReplacer && foundReplacer.oncePerTurn && foundReplacer.name) {
				appliedReplacerSelf.setActionUsed(foundReplacer.name);
			}

			if (foundReplacer && foundReplacer.mayEffect) {
				const replacedBy = ('replacedBy' in action && action.replacedBy) ? [...action.replacedBy] : []
				if (appliedReplacerId) {
					replacedBy.push(appliedReplacerId);
				}
				this.state.mayEffectActions = resultEffects;
				this.state.fallbackActions = [{
					...action,
					replacedBy, // :	('replacedBy' in action && action.replacedBy) ? [...action.replacedBy, appliedReplacerId] : [appliedReplacerId],
				}];

				return [{
					type: ACTION_ENTER_PROMPT,
					promptType: PROMPT_TYPE_MAY_ABILITY,
					promptParams: {
						effect: {
							name: foundReplacer.name,
							text: foundReplacer.text,
						},
					},
					generatedBy: appliedReplacerId,
					player: appliedReplacerSelf ? appliedReplacerSelf.data.controller : 0, // This is strange @todo check if appliedReplacerSelf can be null
				} as PromptTypeMayAbility];
			} else {
				return resultEffects;
			}
		}

		return [action];
	}

	checkCondition(action: AnyEffectType, self: CardInGame, condition: ConditionType) {
		if (
			!('objectOne' in condition) ||
			!('objectTwo' in condition)
		) {
			throw new Error('Missing object field in condition');
		}

		// Sometimes, spellData stores arrays of cards. If we got array to check condition on, use only first item.
		const multiObjectOne = this.getObjectOrSelf(action, self, condition.objectOne, 'propertyOne' in condition && Boolean(condition.propertyOne));
		const objectOne = (multiObjectOne instanceof Array) ? multiObjectOne[0] : multiObjectOne;
		const multiObjectTwo = this.getObjectOrSelf(action, self, condition.objectTwo, 'propertyTwo' in condition && Boolean(condition.propertyTwo));
		const objectTwo = (multiObjectTwo instanceof Array) ? multiObjectTwo[0] : multiObjectTwo;

		// So here either objectOne or objectTwo might be an array. 
		if (objectOne instanceof Array || objectTwo instanceof Array) {
			throw new Error('Whoops, array in checkCondition');
		}

		const operandOne = (condition.propertyOne && condition.propertyOne !== ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectOne, condition.propertyOne) : objectOne;

		const operandTwo = (condition.propertyTwo && condition.propertyTwo !== ACTION_PROPERTY) ? this.modifyByStaticAbilities(objectTwo, condition.propertyTwo) : objectTwo;

		switch (condition.comparator) {
			case '!=':
				return operandOne !== operandTwo;
			case '=':
				return operandOne == operandTwo;
			case '>':
				return operandOne > operandTwo;
			case '<':
				return operandOne < operandTwo;
			case '>=':
				return operandOne >= operandTwo;
			case '<=':
				return operandOne <= operandTwo;
			case 'includes':
				return operandOne.length && operandOne.includes(operandTwo);
		}
	}

	matchAction(action: AnyEffectType, find: FindType, self: CardInGame) {
		if (action.type !== ACTION_EFFECT) {
			return false;
		}

		if (action.effectType !== find.effectType) {
			return false;
		}

		const conditions = find.conditions.map(condition => {
			let result = false;
			try {
				result = this.checkCondition(action, self, condition);
			} catch (e) {
				console.error('Failure checking condition');
				console.dir(condition);
			}
			return result;
		});

		return conditions.every(result => result === true);
	}

	triggerAbilities(action: AnyEffectType) {
		const PLAYER_ONE = this.players[0];
		const PLAYER_TWO = this.players[1];
		const allZonesCards = [
			...(this.getZone(ZONE_TYPE_IN_PLAY) || { cards: [] }).cards,
			...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_ONE) || { cards: [] }).cards,
			...(this.getZone(ZONE_TYPE_ACTIVE_MAGI, PLAYER_TWO) || { cards: [] }).cards,
		];

		type TriggerTypeEnhanced = WithSelf & TriggerEffectType;

		const cardTriggerEffects = allZonesCards.reduce<TriggerTypeEnhanced[]>(
			(acc, cardInPlay) => cardInPlay.card.data.triggerEffects ? [
				...acc,
				...cardInPlay.card.data.triggerEffects.map(effect => ({ ...effect, self: cardInPlay })),
			] : acc,
			[],
		);

		interface WithSelf {
			self: CardInGame;
		}

		// const continuousEffectTriggers = this.state.continuousEffects.map(effect => effect.triggerEffects.map(triggerEffect => ({...triggerEffect, id: effect.id})) || []).flat();
		const triggerEffects: TriggerTypeEnhanced[] = [...cardTriggerEffects, ...this.state.delayedTriggers, /* ...continuousEffectTriggers*/];

		triggerEffects.forEach(replacer => {
			// @ts-ignore
			const triggeredId = replacer.self.id; // Not really, but will work for now
			if (this.matchAction(action, replacer.find, replacer.self)) {
				// Save source to *trigger source* metadata (it's probably empty)
				// For creatures set creatureSource field (just for convenience)
				this.setSpellMetaDataField('source', replacer.self, /*action.generatedBy ||*/ triggeredId);
				if (replacer.self.card.type === TYPE_CREATURE) {
					this.setSpellMetaDataField('sourceCreature', replacer.self, /*action.generatedBy ||*/ triggeredId);
				}

				// Turn all metadata entries into their corresponding values 
				const actionWithValues = Object.fromEntries(Object.entries(action).map(([key, value]) => {
					if (typeof value == 'string' && value.startsWith('$')) {
						return [key, this.getMetaValue(value, action.generatedBy)]
					}
					return [key, value]
				})) as AnyEffectType;

				// Turn effect-templates into actual effect actions by preparing meta-values				
				const preparedEffects = replacer.effects.map(effect => {
					// @ts-ignore
					let resultEffect: AnyEffectType = {
						type: effect.type || ACTION_EFFECT,
						generatedBy: /*action.generatedBy ||*/ triggeredId, // Some actions do not have generatedBy (game actions). We still need one though.
						triggeredId: [triggeredId],
						triggerSource: replacer.self,
						player: replacer.self.data.controller,
					};

					// Do we need to replace this? Maybe later
					if (effect.type === ACTION_EFFECT) {
						// @ts-ignore
						resultEffect.effectType = effect.effectType;
					}

					// prepare %-values on created action
					Object.keys(effect)
						.filter(key => !['type', 'effectType'].includes(key))
						.forEach(key => {
							const propertyValue = effect[key as keyof typeof effect]
							const value = this.prepareMetaValue(propertyValue, actionWithValues, replacer.self, action.generatedBy || nanoid());
							// if (typeof value == 'string' && value.startsWith('$')) {
							// 	console.log(`Interpolating ${key} with generatedBy ${action.generatedBy}`)
							// 	console.dir(this.getMetaValue(value, action.generatedBy))
							// 	resultEffect[key as keyof typeof effect] = this.getMetaValue(value, action.generatedBy)
							// } else {
							resultEffect[key as keyof typeof effect] = value;
							// }
						});

					return resultEffect;
				});

				preparedEffects.push({
					type: ACTION_EFFECT,
					effectType: EFFECT_TYPE_TRIGGERED_ABILITY_FINISHED,
					generatedBy: triggeredId,
				})

				const allPromptsAreDoable = this.checkPrompts(replacer.self, preparedEffects, false, 0);
				if (allPromptsAreDoable) {
					if (replacer.mayEffect) {
						this.state.mayEffectActions = preparedEffects;

						this.transformIntoActions({
							type: ACTION_ENTER_PROMPT,
							promptType: PROMPT_TYPE_MAY_ABILITY,
							promptParams: {
								effect: {
									name: replacer.name,
									text: replacer.text,
								},
							},
							generatedBy: replacer.self.id,
							player: replacer.self.data.controller,
						});
					} else {
						this.transformIntoActions(...preparedEffects);
					}
				}

				// @ts-ignore
				if (replacer.id) {
					// @ts-ignore
					this.removeDelayedTrigger(replacer.id);
				}
			}
		});
	}

	attachCard(cardId: string, attachmentTargetId: string) {
		this.state.attachedTo[cardId] = attachmentTargetId;
		if (!(attachmentTargetId in this.state.cardsAttached)) {
			this.state.cardsAttached[attachmentTargetId] = []
		}
		this.state.cardsAttached[attachmentTargetId].push(cardId)
	}

	removeAttachments(cardId: string) {
		if (cardId in this.state.cardsAttached) {
			for (let attachedCardId of this.state.cardsAttached[cardId]) {
				if (attachedCardId in this.state.attachedTo) {
					delete this.state.attachedTo[attachedCardId];
				}
			}

			delete this.state.cardsAttached[cardId];
		}
	}

	detachCard(cardId: string) {
		if (cardId in this.state.attachedTo) {
			const attachedTargetId = this.state.attachedTo[cardId]
			delete this.state.attachedTo[cardId];

			this.state.cardsAttached[attachedTargetId] =
				this.state.cardsAttached[attachedTargetId].filter(attachedCard => attachedCard !== cardId);
		}

	}

	performCalculation(operator: OperatorType, operandOne: number, operandTwo: number): number {
		let result: number;
		switch (operator) {
			case CALCULATION_SET: {
				result = operandOne;
				break;
			}
			case CALCULATION_DOUBLE: {
				result = operandOne * 2;
				break;
			}
			case CALCULATION_ADD: {
				result = operandOne + operandTwo;
				break;
			}
			case CALCULATION_SUBTRACT: {
				result = operandOne - operandTwo;
				break;
			}
			case CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE: {
				result = Math.max(operandOne - operandTwo, 1);
				break;
			}
			case CALCULATION_HALVE_ROUND_DOWN: {
				result = Math.floor(operandOne / 2);
				break;
			}
			case CALCULATION_HALVE_ROUND_UP: {
				result = Math.ceil(operandOne / 2);
				break;
			}
			case CALCULATION_MULTIPLY: {
				result = operandOne * operandTwo;
				break;
			}
			case CALCULATION_MIN: {
				result = Math.min(operandOne, operandTwo);
				break;
			}
			case CALCULATION_MAX: {
				result = Math.max(operandOne, operandTwo);
				break;
			}
		}

		return result;
	}

	calculateTotalCost(card: CardInGame): number {
		const activeMagiSelected = this.useSelector(SELECTOR_OWN_MAGI, card.owner);
		if (activeMagiSelected instanceof Array && activeMagiSelected.length) {
			const activeMagi = activeMagiSelected[0];
			const baseCost = this.modifyByStaticAbilities(card, PROPERTY_COST);
			const regionPenalty = (activeMagi.card.region == card.card.region || card.card.region == REGION_UNIVERSAL) ? 0 : 1;

			return baseCost + regionPenalty;
		}

		return 0;
	}

	getAvailableCards(player: number, topMagi: CardInGame) {
		const deckCards = this.getZone(ZONE_TYPE_DECK, player).cards.map(({ card }) => card.name);
		const discardCards = this.getZone(ZONE_TYPE_DISCARD, player).cards.map(({ card }) => card.name);
		const searchableCards = [...deckCards, ...discardCards];

		const availableCards = topMagi.card.data?.startingCards?.filter(card => searchableCards.includes(card)) || [];

		return availableCards;
	}

	checkPrompts(source: CardInGame, preparedActions: AnyEffectType[], isPower: boolean = false, powerCost: number = 0): boolean {
		const testedActions = [...preparedActions];
		// Calculate if prompts are resolvable
		// If source is Magi, it will not be filtered out, being in another zone
		const creatureWillSurvive = !isPower || source.data.energy > powerCost;

		const ourCardsInPlay = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => (creatureWillSurvive ? true : card.id !== source.id) && this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === source.data.controller);
		const allCardsInPlay = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => creatureWillSurvive ? true : card.id !== source.id);

		const metaValues: MetaDataRecord = {
			'$source': source,
			'$sourceCreature': source,
		}

		while (testedActions.length && testedActions[0].type === ACTION_GET_PROPERTY_VALUE) {
			const valueGetter: PropertyGetterType = testedActions[0];
			testedActions.shift()

			const multiTarget = valueGetter.source;
			const target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;
			const property = this.getMetaValue(valueGetter.property, valueGetter.generatedBy);

			const modifiedResult = this.modifyByStaticAbilities(target, property);

			const variable = valueGetter.variable || 'result';
			metaValues[`$${variable}`] = modifiedResult;
		}

		// powerPromptsDoable
		const testablePrompts: PromptTypeType[] = [
			PROMPT_TYPE_SINGLE_CREATURE,
			PROMPT_TYPE_RELIC,
			PROMPT_TYPE_OWN_SINGLE_CREATURE,
			PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
			PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
			PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE,
			PROMPT_TYPE_MAGI_WITHOUT_CREATURES,
			PROMPT_TYPE_POWER_ON_MAGI,
		];

		const testablePromptFilter = (action: AnyEffectType): action is PromptType =>
			action.type === ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);

		const allPrompts = testedActions.filter(testablePromptFilter);

		const allPromptsAreDoable = allPrompts.every(promptAction => {
			switch (promptAction.promptType) {
				case PROMPT_TYPE_SINGLE_CREATURE:
					return allCardsInPlay.some(card => card.card.type === TYPE_CREATURE);
				case PROMPT_TYPE_MAGI_WITHOUT_CREATURES:
					const opponent = this.getOpponent(source.data.controller);
					const magi = [...this.getZone(ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards, ...this.getZone(ZONE_TYPE_ACTIVE_MAGI, opponent).cards];
					return magi.some(magi => !allCardsInPlay.some(card => card.card.type === TYPE_CREATURE && this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === magi.data.controller));
				case PROMPT_TYPE_RELIC:
					return allCardsInPlay.some(card => card.card.type === TYPE_RELIC);
				case PROMPT_TYPE_OWN_SINGLE_CREATURE:
					return ourCardsInPlay.some(card => card.card.type === TYPE_CREATURE);
				case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
					return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.id !== source.id);
				}
				case PROMPT_TYPE_POWER_ON_MAGI: {
					const magi = this.getZone(ZONE_TYPE_ACTIVE_MAGI, source.data.controller).cards;
					return magi.some(magi => magi.card.data.powers && magi.card.data.powers.some(power => power.cost === COST_X || (power.cost <= magi.data.energy + 2)));
				}
				case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
					if (promptAction.restrictions) {
						const restrictionsWithValues = promptAction.restrictions.map(({ type, value }: RestrictionObjectType) => {
							const restrictionValue = (
								typeof value === 'string' &&
								value in metaValues
							) ? metaValues[value] : value;

							return {
								type,
								value: restrictionValue,
							};
						});
						return this.checkAnyCardForRestrictions(allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE), restrictionsWithValues as RestrictionObjectType[]);
					} else if (promptAction.restriction) {
						switch (promptAction.restriction) {
							case RESTRICTION_OWN_CREATURE: {
								return this.checkAnyCardForRestriction(
									allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									source.data.controller,
								);
							}
							case RESTRICTION_OPPONENT_CREATURE: {
								return this.checkAnyCardForRestriction(
									allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									source.data.controller,
								);
							}
							default: {
								const restrictionValue = (
									typeof promptAction.restrictionValue === 'string' &&
									promptAction.restrictionValue in metaValues
								) ? metaValues[promptAction.restrictionValue] : promptAction.restrictionValue;

								return this.checkAnyCardForRestriction(
									allCardsInPlay.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									restrictionValue,
								);
							}
						}
					}
					return true;
				}
				case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
					const zoneOwner = this.getMetaValue(promptAction.zoneOwner, source.id);
					const cardsInZone = this.getZone(promptAction.zone as ZoneType, zoneOwner).cards;
					const numberOfCards = this.getMetaValue(promptAction.numberOfCards, source.id);
					// if (cardsInZone.length < numberOfCards) {
					//	 return false;
					// }
					if (promptAction.restrictions) {
						return this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
					} else if (promptAction.restriction) {
						switch (promptAction.restriction) {
							case RESTRICTION_OWN_CREATURE: {
								return this.checkAnyCardForRestriction(
									cardsInZone.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									source.data.controller,
								);
							}
							case RESTRICTION_OPPONENT_CREATURE: {
								return this.checkAnyCardForRestriction(
									cardsInZone.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									source.data.controller,
								);
							}
							default: {
								return this.checkAnyCardForRestriction(
									cardsInZone.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									promptAction.restrictionValue,
								);
							}
						}
					}
					return true;
				}
				case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
					const zoneOwner = this.getMetaValue(promptAction.zoneOwner, source.id);
					const cardsInZone = this.getZone(promptAction.zone, zoneOwner).cards;
					if (promptAction.restrictions) {
						return this.checkAnyCardForRestrictions(cardsInZone, promptAction.restrictions);
					} else if (promptAction.restriction) {
						switch (promptAction.restriction) {
							case RESTRICTION_OWN_CREATURE: {
								return this.checkAnyCardForRestriction(
									cardsInZone.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									source.data.controller,
								);
							}
							case RESTRICTION_OPPONENT_CREATURE: {
								return this.checkAnyCardForRestriction(
									cardsInZone.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									source.data.controller,
								);
							}
							default: {
								return this.checkAnyCardForRestriction(
									cardsInZone.filter(card => card.card.type === TYPE_CREATURE),
									promptAction.restriction,
									promptAction.restrictionValue,
								);
							}
						}
					}
					return true;
				}
				default:
					return true;
			}
		});

		return allPromptsAreDoable;
	}

	update(initialAction: AnyEffectType) {
		if (this.hasWinner()) {
			return false;
		}
		this.addActions(initialAction);
		while (this.hasActions()) {
			const rawAction = this.getNextAction() as AnyEffectType;
			const replacedActions: AnyEffectType[] = this.replaceByReplacementEffect(rawAction);
			const action = replacedActions[0];
			if (replacedActions.length > 1) {
				// Stuff the rest of them into beginning of the action queue
				this.transformIntoActions(...replacedActions.slice(1));
			}

			if (this.state.prompt && !(action.type === ACTION_RESOLVE_PROMPT || action.type === ACTION_CONCEDE || action.type === ACTION_EXIT_PROMPTS)) {
				showAction(action);
				throw new Error('Non-prompt action in the prompt state')
			}

			if (this.debug) {
				showAction(action);
			}

			this.addActionToLog(action);
			this.addActionToStream(action);

			this.triggerAbilities(action);

			switch (action.type) {
				case ACTION_CONCEDE: {
					const opponentId = this.getOpponent(action.player);
					this.transformIntoActions({
						type: ACTION_PLAYER_WINS,
						player: opponentId,
					});

					break;
				}

				case ACTION_PLAYER_WINS: {
					this.setWinner(action.player);
					this.state.actions = [];
					break;
				}

				case ACTION_ATTACK: {
					const attackSource: CardInGame = action.generatedBy ? this.getMetaValue(action.source, action.generatedBy) : action.source;
					const attackTarget: CardInGame = action.generatedBy ? this.getMetaValue(action.target, action.generatedBy) : action.target;

					const additionalAttackers = (action.generatedBy ? this.getMetaValue(action.additionalAttackers, action.generatedBy) : action.additionalAttackers) || [];

					const sourceAttacksPerTurn = this.modifyByStaticAbilities(attackSource, PROPERTY_ATTACKS_PER_TURN);

					const attackerCanAttack = this.modifyByStaticAbilities(attackSource, PROPERTY_ABLE_TO_ATTACK);
					if (!attackerCanAttack) {
						console.error(`Somehow ${attackSource.card.name} cannot attack`);
					} else {
						const targetCanBeAttacked = this.modifyByStaticAbilities(attackTarget, PROPERTY_CAN_BE_ATTACKED);
						if (!targetCanBeAttacked) {
							console.error(`Somehow ${attackSource.card.name} cannot be attacked`);
						} else {
							const sourceHasAttacksLeft = attackSource.data.attacked < sourceAttacksPerTurn;
							const additionalAttackersCanAttack = additionalAttackers.every((card: CardInGame) => card.card.data.canPackHunt && this.modifyByStaticAbilities(card, PROPERTY_ABLE_TO_ATTACK));
							const additionalAttackersHasAttacksLeft = additionalAttackers.every((card: CardInGame) => card.data.attacked < this.modifyByStaticAbilities(card, PROPERTY_ATTACKS_PER_TURN));

							const targetIsMagi = attackTarget.card.type == TYPE_MAGI;
							const opponentCreatures = this.useSelector(SELECTOR_OWN_CREATURES, attackTarget.owner);
							const magiHasCreatures = opponentCreatures instanceof Array && opponentCreatures.length > 0;

							const attackApproved = !targetIsMagi || ( // Either we attack a creature
								targetIsMagi && ( // Or we are attacking a magi, but then...
									!magiHasCreatures || // ...he either shouldn't have creatures
									this.modifyByStaticAbilities(attackSource, PROPERTY_CAN_ATTACK_MAGI_DIRECTLY) // ...or we can just trample through
								)
							);

							const enoughAttacksLeft = (sourceHasAttacksLeft && ((additionalAttackersCanAttack && additionalAttackersHasAttacksLeft) || additionalAttackers.length === 0));

							if (enoughAttacksLeft && attackApproved && this.getCurrentPriority() == PRIORITY_ATTACK) {
								this.transformIntoActions({
									type: ACTION_EFFECT,
									effectType: EFFECT_TYPE_ATTACK,
									source: attackSource,
									target: attackTarget,
									additionalAttackers,
									generatedBy: attackSource.id,
									player: attackSource.data.controller,
								});
							}
						}
					}

					break;
				}
				case ACTION_GET_PROPERTY_VALUE: {
					const multiTarget = this.getMetaValue(action.target, action.generatedBy);
					const property = this.getMetaValue(action.property, action.generatedBy);

					if (property === CARD_COUNT) {
						const result = (multiTarget instanceof Array) ? multiTarget.length : 0;

						const variable = action.variable || 'result';
						if (action.generatedBy) {
							this.setSpellMetaDataField(variable, result, action.generatedBy);
						}
					} else {
						// Sometimes we can only pass here results of a selector.
						// If so, work on first element of result.
						const target = (multiTarget instanceof Array) ? multiTarget[0] : multiTarget;

						let modifiedResult: any;
						if (target && 'name' in target && 'effects' in target && property === PROPERTY_POWER_COST) {
							modifiedResult = target.cost;
						} else {
							modifiedResult = this.modifyByStaticAbilities(target, property);
						}

						const variable = action.variable || 'result';
						if (action.generatedBy) {
							this.setSpellMetaDataField(variable, modifiedResult, action.generatedBy);
						}
					}
					break;
				}
				case ACTION_CALCULATE: {
					const operandOne = this.getMetaValue(action.operandOne, action.generatedBy);
					const operandTwo = this.getMetaValue(action.operandTwo, action.generatedBy);
					const result = this.performCalculation(action.operator, operandOne, operandTwo);

					const variable = action.variable || 'result';
					if (action.generatedBy) {
						this.setSpellMetaDataField(variable, result, action.generatedBy);
					}
					break;
				}
				case ACTION_POWER: {
					const powerCost = this.modifyByStaticAbilities(action.source, PROPERTY_POWER_COST, action.power.name || '');

					const payingCard = (action.source.card.type === TYPE_RELIC) ?
						this.getZone(ZONE_TYPE_ACTIVE_MAGI, action.source.owner).card :
						action.source;

					if (payingCard &&
						!action.source.wasActionUsed(action.power.name) &&
						(
							payingCard.data.energy >= powerCost ||
							(
								payingCard.data.energy > 0 && powerCost === COST_X
							)
						)
					) {
						const source = action.source;
						const sourcePower = action.power;
						const effects = action.power.effects;
						const sourceController = this.modifyByStaticAbilities(source, PROPERTY_CONTROLLER);

						const enrichAction = <T>(effect: T): T & EnrichedAction => ({
							source,
							player: sourceController,
							...effect,
							power: true,
							generatedBy:
								source.id,
						});

						const preparedActions: AnyEffectType[] = effects.map(enrichAction);

						const allPromptsAreDoable = this.checkPrompts(source, preparedActions, true, powerCost);

						if (allPromptsAreDoable) {
							let currentPowerMetaData = {
								source,
								sourcePower,
								player: action.player,
								sourceCreature: source,
							}; // No retrieving old metadata from old activations

							source.setActionUsed(action.power.name);

							if (powerCost == COST_X) {
								this.addActions(
									{
										type: ACTION_ENTER_PROMPT,
										promptType: PROMPT_TYPE_NUMBER,
										player: sourceController,
										generatedBy: source.id,
										min: 1,
										max: action.source.data.energy,
									},
									{
										type: ACTION_CALCULATE,
										operator: CALCULATION_SET,
										operandOne: '$number',
										variable: 'chosen_cost',
										generatedBy: source.id,
									},
									{
										type: ACTION_EFFECT,
										effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
										target: payingCard,
										amount: '$number',
										generatedBy: source.id,
									},
								);
							} else if (powerCost > 0) {
								this.addActions({
									type: ACTION_EFFECT,
									effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
									target: payingCard,
									amount: powerCost,
									generatedBy: source.id,
								});
							}
							if (sourcePower) {
								const powerEffects: ExecutePowerEffect = {
									type: ACTION_EFFECT,
									effectType: EFFECT_TYPE_EXECUTE_POWER_EFFECTS,
									power: sourcePower,
									source,
									player: action.player,
									generatedBy: source.id,
								};
								this.addActions(powerEffects);
							}
							this.addActions(
								{
									type: ACTION_EFFECT,
									effectType: EFFECT_TYPE_POWER_FINISHED,
									generatedBy: source.id,
								}
							)
							this.setSpellMetadata(currentPowerMetaData, source.id);
						}
					}
					break;
				}
				case ACTION_ENTER_PROMPT: {
					if (!('player' in action)) {
						throw new Error('Prompt without player!');
					}
					const savedActions = this.state.actions;
					let promptParams: PromptParamsType = {};
					let skipPrompt = false;
					const promptPlayer = this.getMetaValue(action.player, action.generatedBy);

					switch (action.promptType) {
						case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE: {
							promptParams = {
								source: this.getMetaValue(action.source, action.generatedBy),
							};
							break;
						}
						case PROMPT_TYPE_MAY_ABILITY: {
							promptParams = action.promptParams;
							break;
						}
						case PROMPT_TYPE_ALTERNATIVE: {
							promptParams = {
								alternatives: action.alternatives,
							}
							break;
						}
						case PROMPT_TYPE_PAYMENT_SOURCE: {
							promptParams = {
								paymentAmount: action.amount,
								paymentType: action.paymentType,
								cards: action.cards.map(convertCard),
							}
							break;
						}
						case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
							if (action.restriction && action.restrictions) {
								throw new Error('PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
							}
							const restrictions = action.restrictions || (action.restriction ? [
								{
									type: this.getMetaValue(action.restriction, action.generatedBy),
									value: this.getMetaValue(action.restrictionValue, action.generatedBy),
								},
							] : null);

							const zone = this.getMetaValue(action.zone, action.generatedBy) as ZoneType;
							const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
							const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);

							const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
							const cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;

							const maxNumberOfCards = Math.min(numberOfCards, cards.length);
							if (maxNumberOfCards > 0) {
								promptParams = {
									zone,
									zoneOwner,
									restrictions,
									numberOfCards: maxNumberOfCards,
									cards: cards.map(convertCard),
								};
							} else {
								skipPrompt = true;
							}
							break;
						}
						case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
							if (action.restriction && action.restrictions) {
								throw new Error('PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE error: single and multiple restrictions specified');
							}
							const restrictions = action.restrictions || (action.restriction ? [
								{
									type: this.getMetaValue(action.restriction, action.generatedBy),
									value: this.getMetaValue(action.restrictionValue, action.generatedBy),
								},
							] : null);

							const zone = this.getMetaValue(action.zone, action.generatedBy);
							const zoneOwner = this.getMetaValue(action.zoneOwner, action.generatedBy);
							const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);

							const zoneContent = (zone === ZONE_TYPE_IN_PLAY) ? this.getZone(zone, null).cards : this.getZone(zone, zoneOwner).cards;
							const cards = restrictions ? zoneContent.filter(this.makeCardFilter(restrictions)) : zoneContent;

							const maxNumberOfCards = Math.min(numberOfCards, cards.length);

							if (maxNumberOfCards > 0) {
								promptParams = {
									zone,
									zoneOwner,
									restrictions,
									numberOfCards: maxNumberOfCards,
									cards: cards.map(convertCard),
								};
							} else {
								skipPrompt = true;
							}
							break;
						}
						case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
							const zone = this.getMetaValue(action.promptParams.zone, action.generatedBy);
							const zoneOwner = this.getMetaValue(action.promptParams.zoneOwner, action.generatedBy);
							const numberOfCards = this.getMetaValue(action.promptParams.numberOfCards, action.generatedBy);
							const zoneContent = this.getZone(zone, zoneOwner).cards;
							const cards = zoneContent.slice(0, numberOfCards);
							promptParams = {
								zone,
								zoneOwner,
								numberOfCards,
								cards: cards.map(convertCard),
							};
							break;
						}
						case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
							if (action.restrictions) {
								const restrictionsWithValues = action.restrictions.map(({ type, value }: RestrictionObjectType) => ({
									type,
									value: this.getMetaValue(value, action.generatedBy as string),
								}));

								promptParams = {
									restrictions: restrictionsWithValues,
								};
							} else if (action.restriction) {
								promptParams = {
									restrictions: [
										{
											type: action.restriction,
											value: this.getMetaValue(action.restrictionValue, action.generatedBy),
										}
									],
								};
							}

							break;
						}
						case PROMPT_TYPE_CHOOSE_CARDS: {
							promptParams = action.promptParams;
							break;
						}
						case PROMPT_TYPE_NUMBER: {
							promptParams = {
								min: this.getMetaValue(action.min, action.generatedBy as string),
								max: this.getMetaValue(action.max, action.generatedBy as string),
							};
							break;
						}
						case PROMPT_TYPE_POWER_ON_MAGI: {
							promptParams = {
								magi: this.getMetaValue(action.magi, action.generatedBy),
							}
							break;
						}
						case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
							if (action.restriction) {
								promptParams = {
									amount: this.getMetaValue(action.amount, action.generatedBy),
									restrictions: [
										{
											type: action.restriction,
											value: this.getMetaValue(action.amount, action.generatedBy),
										},
									],
								};
							} else {
								promptParams = {
									amount: this.getMetaValue(action.amount, action.generatedBy),
								};
							}
							break;
						}
						case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
							if (action.restriction) {
								promptParams = {
									amount: this.getMetaValue(action.amount, action.generatedBy),
									restrictions: [
										{
											type: action.restriction,
											value: this.getMetaValue(action.amount, action.generatedBy),
										},
									],
								};
							} else {
								promptParams = {
									amount: this.getMetaValue(action.amount, action.generatedBy),
								}
							}
							break;
						}
						case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
							// console.dir(this.getSpellMetadata(action.generatedBy))
							const sourceZone = this.getMetaValue(action.sourceZone, action.generatedBy);
							const sourceZoneOwner = this.getMetaValue(action.sourceZoneOwner, action.generatedBy);
							const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy);
							const zoneContent = this.getZone(sourceZone, sourceZoneOwner).cards;
							const cards = zoneContent.slice(0, numberOfCards);

							promptParams = {
								sourceZone,
								sourceZoneOwner,
								numberOfCards,
								cards: cards.map(convertCard),
								targetZones: action.targetZones as ZoneType[],
							};
						}
					}

					if (!skipPrompt) {
						this.state = {
							...this.state,
							actions: [],
							savedActions,
							prompt: true,
							promptMessage: ('message' in action) ? action.message : '',
							promptPlayer,
							promptType: action.promptType,
							promptVariable: action.variable,
							promptGeneratedBy: action.generatedBy,
							promptParams,
						};
					}
					break;
				}
				case ACTION_EXIT_PROMPTS: {
					this.state = {
						...this.state,
						actions: [],
						savedActions: [],
						mayEffectActions: [],
						fallbackActions: [],
						prompt: false,
						promptType: null,
						promptMessage: undefined,
						promptGeneratedBy: undefined,
						promptVariable: undefined,
						promptParams: {},
						spellMetaData: {
							...this.state.spellMetaData,
						},
					};
					break;
				}
				case ACTION_RESOLVE_PROMPT: {
					if (this.state.promptType === PROMPT_TYPE_MAY_ABILITY) {
						const mayEffectActions = this.state.mayEffectActions || [];
						const fallbackActions = this.state.fallbackActions || [];
						const savedActions = this.state.savedActions || [];

						const actions = action.useEffect ? [...mayEffectActions, ...savedActions] : [...fallbackActions, ...savedActions];

						this.state = {
							...this.state,
							actions,
							savedActions: [],
							mayEffectActions: [],
							fallbackActions: [],
							prompt: false,
							promptType: null,
							promptMessage: undefined,
							promptGeneratedBy: undefined,
							promptVariable: undefined,
							promptParams: {},
							spellMetaData: {
								...this.state.spellMetaData,
							},
						};
					} else {
						const generatedBy = action.generatedBy || this.state.promptGeneratedBy || nanoid();
						const variable = action.variable || this.state.promptVariable;
						let currentActionMetaData = this.state.spellMetaData[generatedBy] || {};

						switch (this.state.promptType) {
							case PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE: {
								if ('cards' in action && action.cards) {
									if (this.state.promptParams.numberOfCards !== action.cards.length) {
										return false;
									}
									if (this.state.promptParams.restrictions) {
										const checkResult = this.state.promptParams.restrictions.every(({ type, value }) =>
											this.checkCardsForRestriction(action.cards as CardInGame[], type, value)
										);
										if (!checkResult) {
											return false;
										}
									}
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE]] = action.cards;
								}
								break;
							}
							case PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE: {
								if ('cards' in action && action.cards) {
									if (this.state.promptParams && this.state.promptParams.cards && this.state.promptParams.cards.length !== action.cards.length) {
										console.error('Number of cards is wrong')
										return false;
									}
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]] = action.cards;
								}
								break;
							}
							case PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES: {
								if ('cards' in action && action.cards) {
									const totalCards = Object.values(action.cards).flat()
									if (this.state.promptParams && this.state.promptParams.cards && this.state.promptParams.cards.length !== totalCards.length) {
										console.error('Number of cards is wrong')
										return false;
									}
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE]] = action.cards;
								}
							}
							case PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE: {
								if ('cards' in action && action.cards) {
									const expectedNumber = this.state?.promptParams?.numberOfCards || 0
									if (action.cards.length > expectedNumber) {
										return false;
									}
									if (this.state.promptParams.restrictions) {
										const checkResult = this.state.promptParams.restrictions.every(({ type, value }) =>
											this.checkCardsForRestriction(action.cards as CardInGame[], type, value)
										);
										if (!checkResult) {
											return false;
										}
									}
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE]] = action.cards;
								}
								break;
							}
							case PROMPT_TYPE_NUMBER:
								if ('number' in action) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_NUMBER]] = (typeof action.number === 'number') ? action.number : parseInt(action.number || '0', 10);
								}
								break;
							case PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE:
								if ('target' in action && action.target && this.state?.promptParams?.source) {
									if (this.state.promptParams.source.id === action.target?.id) {
										throw new Error('Got forbidden target on prompt');
									}
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE]] = action.target;
								}
								break;
							case PROMPT_TYPE_RELIC: {
								if ('target' in action) {
									if (action.target?.card.type !== TYPE_RELIC) {
										throw new Error('Got forbidden target on prompt');
									}
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_RELIC]] = action.target;
								}
								break;
							}
							case PROMPT_TYPE_OWN_SINGLE_CREATURE: {
								if ('target' in action && action.target) {
									const targetController = this.modifyByStaticAbilities(action.target, PROPERTY_CONTROLLER);
									if (this.state.promptPlayer !== targetController) {
										throw new Error('Not-controlled creature supplied to Own Creatures prompt');
									}
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_OWN_SINGLE_CREATURE]] = action.target;
								}
								break;
							}
							case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
								if ('target' in action && action.target) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_CREATURE_FILTERED]] = action.target;
								}
								break;
							}
							case PROMPT_TYPE_MAGI_WITHOUT_CREATURES: {
								if ('target' in action && action.target?.card.type === TYPE_MAGI && this.useSelector(SELECTOR_CREATURES_OF_PLAYER, action.target.data.controller).length == 0) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_MAGI_WITHOUT_CREATURES]] = action.target;
									break;
								}
							}
							case PROMPT_TYPE_SINGLE_CREATURE:
								if ('target' in action && action.target) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_CREATURE]] = action.target;
								}
								break;
							case PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI:
								if ('target' in action && action.target) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_CREATURE_OR_MAGI]] = action.target;
								}
								break;
							case PROMPT_TYPE_SINGLE_MAGI:
								if ('target' in action && action.target) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_SINGLE_MAGI]] = action.target;
								}
								break;
							case PROMPT_TYPE_CHOOSE_CARDS:
								if ('cards' in action) {
									// Should be a check against promptParams.availableCards
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_CHOOSE_CARDS]] = action.cards || [];
								}
								break;
							case PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES:
								if ('energyOnCreatures' in action && action.energyOnCreatures) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES]] = action.energyOnCreatures || [];
								}
								break;
							case PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES: {
								if ('energyOnCreatures' in action && action.energyOnCreatures) {
									const totalEnergy = Object.values(action.energyOnCreatures).reduce((a, b) => a + b, 0);
									if (totalEnergy === this.state.promptParams.amount) {
										currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES]] = action.energyOnCreatures || [];
									}
								}
								break;
							}
							case PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES: {
								if ('damageOnCreatures' in action) {
									const totalDamage = Object.values(action.damageOnCreatures).reduce((a, b) => a + b, 0);
									if (totalDamage === this.state.promptParams.amount) {
										currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES]] = action.damageOnCreatures || [];
									}
								}
								break;
							}
							case PROMPT_TYPE_PLAYER: {
								if ('targetPlayer' in action) {
									if (this.players.includes(action.targetPlayer)) {
										currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_PLAYER]] = action.targetPlayer;
									} else {
										console.error(`Unknown player: ${action.targetPlayer} in PROMPT_TYPE_PLAYER prompt resolution`);
									}
								} else {
									console.error('No player in PROMPT_TYPE_PLAYER prompt resolution');
								}
								break;
							}
							case PROMPT_TYPE_POWER_ON_MAGI: {
								if ('power' in action && 'source' in action) {
									const source: CardInGame = this.getMetaValue(action.source, action.generatedBy);
									const power = this.getMetaValue(action.power, action.generatedBy);

									if (source && power && source.card.data.powers && source.card.data.powers.some(p => p.name === power.name)) {
										currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_POWER_ON_MAGI]] = action.power;
									} else {
										console.error(`Unknown power: ${power.name || power} in PROMPT_TYPE_POWER_ON_MAGI prompt resolution`);
									}
								} else {
									console.error('No power or source in PROMPT_TYPE_POWER_ON_MAGI prompt resolution');
								}
								break;
							}
							case PROMPT_TYPE_ALTERNATIVE: {
								if ('alternative' in action) {
									currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_ALTERNATIVE]] = action.alternative;
								}
							}
							case PROMPT_TYPE_PAYMENT_SOURCE: {
								if ('target' in action && action.target && this.state.promptParams.paymentType && this.state.promptParams.paymentAmount) {
									const paymentSource = action.target;
									if (paymentSource.card.type === TYPE_MAGI ||
										(paymentSource.card.type === TYPE_CREATURE && paymentSource.card.data.paymentSource?.includes(this.state.promptParams.paymentType))
									) {
										if (paymentSource.data.energy >= this.state.promptParams.paymentAmount) {
											currentActionMetaData[variable || DEFAULT_PROMPT_VARIABLE[PROMPT_TYPE_ALTERNATIVE]] = action.target;
										} else {
											console.error(`This payment target doesn't have enough energy to pay for that`)
										}
									} else {
										console.error(`You cannot pay for ${this.state.promptParams.paymentType} from this`);
									}
								}
							}
						}
						const actions = this.state.savedActions || [];
						this.state = {
							...this.state,
							actions,
							savedActions: [],
							prompt: false,
							promptType: null,
							promptMessage: undefined,
							promptGeneratedBy: undefined,
							promptVariable: undefined,
							promptParams: {},
							spellMetaData: {
								...this.state.spellMetaData,
								[generatedBy]: currentActionMetaData,
							},
						};
					}
					break;
				}
				case ACTION_SELECT: {
					let result: any;
					switch (action.selector) {
						case SELECTOR_OWN_CARDS_IN_PLAY: {
							result = this.useSelector(SELECTOR_OWN_CARDS_IN_PLAY, action.player || 0);
							break;
						}
						case SELECTOR_OWN_CREATURES_OF_TYPE: {
							result = this.useSelector(SELECTOR_OWN_CREATURES_OF_TYPE, action.player || 0, this.getMetaValue(action.creatureType, action.generatedBy));
							break;
						}
						case SELECTOR_CREATURES_OF_TYPE: {
							result = this.useSelector(SELECTOR_CREATURES_OF_TYPE, null, this.getMetaValue<string>(action.creatureType, action.generatedBy));
							break;
						}
						case SELECTOR_CREATURES_NOT_OF_TYPE: {
							result = this.useSelector(SELECTOR_CREATURES_NOT_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
							break;
						}
						case SELECTOR_CARDS_WITH_ENERGIZE_RATE: {
							result = this.useSelector(SELECTOR_CARDS_WITH_ENERGIZE_RATE, null);
							break;
						}
						case SELECTOR_OPPONENT_ID: {
							result = this.useSelector(
								SELECTOR_OPPONENT_ID,
								action.player || 0,
								this.getMetaValue(action.opponentOf || action.player, action.generatedBy)
							);
							break;
						}
						case SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE: {
							result = this.useSelector(SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE, action.player || 0);
							break;
						}
						case SELECTOR_CREATURES_AND_MAGI: {
							const ownMagi = this.useSelector(SELECTOR_OWN_MAGI, action.player || 0);
							const enemyMagi = this.useSelector(SELECTOR_ENEMY_MAGI, action.player || 0);
							const creatures = this.useSelector(SELECTOR_CREATURES, null);
							result = [
								...(ownMagi instanceof Array ? ownMagi : []),
								...(enemyMagi instanceof Array ? enemyMagi : []),
								...(creatures instanceof Array ? creatures : []),
							];
							break;
						}
						case SELECTOR_CREATURES_OF_REGION: {
							result = this.useSelector(SELECTOR_CREATURES_OF_REGION, action.player || 0, action.region);
							break;
						}
						case SELECTOR_CREATURES_NOT_OF_REGION: {
							result = this.useSelector(SELECTOR_CREATURES_NOT_OF_REGION, action.player || 0, action.region);
							break;
						}
						case SELECTOR_OTHER_CREATURES_OF_TYPE: {
							const creatures = this.useSelector(SELECTOR_CREATURES_OF_TYPE, null, this.getMetaValue(action.creatureType, action.generatedBy));
							result = (creatures instanceof Array) ? creatures.filter((card: CardInGame) => card.id !== action.generatedBy) : [];
							break;
						}
						case SELECTOR_MAGI_OF_REGION: {
							const ownMagi = this.useSelector(SELECTOR_OWN_MAGI, action.player || 0);
							const enemyMagi = this.useSelector(SELECTOR_ENEMY_MAGI, action.player || 0);
							result = [
								...(ownMagi instanceof Array ? ownMagi : []),
								...(enemyMagi instanceof Array ? enemyMagi : []),
							].filter(magi => this.modifyByStaticAbilities(magi, PROPERTY_REGION) === action.region);
							break;
						}
						case SELECTOR_MAGI_NOT_OF_REGION: {
							const ownMagi = this.useSelector(SELECTOR_OWN_MAGI, action.player || 0);
							const enemyMagi = this.useSelector(SELECTOR_ENEMY_MAGI, action.player || 0);
							result = [
								...(ownMagi instanceof Array ? ownMagi : []),
								...(enemyMagi instanceof Array ? enemyMagi : []),
							].filter(magi => this.modifyByStaticAbilities(magi, PROPERTY_REGION) != action.region);
							break;
						}
						case SELECTOR_STATUS: {
							result = this.useSelector(SELECTOR_STATUS, null, action.status as StatusType);
							break;
						}
						case SELECTOR_CREATURES_WITHOUT_STATUS: {
							result = this.useSelector(SELECTOR_CREATURES_WITHOUT_STATUS, null, action.status);
							break;
						}
						case SELECTOR_NTH_CARD_OF_ZONE: {
							const zoneOwner = this.getMetaValue<number>(action.zoneOwner, action.generatedBy);
							const zoneType = this.getMetaValue<ZoneType>(action.zone, action.generatedBy);
							const cardNumber = this.getMetaValue<number>(action.cardNumber, action.generatedBy);
							result = this.selectNthCardOfZone(zoneOwner, zoneType, cardNumber, action.restrictions);
							break;
						}
						case SELECTOR_RANDOM_CARD_IN_HAND: {
							const zoneOwner = this.getMetaValue<number>(action.zoneOwner, action.generatedBy);
							result = this.selectRandomCardOfZone(zoneOwner, ZONE_TYPE_HAND);
							break;
						}
						case SELECTOR_MAGI_OF_PLAYER: {
							const owner = this.getMetaValue<number>(action.owner, action.generatedBy);

							result = this.useSelector(SELECTOR_OWN_MAGI, owner);
							break;
						}
						case SELECTOR_OWN_CARDS_IN_HAND: {
							if ('player' in action && typeof action.player == 'number') {
								const zoneOwner = this.getMetaValue<number>(action.player, action.generatedBy);
								result = this.getZone(ZONE_TYPE_HAND, zoneOwner).cards;
							} else {
								result = []
							}
							break;
						}
						case SELECTOR_CARDS_IN_HAND: {
							if ('zoneOwner' in action) {
								const zoneOwner = this.getMetaValue<number>(action.zoneOwner, action.generatedBy);
								result = this.getZone(ZONE_TYPE_HAND, zoneOwner).cards;
							} else {
								result = []
							}
							break;
						}
						// This selector is special
						// If there are more than one creature with the same (least) energy, it transforms into the corresponding prompt
						case SELECTOR_OWN_CREATURE_WITH_LEAST_ENERGY: {
							const creatures = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card =>
								this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == action.player &&
								card.card.type == TYPE_CREATURE
							);
							if (creatures.length) {
								const energies: Record<number, CardInGame[]> = {}
								let minEnergy = Infinity
								for (let creature of creatures) {
									const energy = creature.data.energy
									if (!(energy in energies)) {
										energies[energy] = []
									}
									energies[energy].push(creature)
									if (creature.data.energy < minEnergy) {
										minEnergy = creature.data.energy
									}
								}
								if (energies[minEnergy].length == 1) {
									result = energies[minEnergy]
								} else {
									result = []
									this.transformIntoActions({
										type: ACTION_ENTER_PROMPT,
										promptType: PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
										restrictions: [{
											type: RESTRICTION_OWN_CREATURE,
											value: '',
										}, {
											type: RESTRICTION_ENERGY_EQUALS,
											value: minEnergy,
										}],
										variable: action.variable || 'selected',
										generatedBy: action.generatedBy,
										player: action.player,
									})
								}
							} else {
								result = []
							}
							break;
						}
						default: {
							// @ts-ignore
							result = this.useSelector(action.selector, action.player);
						}
					}
					const variable = action.variable || 'selected';
					this.setSpellMetaDataField(variable, result, action.generatedBy || nanoid());
					break;
				}
				case ACTION_PASS: {
					var newStep: number;
					if (this.state.step === null) {
						// Null-start
						this.transformIntoActions({
							type: ACTION_EFFECT,
							effectType: EFFECT_TYPE_START_TURN,
							player: this.state.activePlayer,
							generatedBy: nanoid(),
						});
					} else {
						if (action.player === this.state.activePlayer) {
							newStep = (this.state.step + 1) % steps.length;

							if (newStep === 0) {
								this.stopTurnTimer();
								this.transformIntoActions(
									{
										type: ACTION_EFFECT,
										effectType: EFFECT_TYPE_END_OF_TURN,
										player: this.state.activePlayer,
										generatedBy: nanoid(),
									},
									{
										type: ACTION_EFFECT,
										effectType: EFFECT_TYPE_START_TURN,
										player: this.getOpponent(this.state.activePlayer),
										generatedBy: nanoid(),
									}
								);
							} else {
								this.transformIntoActions({
									type: ACTION_EFFECT,
									effectType: EFFECT_TYPE_START_STEP,
									player: this.state.activePlayer,
									step: newStep,
									generatedBy: nanoid(),
								});
							}
						}
					}

					break;
				}
				case ACTION_PLAY: {
					const castCards = ('card' in action) ? this.getMetaValue(action.card, action.generatedBy) : null;
					const castCard: CardInGame | null = castCards ? (castCards.length ? castCards[0] : castCards) : null;
					const player = ('payload' in action) ? action.payload.player : action.player || 0;
					const cardItself = ('payload' in action) ? action.payload.card : castCard;

					if (!cardItself) {
						throw new Error('No card itself found')
					}
					const playerHand = this.getZone(ZONE_TYPE_HAND, player);
					const cardInHand = playerHand.containsId(cardItself?.id || '');
					// baseCard is "abstract" card, CardInPlay is concrete instance
					const baseCard = ('payload' in action) ? action.payload.card.card : castCard?.card;
					if (cardInHand && baseCard) {
						const currentPriority = this.getCurrentPriority();
						const cardType = baseCard.type;
						if (
							(cardType == TYPE_CREATURE && currentPriority == PRIORITY_CREATURES) ||
							(cardType == TYPE_RELIC && currentPriority == PRIORITY_PRS) ||
							(cardType == TYPE_SPELL && currentPriority == PRIORITY_PRS) ||
							action.forcePriority
						) {
							const activeMagi = this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;
							if (!activeMagi) {
								throw new Error('Trying to play a card without Magi')
							}
							const totalCost = this.calculateTotalCost(cardItself);
							switch (cardType) {
								case TYPE_CREATURE: {
									const alternativePaymentSources = this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.data.paymentSource && card.card.data.paymentSource.includes(TYPE_CREATURE) && this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) == player);
									const alternativePaymentSourcesAbleToPay = alternativePaymentSources.filter(card => card.data.energy >= totalCost);

									if (activeMagi.data.energy >= totalCost || alternativePaymentSourcesAbleToPay.length > 0) {
										const availablePaymentSources: CardInGame[] = [
											...alternativePaymentSourcesAbleToPay,
											activeMagi.data.energy >= totalCost ? activeMagi : undefined
										].filter<CardInGame>((card): card is CardInGame => card instanceof CardInGame);

										const paymentActions: AnyEffectType[] = availablePaymentSources.length == 1 ? [{
											type: ACTION_EFFECT,
											effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
											from: availablePaymentSources[0],
											amount: totalCost,
											player: player,
											generatedBy: cardItself.id,
										}] : [{
											type: ACTION_ENTER_PROMPT,
											promptType: PROMPT_TYPE_PAYMENT_SOURCE,
											amount: totalCost,
											paymentType: TYPE_CREATURE,
											variable: 'paymentSource',
											cards: availablePaymentSources,
											player: player,
											generatedBy: cardItself.id,
										}, {
											type: ACTION_EFFECT,
											effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
											from: '$paymentSource',
											amount: totalCost,
											player: player,
											generatedBy: cardItself.id,
										}];
										this.transformIntoActions(
											...paymentActions,
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_PLAY_CREATURE,
												card: cardItself,
												player: player,
												generatedBy: cardItself.id,
											},
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_CREATURE_ENTERS_PLAY,
												target: '$creature_created',
												player: player,
												generatedBy: cardItself.id,
											},
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
												target: '$creature_created',
												player: player,
												amount: (baseCard.cost === COST_X || baseCard.cost === COST_X_PLUS_ONE || baseCard.cost === null) ? 0 : baseCard.cost,
												generatedBy: cardItself.id,
											} as StartingEnergyOnCreatureEffect,
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_PLAY_FINISHED,
												generatedBy: cardItself.id,
											}
										);
									}
									break;
								}
								case TYPE_RELIC: {
									const alreadyHasOne = this.getZone(ZONE_TYPE_IN_PLAY).cards
										.some(card => card.data.controller === player && card.card.name === baseCard.name);
									const relicRegion = baseCard.region;
									const magiRegion = activeMagi.card.region;
									const regionAllows = relicRegion === magiRegion || relicRegion === REGION_UNIVERSAL;

									if (!alreadyHasOne && regionAllows && typeof baseCard.cost == 'number' && activeMagi.data.energy >= baseCard.cost) {
										this.transformIntoActions(
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
												from: activeMagi,
												amount: totalCost,
												player,
												generatedBy: cardItself.id,
											},
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_PLAY_RELIC,
												card: cardItself,
												player,
												generatedBy: cardItself.id,
											},
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_RELIC_ENTERS_PLAY,
												card: '$relic_created',
												player,
												generatedBy: cardItself.id,
											},
											{
												type: ACTION_EFFECT,
												effectType: EFFECT_TYPE_PLAY_FINISHED,
												generatedBy: cardItself.id,
											}
										);
									}
									break;
								}
								case TYPE_SPELL: {
									if (activeMagi.data.energy >= totalCost || baseCard.cost === COST_X || baseCard.cost === COST_X_PLUS_ONE) {
										const enrichAction = <T>(effect: T): T & EnrichedAction => ({
											source: cardItself,
											player, // Spell can rewrite this to make opponent do something - draw a card, for example
											...effect,
											spell: true,
											generatedBy: cardItself.id,
										});
										const preparedEffects: AnyEffectType[] = baseCard.data?.effects?.map(enrichAction) || [];

										const testablePrompts = [
											PROMPT_TYPE_SINGLE_CREATURE,
											PROMPT_TYPE_RELIC,
											PROMPT_TYPE_OWN_SINGLE_CREATURE,
											PROMPT_TYPE_SINGLE_CREATURE_FILTERED,
										];

										const testablePromptFilter = (action: AnyEffectType): action is PromptType =>
											action.type === ACTION_ENTER_PROMPT && testablePrompts.includes(action.promptType);

										const allPrompts = preparedEffects.filter(testablePromptFilter);

										const allPromptsAreDoable = allPrompts.every(promptAction => {
											switch (promptAction.promptType) {
												case PROMPT_TYPE_SINGLE_CREATURE:
													return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.card.type === TYPE_CREATURE);
												case PROMPT_TYPE_RELIC:
													return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => card.card.type === TYPE_RELIC);
												case PROMPT_TYPE_OWN_SINGLE_CREATURE:
													return this.getZone(ZONE_TYPE_IN_PLAY).cards.some(card => this.modifyByStaticAbilities(card, PROPERTY_CONTROLLER) === promptAction.player);
												case PROMPT_TYPE_SINGLE_CREATURE_FILTERED: {
													if (promptAction.restrictions) {
														return promptAction.restrictions.every(({ type, value }) =>
															this.checkAnyCardForRestriction(this.getZone(ZONE_TYPE_IN_PLAY).cards, type, value)
														);
													} else if (promptAction.restriction) {
														return this.checkAnyCardForRestriction(
															this.getZone(ZONE_TYPE_IN_PLAY).cards.filter(card => card.card.type === TYPE_CREATURE),
															promptAction.restriction,
															promptAction.restrictionValue,
														);
													}
													return true;
												}
												default:
													return true;
											}
										});

										if (allPromptsAreDoable) {
											const regionPenalty = (activeMagi.card.region == baseCard.region || baseCard.region == REGION_UNIVERSAL) ? 0 : 1;
											const maxCost = baseCard.data.maxCostX || Infinity;
											const payEffects: AnyEffectType[] = (baseCard.cost === COST_X || baseCard.cost === COST_X_PLUS_ONE) ? [
												{
													type: ACTION_ENTER_PROMPT,
													promptType: PROMPT_TYPE_NUMBER,
													player,
													min: 1,
													max: Math.min(activeMagi.data.energy, maxCost) - regionPenalty - (baseCard.cost === COST_X_PLUS_ONE ? 1 : 0),
													variable: 'chosen_cost',
													generatedBy: cardItself.id,
												},
												{
													type: ACTION_CALCULATE,
													operandOne: 'chosen_cost',
													operandTwo: regionPenalty + (baseCard.cost === COST_X_PLUS_ONE ? 1 : 0),
													operator: CALCULATION_ADD,
													variable: 'totalCost',
													generatedBy: cardItself.id,
												},
												{
													type: ACTION_EFFECT,
													effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
													from: activeMagi,
													amount: '$totalCost',
													player: player,
													generatedBy: cardItself.id,
												}] : [{
													type: ACTION_EFFECT,
													effectType: EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
													from: activeMagi,
													amount: totalCost,
													player: player,
													generatedBy: cardItself.id,
												}
											];

											this.transformIntoActions(
												{
													type: ACTION_EFFECT,
													effectType: EFFECT_TYPE_PLAY_SPELL,
													card: cardItself,
													player: player,
													generatedBy: cardItself.id,
												},
												{
													type: ACTION_CALCULATE,
													operator: CALCULATION_SET,
													operandOne: player,
													variable: 'player',
													generatedBy: cardItself.id,
												},
												...payEffects,
												{
													type: ACTION_EFFECT,
													effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
													target: cardItself,
													bottom: false,
													sourceZone: ZONE_TYPE_HAND,
													destinationZone: ZONE_TYPE_DISCARD,
													player: player,
													generatedBy: cardItself.id,
												},
												...preparedEffects,
												{
													type: ACTION_EFFECT,
													effectType: EFFECT_TYPE_PLAY_FINISHED,
													generatedBy: cardItself.id,
												},
											);
											let currentMetaData = {
												source: cardItself,
											};
											this.setSpellMetadata(currentMetaData, cardItself.id);
										}
									}
									break;
								}
							}
						} else {
							console.error(`Wrong Priority: current is ${currentPriority} (step ${this.getCurrentStep()}, type is ${cardType})`);
						}
					} else {
						console.error('No card to play');
					}
					break;
				}
				case ACTION_EFFECT: {
					if (action.effectType in actionMap) {
						const transform = this.transformIntoActions.bind(this)
						const actionTransformer = actionMap[action.effectType] as ActionTransformer<typeof action.effectType>;
						actionTransformer.call(this as State, action, transform, this.state)
					}
					break;
				}
			} // switch (action.type)

		} // while(this.hasActions())

		// SBA for Magi losing
		if (!this.state.prompt) {
			const sbActions: AnyEffectType[] = [];
			this.players.forEach(player => {
				if (this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).length === 1) {
					const magi = this.getZone(ZONE_TYPE_ACTIVE_MAGI, player).card;

					if (!magi) {
						throw new Error('Trying to defeat missing Magi')
					}
					const creatures = this.useSelector(SELECTOR_OWN_CREATURES, player);
					if (magi.data.energy === 0 && creatures instanceof Array && creatures.length === 0) {
						sbActions.push({
							type: ACTION_EFFECT,
							effectType: EFFECT_TYPE_MAGI_IS_DEFEATED,
							source: null,
							target: magi,
							generatedBy: 'thegame',//nanoid(),
							player,
						});
					}
				}
			});
			if (sbActions.length > 0) {
				this.addActions(...sbActions);
				this.update({
					type: ACTION_NONE,
				});
			}
		}
		return true;
	}
}

export {
	TYPE_CREATURE,
	TYPE_MAGI,
	TYPE_RELIC,
	TYPE_SPELL,

	ACTION_PASS,
	ACTION_PLAY,
	ACTION_POWER,
	ACTION_EFFECT,
	ACTION_SELECT,
	ACTION_CALCULATE,
	ACTION_ENTER_PROMPT,
	ACTION_RESOLVE_PROMPT,
	ACTION_GET_PROPERTY_VALUE,
	ACTION_ATTACK,
	ACTION_PLAYER_WINS,

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

	CALCULATION_SET,
	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
	CALCULATION_MAX,
	CALCULATION_MULTIPLY,

	SELECTOR_CREATURES,
	SELECTOR_CREATURES_AND_MAGI,
	SELECTOR_OWN_MAGI,
	SELECTOR_ENEMY_MAGI,
	SELECTOR_CREATURES_OF_REGION,
	SELECTOR_CREATURES_NOT_OF_REGION,
	SELECTOR_OWN_CREATURES,
	SELECTOR_ENEMY_CREATURES,
	SELECTOR_TOP_MAGI_OF_PILE,
	SELECTOR_MAGI_OF_REGION,
	SELECTOR_OPPONENT_ID,
	SELECTOR_MAGI_NOT_OF_REGION,
	SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_CARDS_WITH_ENERGIZE_RATE,
	SELECTOR_OWN_CARDS_IN_PLAY,

	NO_PRIORITY,
	PRIORITY_PRS,
	PRIORITY_ATTACK,
	PRIORITY_CREATURES,

	PROMPT_TYPE_NUMBER,
	PROMPT_TYPE_SINGLE_CREATURE,
	PROMPT_TYPE_SINGLE_MAGI,
	PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE,
	PROMPT_TYPE_CHOOSE_CARDS,

	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_RESHUFFLE_DISCARD,
	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_PLAY_CREATURE,
	EFFECT_TYPE_PLAY_RELIC,
	EFFECT_TYPE_PLAY_SPELL,
	EFFECT_TYPE_CREATURE_ENTERS_PLAY,
	EFFECT_TYPE_RELIC_ENTERS_PLAY,
	EFFECT_TYPE_MAGI_IS_DEFEATED,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
	EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC,
	EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_ENERGIZE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_DISCARD_CREATURE_OR_RELIC,
	EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
	EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
	EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
	EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
	EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
	EFFECT_TYPE_CREATURE_IS_DEFEATED, // Possibly redundant
	EFFECT_TYPE_BEFORE_DAMAGE,
	EFFECT_TYPE_DEAL_DAMAGE,
	EFFECT_TYPE_AFTER_DAMAGE,
	EFFECT_TYPE_CREATURE_ATTACKS,
	EFFECT_TYPE_CREATURE_IS_ATTACKED,
	EFFECT_TYPE_START_OF_TURN,
	EFFECT_TYPE_END_OF_TURN,
	EFFECT_TYPE_MAGI_FLIPPED,
	EFFECT_TYPE_FIND_STARTING_CARDS,
	EFFECT_TYPE_DRAW_REST_OF_CARDS,

	REGION_UNIVERSAL,

	COST_X,
	COST_X_PLUS_ONE,

	ZONE_TYPE_HAND,
	ZONE_TYPE_IN_PLAY,
	ZONE_TYPE_DISCARD,
	ZONE_TYPE_ACTIVE_MAGI,
	ZONE_TYPE_MAGI_PILE,
	ZONE_TYPE_DECK,
	ZONE_TYPE_DEFEATED_MAGI,
};
