import {
	TYPE_CREATURE,
	TYPE_MAGI,
	TYPE_RELIC,
	TYPE_SPELL,

    ACTION_EFFECT,
    ACTION_SELECT,
    ACTION_CALCULATE,
    ACTION_ENTER_PROMPT,
    ACTION_PROPERTY,

    EFFECT_TYPE_END_OF_TURN,
	EFFECT_TYPE_NONE,
	EFFECT_TYPE_DRAW,
	EFFECT_TYPE_ROLL_DIE,
	EFFECT_TYPE_PLAY_CREATURE,
	EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP,
	EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI,
	EFFECT_TYPE_ADD_DELAYED_TRIGGER,
	EFFECT_TYPE_PLAY_RELIC,
	EFFECT_TYPE_PLAY_SPELL,
	EFFECT_TYPE_MAGI_IS_DEFEATED,
	EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY,
	EFFECT_TYPE_CREATURE_ENTERS_PLAY,
	EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE,
	EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY,
	EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY,
	EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI,
	EFFECT_TYPE_ADD_ENERGY_TO_CREATURE,
	EFFECT_TYPE_ADD_ENERGY_TO_MAGI,
	EFFECT_TYPE_ENERGIZE,
	EFFECT_TYPE_CONDITIONAL,
	EFFECT_TYPE_START_OF_TURN,
	EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
	EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES,
	EFFECT_TYPE_CREATURE_DEFEATS_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI,
	EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI,
	EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY,
	EFFECT_TYPE_DEFENDER_DEALS_DAMAGE,
	EFFECT_TYPE_DEAL_DAMAGE,
	EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY,
	EFFECT_TYPE_MOVE_ENERGY,
	EFFECT_TYPE_CREATURE_ATTACKS,
	EFFECT_TYPE_BEFORE_DAMAGE,
	EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
    EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE,
    EFFECT_TYPE_PAYING_ENERGY_FOR_POWER,

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

    CALCULATION_SET,
	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
    CALCULATION_MAX,
    
    PROPERTY_CONTROLLER,
    PROPERTY_ID,
    PROPERTY_TYPE,
    PROPERTY_REGION,
    PROPERTY_CREATURE_TYPES,
    PROPERTY_ENERGY_COUNT,
    PROPERTY_COST,
    PROPERTY_MAGI_STARTING_ENERGY,
    ACTION_GET_PROPERTY_VALUE,

    RESTRICTION_OWN_CREATURE,
	RESTRICTION_OPPONENT_CREATURE,
	RESTRICTION_ENERGY_LESS_THAN_STARTING,
	RESTRICTION_REGION,
	RESTRICTION_TYPE,
    RESTRICTION_CREATURE_TYPE,
    RESTRICTION_PLAYABLE,
	RESTRICTION_ENERGY_LESS_THAN,
    RESTRICTION_CREATURE_WAS_ATTACKED,
    RESTRICTION_STATUS,

	REGION_CALD,
	REGION_NAROOM,
	REGION_OROTHE,
	REGION_ARDERIAL,
	REGION_UNDERNEATH,
	REGION_UNIVERSAL,
	REGION_BOGRATH,
    ACTION_PLAYER_WINS,
    EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES,
    EFFECT_TYPE_START_TURN,
    EFFECT_TYPE_START_STEP,
    ACTION_PASS,
    EFFECT_TYPE_DRAW_REST_OF_CARDS,
    EFFECT_TYPE_MAGI_FLIPPED,
    EFFECT_TYPE_FIND_STARTING_CARDS,
    EFFECT_TYPE_RESHUFFLE_DISCARD,
    ACTION_CONCEDE,
    RESTRICTION_MAGI_WITHOUT_CREATURES,
} from '../const';

export type Region =
    typeof REGION_CALD |
    typeof REGION_NAROOM |
    typeof REGION_OROTHE |
    typeof REGION_ARDERIAL | 
    typeof REGION_UNDERNEATH |
    typeof REGION_UNIVERSAL |
    typeof REGION_BOGRATH;

