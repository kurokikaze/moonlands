import CardInGame from '../classes/CardInGame';
import {
    ACTION_CALCULATE,
    ACTION_ENTER_PROMPT,

    CALCULATION_SET,
	CALCULATION_DOUBLE,
	CALCULATION_ADD,
	CALCULATION_SUBTRACT,
	CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE,
	CALCULATION_HALVE_ROUND_DOWN,
	CALCULATION_HALVE_ROUND_UP,
	CALCULATION_MIN,
    CALCULATION_MAX,
    
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

    ACTION_PLAYER_WINS,
    ACTION_PASS,
    ACTION_CONCEDE,
    RESTRICTION_MAGI_WITHOUT_CREATURES,
    COST_X,
    ACTION_PLAY,
    ACTION_POWER,
} from '../const';

import { ResolvePromptType } from './resolvePrompt';
import { SelectType } from './select';
import { EffectTypeType, EffectType } from './effect';
import { PromptTypeType, PropertyType, ConditionType } from './common';
import { AttackEffect } from './attack';
export { AttackerDealsDamageEffect, DefenderDealsDamageEffect } from './attack';
export { Region, CardType, PromptTypeType, PropertyType, ConditionType, ZoneType } from './common';
export { SelectType, SelectorTypeType, SelectorParams, RefinedSelectParams } from './select';
export { EffectType, MoveCardBetwenZonesEffect } from './effect';
export { LogEntryType } from './log';
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
    energyLossThreshold?: number;
    ableToAttack?: boolean;
    burrowed?: boolean;
}

export interface EnrichedAction {
    source?: CardInGame;
}

type PowerType = {
    name: string;
    text: string;
    cost: number | typeof COST_X;
    effects: AnyEffectType[];
}

type StaticAbilityType = {
	name: string,
	text: string,
    selector: string,
    selectorParameter?: string, 
	property: PropertyType,
	modifier: {
		operator: string,
		operandOne: number | string | boolean,
	},
}

export type PromptParams = {
	promptType: PromptTypeType;
    zone?: string;
    message?: string;
    source?: string;
    player?: number | string;
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

// type PropertyType = typeof PROPERTY_CONTROLLER | typeof PROPERTY_ID | typeof ACTION_PROPERTY | typeof PROPERTY_TYPE | typeof PROPERTY_REGION | typeof PROPERTY_CREATURE_TYPES| typeof PROPERTY_ENERGY_COUNT | typeof PROPERTY_COST | typeof PROPERTY_MAGI_STARTING_ENERGY;

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
} | { type: typeof RESTRICTION_PLAYABLE; value?: string; }

type ReplacingEffectType = {
    effectType: EffectTypeType;
    target?: string;
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

export type CalculateType = EnrichedAction & {
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

export type PropertyGetterType = EnrichedAction & PropertyGetterParams & {
    type: typeof ACTION_GET_PROPERTY_VALUE;
    generatedBy?: string;
}

type PlayerWinType = EnrichedAction & {
    type: typeof ACTION_PLAYER_WINS;
    player: number;
    generatedBy?: string;
}

type PassType = EnrichedAction & {
    type: typeof ACTION_PASS;
    player: number;
    generatedBy?: string;
}

type ConcedeType = EnrichedAction & {
    type: typeof ACTION_CONCEDE;
    player: number;
    generatedBy?: string;
}

export type NormalPlayType = EnrichedAction & {
    type: typeof ACTION_PLAY;
    player: number;
    payload: {
        card: CardInGame;
        player: number;
    }
    forcePriority: false;
    generatedBy?: string;
}

export type ForcedPlayType = EnrichedAction & {
    type: typeof ACTION_PLAY;
    card: string | CardInGame;
    sourceZone: string;
    destinationZone: string;
    forcePriority: boolean;
    player?: number;
    generatedBy?: string;
}

type PlayType = NormalPlayType | ForcedPlayType;

type PowerActionType = EnrichedAction & {
    type: typeof ACTION_POWER;
    power: PowerType;
    source: CardInGame;
    player: number;
    generatedBy?: string;
}

export type AnyEffectType = EffectType | PromptType | SelectType | CalculateType | PropertyGetterType | PlayerWinType | PassType | ConcedeType | ResolvePromptType | PlayType | PowerActionType | AttackEffect;