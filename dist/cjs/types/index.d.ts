import CardInGame, { ConvertedCard, HiddenConvertedCard } from '../classes/CardInGame';
import { ACTION_CALCULATE, ACTION_PLAY, ACTION_POWER, ACTION_NONE, ACTION_PLAYER_WINS, ACTION_PASS, ACTION_CONCEDE, ACTION_TIME_NOTIFICATION, ACTION_EXIT_PROMPTS, CALCULATION_SET, CALCULATION_DOUBLE, CALCULATION_ADD, CALCULATION_SUBTRACT, CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE, CALCULATION_MULTIPLY, CALCULATION_HALVE_ROUND_DOWN, CALCULATION_HALVE_ROUND_UP, CALCULATION_MIN, CALCULATION_MAX, ACTION_GET_PROPERTY_VALUE, PROTECTION_FROM_EFFECTS, PROTECTION_FROM_POWERS, PROTECTION_FROM_SPELLS, PROTECTION_TYPE_DISCARDING_FROM_PLAY, PROTECTION_TYPE_ENERGY_GAIN, PROTECTION_TYPE_ENERGY_LOSS, PROTECTION_TYPE_GENERAL, COST_X, STATUS_BURROWED, TYPE_CREATURE, TYPE_RELIC, TYPE_SPELL } from '../const';
import { ResolvePromptType } from './resolvePrompt';
import { SelectorTypeType, SelectType } from './select';
import { EffectTypeType, EffectType } from './effect';
import { PromptType } from './prompt';
import { PropertyType, ConditionType, ExpirationObjectType, RestrictionObjectType, PromptTypeType } from './common';
import { AttackEffect } from './attack';
import { LogEntryType } from './log';
import { PromptParamsType } from '..';
export { type AttackerDealsDamageEffect, type DefenderDealsDamageEffect } from './attack';
export { type Region, type CardType, type PromptTypeType, type PropertyType, type ConditionType, type ZoneType, type RestrictionType, type RestrictionObjectType } from './common';
export { type SelectType, type SelectorTypeType, type SelectorParams, type RefinedSelectParams } from './select';
export { type EffectType, type MoveCardBetwenZonesEffect } from './effect';
export { type PromptType, type PromptParams } from './prompt';
export { type LogEntryType } from './log';
type ProtectionFromType = typeof PROTECTION_FROM_SPELLS | typeof PROTECTION_FROM_EFFECTS | typeof PROTECTION_FROM_POWERS;
type ProtectionTypeType = typeof PROTECTION_TYPE_ENERGY_LOSS | typeof PROTECTION_TYPE_ENERGY_GAIN | typeof PROTECTION_TYPE_DISCARDING_FROM_PLAY | typeof PROTECTION_TYPE_GENERAL;
export type ProtectionType = {
    from: ProtectionFromType[];
    type: ProtectionTypeType;
    restrictions?: RestrictionObjectType[];
};
export type CardData = {
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
    paymentSource?: (typeof TYPE_CREATURE | typeof TYPE_SPELL | typeof TYPE_RELIC)[];
    triggerEffects?: TriggerEffectType[];
    energyStasis?: boolean;
    replacementEffects?: ReplacementEffectType<FindType>[];
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
    player?: number;
    replacedBy?: string[];
}
type PowerType = {
    name: string;
    text: string;
    cost: number | typeof COST_X;
    effects: AnyEffectType[];
};
export type StaticAbilityType = {
    name: string;
    text: string;
    selector: SelectorTypeType;
    selectorParameter?: string | number;
    property: PropertyType;
    subProperty?: string | typeof STATUS_BURROWED;
    modifier: {
        operator: OperatorType;
        operandOne: number | boolean | Record<string, any> | ProtectionType;
    };
};
export type FindType = {
    effectType: EffectTypeType;
    conditions: ConditionType[];
};
export type TriggerEffectType = {
    name?: string;
    text?: string;
    mayEffect?: boolean;
    find: FindType;
    effects: AnyEffectType[];
};
export type RequestBody<T> = {
    [P in keyof T]: string;
};
export type EffectMoldType = Omit<EffectType, 'generatedBy' | 'player'> | PromptType | NoneType;
export type WithReplacementValues<T extends EffectMoldType, Q extends EffectType> = {
    [P in keyof T]: `%${keyof Q extends string ? keyof Q : never}` | '%self' | `$${string}` | T[P];
} & {
    type: T['type'];
};
export type SingleOrMultiple<T> = T | T[];
export type ReplacementEffectType<T extends FindType = FindType> = {
    name?: string;
    text?: string;
    find: T;
    replaceWith: Extract<EffectType, T> extends T ? SingleOrMultiple<WithReplacementValues<EffectMoldType, Extract<EffectType, T>>> : never;
    mayEffect?: boolean;
    oncePerTurn?: boolean;
};
export type ReplacingEffectType = {
    effectType: EffectTypeType;
    target?: string;
};
export type OperatorType = typeof CALCULATION_SET | typeof CALCULATION_DOUBLE | typeof CALCULATION_ADD | typeof CALCULATION_SUBTRACT | typeof CALCULATION_SUBTRACT_TO_MINIMUM_OF_ONE | typeof CALCULATION_MULTIPLY | typeof CALCULATION_HALVE_ROUND_DOWN | typeof CALCULATION_HALVE_ROUND_UP | typeof CALCULATION_MIN | typeof CALCULATION_MAX;
export type CalculateParams = {
    operator: OperatorType;
    operandOne: string | number;
    propertyOne?: string | null;
    operandTwo?: string | number;
    propertyTwo?: string | null;
    variable: string;
};
export type CalculateType = CalculateParams & EnrichedAction & {
    type: typeof ACTION_CALCULATE;
    generatedBy?: string;
};
export type PropertyGetterParams = {
    property: PropertyType;
    target: string;
    variable: string;
};
export type PropertyGetterType = EnrichedAction & PropertyGetterParams & {
    type: typeof ACTION_GET_PROPERTY_VALUE;
    generatedBy?: string;
};
type PlayerWinType = EnrichedAction & {
    type: typeof ACTION_PLAYER_WINS;
    player: number;
    generatedBy?: string;
};
type PassType = EnrichedAction & {
    type: typeof ACTION_PASS;
    player: number;
    generatedBy?: string;
};
type ConcedeType = EnrichedAction & {
    type: typeof ACTION_CONCEDE;
    player: number;
    generatedBy?: string;
};
export type NormalPlayType = EnrichedAction & {
    type: typeof ACTION_PLAY;
    player: number;
    payload: {
        card: CardInGame;
        player: number;
    };
    forcePriority: false;
    generatedBy?: string;
};
export type ForcedPlayType = EnrichedAction & {
    type: typeof ACTION_PLAY;
    card: string | CardInGame;
    sourceZone: string;
    destinationZone: string;
    forcePriority: boolean;
    player?: number;
    generatedBy?: string;
};
export type NoneType = EnrichedAction & {
    type: typeof ACTION_NONE;
    generatedBy?: string;
};
type PlayType = NormalPlayType | ForcedPlayType;
type PowerActionType = EnrichedAction & {
    type: typeof ACTION_POWER;
    power: PowerType;
    source: CardInGame;
    player: number;
    generatedBy?: string;
};
type TimeNotificationAction = EnrichedAction & {
    type: typeof ACTION_TIME_NOTIFICATION;
    player: number;
    generatedBy?: string;
};
export type ExitPromptsAction = EnrichedAction & {
    type: typeof ACTION_EXIT_PROMPTS;
    generatedBy?: string;
};
export type ContinuousEffectType = {
    staticAbilities?: StaticAbilityType[];
    triggerEffects?: TriggerEffectType[];
    expiration: ExpirationObjectType;
    player: number;
    id: string;
};
export type AnyEffectType = EffectType | PromptType | SelectType | CalculateType | PropertyGetterType | PlayerWinType | PassType | ConcedeType | ResolvePromptType | PlayType | PowerActionType | AttackEffect | TimeNotificationAction | NoneType | ExitPromptsAction;
type SerializedZone = ConvertedCard[] | HiddenConvertedCard[];
export type SerializedZones = {
    playerHand: SerializedZone;
    opponentHand: SerializedZone;
    playerDeck: SerializedZone;
    opponentDeck: SerializedZone;
    playerActiveMagi: SerializedZone;
    opponentActiveMagi: SerializedZone;
    playerMagiPile: SerializedZone;
    opponentMagiPile: SerializedZone;
    inPlay: SerializedZone;
    playerDefeatedMagi: SerializedZone;
    opponentDefeatedMagi: SerializedZone;
    playerDiscard: SerializedZone;
    opponentDiscard: SerializedZone;
};
export type SerializedState = {
    zones: SerializedZones;
    continuousEffects: ContinuousEffectType[];
    step: number | null;
    turn: number;
    goesFirst: number;
    activePlayer: number;
    prompt: boolean;
    promptType: PromptTypeType | null;
    promptMessage: string | null;
    promptPlayer: number | null;
    promptGeneratedBy: string | null;
    promptParams: PromptParamsType;
    opponentId: number;
    log: LogEntryType[];
    gameEnded: boolean;
    winner: number | boolean | null;
    cardsAttached: Record<string, string[]>;
};