export type CardType = typeof TYPE_CREATURE | typeof TYPE_MAGI | typeof TYPE_RELIC | typeof TYPE_SPELL;

export type CardData = {
    text?: string;
    startingEnergy?: number;
    energize?: number;
    startingCards?: string[];
	attacksPerTurn?: number;
    canAttackMagiDirectly?: boolean;
    canPackHunt?: boolean;
	powers?: PowerType[];
	staticAbilities?: StaticAbilityType[];
    effects?: AnyEffectType[];
    triggerEffects?: TriggerEffectType[];
    replacementEffects?: ReplacementEffectType[];
}

type EffectTypeType =
	typeof EFFECT_TYPE_END_OF_TURN |
	typeof EFFECT_TYPE_NONE |
	typeof EFFECT_TYPE_DRAW |
	typeof EFFECT_TYPE_ROLL_DIE |
	typeof EFFECT_TYPE_PLAY_CREATURE |
	typeof EFFECT_TYPE_DRAW_CARDS_IN_DRAW_STEP |
	typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI |
	typeof EFFECT_TYPE_ADD_DELAYED_TRIGGER |
	typeof EFFECT_TYPE_PLAY_RELIC |
	typeof EFFECT_TYPE_PLAY_SPELL |
	typeof EFFECT_TYPE_MAGI_IS_DEFEATED |
	typeof EFFECT_TYPE_DISCARD_RELIC_FROM_PLAY |
	typeof EFFECT_TYPE_CREATURE_ENTERS_PLAY |
	typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE |
	typeof EFFECT_TYPE_RETURN_CREATURE_DISCARDING_ENERGY |
	typeof EFFECT_TYPE_RETURN_CREATURE_RETURNING_ENERGY |
	typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE |
	typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE_OR_MAGI |
	typeof EFFECT_TYPE_ADD_ENERGY_TO_CREATURE |
	typeof EFFECT_TYPE_ADD_ENERGY_TO_MAGI |
	typeof EFFECT_TYPE_ENERGIZE |
	typeof EFFECT_TYPE_CONDITIONAL |
	typeof EFFECT_TYPE_START_OF_TURN |
	typeof EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES |
	typeof EFFECT_TYPE_MOVE_CARDS_BETWEEN_ZONES |
	typeof EFFECT_TYPE_CREATURE_DEFEATS_CREATURE |
	typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE |
	typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI |
	typeof EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE_OR_MAGI |
	typeof EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY |
	typeof EFFECT_TYPE_DEFENDER_DEALS_DAMAGE |
	typeof EFFECT_TYPE_DEAL_DAMAGE |
	typeof EFFECT_TYPE_RESTORE_CREATURE_TO_STARTING_ENERGY |
	typeof EFFECT_TYPE_MOVE_ENERGY |
	typeof EFFECT_TYPE_CREATURE_ATTACKS |
	typeof EFFECT_TYPE_BEFORE_DAMAGE |
	typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND |
    typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE |
    typeof EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES |
    typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER |
    typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI |
    typeof EFFECT_TYPE_MAGI_FLIPPED;

type PowerType = {}

type StaticAbilityType = {
	name: string,
	text: string,
    selector: string,
    selectorParameter?: string, 
	property: string,
	modifier: {
		operator: string,
		operandOne: number | string | boolean,
	},
}

export type PromptParams = {
	promptType: string;
    zone?: string;
    message?: string;
    source?: string;
    player?: string;
    min?: number | string;
    max?: number | string; 
    zoneOwner?: string;
    restriction?: RestrictionType;
    restrictionValue?: string | number | boolean;
	restrictions?: RestrictionObjectType[];
	numberOfCards?: number;
	variable?: string;
}

