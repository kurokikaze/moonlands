import CardInGame from '../classes/CardInGame';
import { ACTION_CALCULATE, ACTION_PLAY, ACTION_POWER, ACTION_NONE, ACTION_PLAYER_WINS, ACTION_PASS, ACTION_CONCEDE, ACTION_TIME_NOTIFICATION, ACTION_EXIT_PROMPTS, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE, CALCULATION_MULTIPLY, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, ACTION_GET_PROPERTY_VALUE, PROTECTION_FROM_EFFECTS, PROTECTION_FROM_POWERS, PROTECTION_FROM_SPELLS, PROTECTION_TYPE_DISCARDING_FROM_PLAY, PROTECTION_TYPE_ENERGY_GAIN, PROTECTION_TYPE_ENERGY_LOSS, PROTECTION_TYPE_GENERAL, COST_X } from '../const';
import { ResolvePromptType } from './resolvePrompt';
import { SelectorTypeType, SelectType } from './select';
import { EffectTypeType, EffectType } from './effect';
import { PromptType } from './prompt';
import { PropertyType, ConditionType, ExpirationObjectType, RestrictionObjectType } from './common';
import { AttackEffect } from './attack';
export { AttackerDealsDamageEffect, DefenderDealsDamageEffect } from './attack';
export { Region, CardType, PromptTypeType, PropertyType, ConditionType, ZoneType, RestrictionType, RestrictionObjectType } from './common';
export { SelectType, SelectorTypeType, SelectorParams, RefinedSelectParams } from './select';
export { EffectType, MoveCardBetwenZonesEffect } from './effect';
export { PromptType, PromptParams } from './prompt';
export { LogEntryType } from './log';
declare type ProtectionFromType = typeof PROTECTION_FROM_SPELLS | typeof PROTECTION_FROM_EFFECTS | typeof PROTECTION_FROM_POWERS;
declare type ProtectionTypeType = typeof PROTECTION_TYPE_ENERGY_LOSS | typeof PROTECTION_TYPE_ENERGY_GAIN | typeof PROTECTION_TYPE_DISCARDING_FROM_PLAY | typeof PROTECTION_TYPE_GENERAL;
export declare type ProtectionType = {
    from: ProtectionFromType;
    type: ProtectionTypeType;
    restrictions?: RestrictionObjectType[];
};
export declare type CardData = {
    text?: string;
    startingEnergy?: number;
    energize?: number;
    startingCards?: string[];
    attacksPerTurn?: number;
    canAttackMagiDirectly?: boolean;
    canPackHunt?: boolean;
    powers?: PowerType[];
    protection?: ProtectionType;
    staticAbilities?: StaticAbilityType[];
    effects?: AnyEffectType[];
    triggerEffects?: TriggerEffectType[];
    replacementEffects?: ReplacementEffectType[];
    energyLossThreshold?: number;
    ableToAttack?: boolean;
    canBeAttacked?: boolean;
    burrowed?: boolean;
    maxCostX?: number;
};
export interface EnrichedAction {
    source?: CardInGame;
    power?: boolean;
    spell?: boolean;
    attack?: boolean;
    replacedBy?: string[];
}
declare type PowerType = {
    name: string;
    text: string;
    cost: number | typeof COST_X;
    effects: AnyEffectType[];
};
export declare type StaticAbilityType = {
    name: string;
    text: string;
    selector: SelectorTypeType;
    selectorParameter?: string | number;
    property: PropertyType;
    subProperty?: string;
    modifier: {
        operator: OperatorType;
        operandOne: number | boolean | Record<string, any>;
    };
};
export declare type FindType = {
    effectType: EffectTypeType;
    conditions: ConditionType[];
};
export declare type TriggerEffectType = {
    name?: string;
    text?: string;
    mayEffect?: boolean;
    find: FindType;
    effects: AnyEffectType[];
};
export declare type ReplacementEffectType = {
    name?: string;
    text?: string;
    find: FindType;
    replaceWith: ReplacingEffectType | EffectType | (ReplacingEffectType | EffectType | PromptType)[];
    mayEffect?: boolean;
    oncePerTurn?: boolean;
};
declare type ReplacingEffectType = {
    effectType: EffectTypeType;
    target?: string;
};
export declare type OperatorType = typeof CALCULATION_SET | typeof CALCULATION_DOUBLE | typeof CALCULATION_ADD | typeof CALCULATION_SUBTRACT | typeof CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE | typeof CALCULATION_MULTIPLY | typeof CALCULATION_HALVE_ROUND_DOWN | typeof CALCULATION_HALVE_ROUND_UP | typeof CALCULATION_MIN | typeof CALCULATION_MAX;
export declare type CalculateParams = {
    operator: OperatorType;
    operandOne: string | number;
    propertyOne?: string | null;
    operandTwo?: string | number;
    propertyTwo?: string | null;
    variable: string;
};
export declare type CalculateType = CalculateParams & EnrichedAction & {
    type: typeof ACTION_CALCULATE;
    generatedBy?: string;
};
export declare type PropertyGetterParams = {
    property: PropertyType;
    target?: string;
    variable: string;
};
export declare type PropertyGetterType = EnrichedAction & PropertyGetterParams & {
    type: typeof ACTION_GET_PROPERTY_VALUE;
    generatedBy?: string;
};
declare type PlayerWinType = EnrichedAction & {
    type: typeof ACTION_PLAYER_WINS;
    player: number;
    generatedBy?: string;
};
declare type PassType = EnrichedAction & {
    type: typeof ACTION_PASS;
    player: number;
    generatedBy?: string;
};
declare type ConcedeType = EnrichedAction & {
    type: typeof ACTION_CONCEDE;
    player: number;
    generatedBy?: string;
};
export declare type NormalPlayType = EnrichedAction & {
    type: typeof ACTION_PLAY;
    player: number;
    payload: {
        card: CardInGame;
        player: number;
    };
    forcePriority: false;
    generatedBy?: string;
};
export declare type ForcedPlayType = EnrichedAction & {
    type: typeof ACTION_PLAY;
    card: string | CardInGame;
    sourceZone: string;
    destinationZone: string;
    forcePriority: boolean;
    player?: number;
    generatedBy?: string;
};
declare type NoneType = EnrichedAction & {
    type: typeof ACTION_NONE;
    generatedBy?: string;
};
declare type PlayType = NormalPlayType | ForcedPlayType;
declare type PowerActionType = EnrichedAction & {
    type: typeof ACTION_POWER;
    power: PowerType;
    source: CardInGame;
    player: number;
    generatedBy?: string;
};
declare type TimeNotificationAction = EnrichedAction & {
    type: typeof ACTION_TIME_NOTIFICATION;
    player: number;
    generatedBy?: string;
};
declare type ExitPromptsAction = EnrichedAction & {
    type: typeof ACTION_EXIT_PROMPTS;
    generatedBy?: string;
};
export declare type ContinuousEffectType = {
    staticAbilities?: StaticAbilityType[];
    triggerEffects?: TriggerEffectType[];
    expiration: ExpirationObjectType;
    player: number;
    id: string;
};
export declare type AnyEffectType = EffectType | PromptType | SelectType | CalculateType | PropertyGetterType | PlayerWinType | PassType | ConcedeType | ResolvePromptType | PlayType | PowerActionType | AttackEffect | TimeNotificationAction | NoneType | ExitPromptsAction;