export type PromptType = PromptParams & {
    type: typeof ACTION_ENTER_PROMPT;
    promptParams?: {

    },
    generatedBy?: string;
}

type TriggerEffectType = {
    name?: string;
    text?: string;
    find: {
        effectType: EffectTypeType;
        conditions: ConditionType[];
    },
    effects: AnyEffectType[];
}

type ReplacementEffectType = {
    name?: string;
    text?: string;
    find: {
        effectType: EffectTypeType;
        conditions: ConditionType[];
    },
    replaceWith: ReplacingEffectType | EffectType;   
}

type PropertyType = typeof PROPERTY_CONTROLLER | typeof PROPERTY_ID | typeof ACTION_PROPERTY | typeof PROPERTY_TYPE | typeof PROPERTY_REGION | typeof PROPERTY_CREATURE_TYPES| typeof PROPERTY_ENERGY_COUNT | typeof PROPERTY_COST | typeof PROPERTY_MAGI_STARTING_ENERGY;

export type ConditionType = {
    objectOne: string,
    propertyOne: PropertyType;
    comparator: '<' | '=' | '>' | '<=' | '>=' | '!=' | 'includes';
    objectTwo: string | number | boolean;
    propertyTwo: PropertyType;
}

export type RestrictionType = typeof RESTRICTION_CREATURE_WAS_ATTACKED | 
    typeof RESTRICTION_OWN_CREATURE |
    typeof RESTRICTION_OPPONENT_CREATURE |
    typeof RESTRICTION_ENERGY_LESS_THAN_STARTING |
    typeof RESTRICTION_REGION |
    typeof RESTRICTION_TYPE |
    typeof RESTRICTION_CREATURE_TYPE |
    typeof RESTRICTION_PLAYABLE |
    typeof RESTRICTION_ENERGY_LESS_THAN | 
    typeof RESTRICTION_STATUS |
    typeof RESTRICTION_MAGI_WITHOUT_CREATURES;


export type RestrictionObjectType = {
	type: RestrictionType;
	value: string;
} | { type: typeof RESTRICTION_PLAYABLE }

type ReplacingEffectType = {
    effectType: EffectTypeType;
    target?: string;
}

export type SelectorParams = {
	selector: SelectorTypeType,
	variable?: string,
	opponentOf?: string,
	creatureType?: string,
	region?: Region,
	status?: string,
}

export type SelectorTypeType = typeof SELECTOR_OPPONENT_ID |
    typeof SELECTOR_MAGI |
    typeof SELECTOR_OPPONENT_ID |
    typeof SELECTOR_MAGI |
    typeof SELECTOR_OWN_MAGI |
    typeof SELECTOR_CREATURES |
    typeof SELECTOR_ENEMY_MAGI |
    typeof SELECTOR_RELICS |
    typeof SELECTOR_CREATURES_AND_MAGI |
    typeof SELECTOR_CREATURES_OF_REGION |
    typeof SELECTOR_CREATURES_NOT_OF_REGION |
    typeof SELECTOR_CREATURES_NOT_OF_TYPE |
    typeof SELECTOR_OWN_CREATURES |
    typeof SELECTOR_ENEMY_CREATURES |
    typeof SELECTOR_MAGI_OF_REGION |
    typeof SELECTOR_MAGI_NOT_OF_REGION |
    typeof SELECTOR_TOP_MAGI_OF_PILE |
    typeof SELECTOR_CARDS_WITH_ENERGIZE_RATE |
    typeof SELECTOR_OWN_CREATURES_OF_TYPE |
    typeof SELECTOR_CREATURES_OF_TYPE |
    typeof SELECTOR_OWN_SPELLS_IN_HAND |
    typeof SELECTOR_OTHER_CREATURES_OF_TYPE |
    typeof SELECTOR_OWN_CREATURES_WITH_STATUS |
    typeof SELECTOR_CREATURES_WITHOUT_STATUS |
    typeof SELECTOR_OWN_CARDS_WITH_ENERGIZE_RATE |
    typeof SELECTOR_OWN_CARDS_IN_PLAY |
    typeof SELECTOR_STATUS;

export type SelectType =  SelectorParams & {
    type: typeof ACTION_SELECT;
}

export type EffectType = {
    type: typeof ACTION_EFFECT;
    effectType: EffectTypeType;
    generatedBy?: string;
} | CardMovedBetweenZonesEffect | PayingEnergyForPowerEffect | StartTurnEffect | StartOfTurnEffect | StartStepEffect | EndOfTurnEffect | DrawEffect | DrawRestOfCardsEffect | MagiFlippedEffect | AddStartingEnergyToMagi | FindStartingCardsEffect | ReshuffleDiscardEffect;

type PayingEnergyForPowerEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER;
    target: string;
    amount: string | number;
    generatedBy: string;
}

type DrawEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_DRAW;
    stepEffect?: boolean;
    player: number;
    generatedBy: string;
}

type DrawRestOfCardsEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_DRAW_REST_OF_CARDS,
    drawnCards: string;
    generatedBy?: string;
}

type CardMovedBetweenZonesEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_CARD_MOVED_BETWEEN_ZONES;
    sourceCard: any;
    sourceZone: string;
    destinationCard: any;
    destinationZone: string;
    generatedBy: string;
}

type StartTurnEffect = {
    type: typeof ACTION_EFFECT,
    effectType: typeof EFFECT_TYPE_START_TURN;
    player: number;
    generatedBy: string;
}

type StartOfTurnEffect = {
    type: typeof ACTION_EFFECT,
    effectType: typeof EFFECT_TYPE_START_OF_TURN;
    player: number;
    generatedBy: string;
}

type StartStepEffect = {
    type: typeof ACTION_EFFECT,
    effectType: typeof EFFECT_TYPE_START_STEP;
    player: number,
    step: number,
    generatedBy: string;
}

type EndOfTurnEffect = {
    type: typeof ACTION_EFFECT,
    effectType: typeof EFFECT_TYPE_END_OF_TURN;
    player: number;
    generatedBy: string;
}

type MagiFlippedEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_MAGI_FLIPPED;
    target: string;
}

type AddStartingEnergyToMagi = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_ADD_STARTING_ENERGY_TO_MAGI;
    target: string;
}

type FindStartingCardsEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_FIND_STARTING_CARDS;
    cards: string;
}

type ReshuffleDiscardEffect = {
    type: typeof ACTION_EFFECT;
    effectType: typeof EFFECT_TYPE_RESHUFFLE_DISCARD,
    player: number;
}

type OperatorType = typeof CALCULATION_SET |
    typeof CALCULATION_DOUBLE |
    typeof CALCULATION_ADD |
    typeof CALCULATION_SUBTRACT |
    typeof CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE |
    typeof CALCULATION_HALVE_ROUND_DOWN |
    typeof CALCULATION_HALVE_ROUND_UP |
    typeof CALCULATION_MIN |
    typeof CALCULATION_MAX;

export type CalculateType = {
    type: typeof ACTION_CALCULATE;
    operator: OperatorType;
    operandOne: string | number;
    operandTwo?: string | number;
    variable: string;
    generatedBy?: string;
}

export type PropertyGetterParams = {
    property: PropertyType;
    target?: string;
    variable: string;
}

export type PropertyGetterType = PropertyGetterParams & {
    type: typeof ACTION_GET_PROPERTY_VALUE;
    generatedBy?: string;
}

type PlayerWinType = {
    type: typeof ACTION_PLAYER_WINS;
    player: number;
}

type PassType = {
    type: typeof ACTION_PASS;
}

type ConcedeType = {
    type: typeof ACTION_CONCEDE;
    player: number;
}

export type AnyEffectType = EffectType | PromptType | SelectType | CalculateType | PropertyGetterType | PlayerWinType | PassType | ConcedeType;
