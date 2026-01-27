import CardInGame from '../classes/CardInGame';
import { PromptParamsType } from '../index';
import { ContinuousEffectType, PromptTypeType, ZoneType } from '../types';
export declare const UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE = 1;
export declare const UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI = 2;
export declare const UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES = 3;
export declare const UNMAKE_RESTORE_VALUE = 4;
export declare const UNMAKE_MOVE_ELEMENT_BACK = 5;
export declare const UNMAKE_REMOVE_ELEMENT = 6;
export declare const UNMAKE_EFFECT_TYPE_DIE_ROLLED = 7;
export declare const UNMAKE_EFFECT_TYPE_START_TURN = 8;
export declare const UNMAKE_EFFECT_TYPE_START_STEP = 9;
export declare const UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE = 10;
export declare const UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT = 11;
export declare const UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE = 12;
export declare const UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI = 13;
export declare const UNMAKE_EFFECT_TYPE_START_OF_TURN = 14;
export declare const UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE = 15;
export declare const UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE = 16;
export declare const UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY = 17;
export declare const UNMAKE_EFFECT_TYPE_MOVE_ENERGY = 18;
export declare const UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE = 19;
export declare const UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI = 20;
export declare const UNMAKE_EFFECT_TYPE_PROMPT_ENTERED = 21;
export declare const UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS = 22;
export declare const UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD = 23;
export declare const UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER = 24;
export declare const UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES = 25;
export declare const UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES = 26;
export declare const UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE = 27;
export declare const UNMAKE_CALCULATION = 28;
export declare const UNMAKE_SELECT = 29;
export declare const UNMAKE_PROPERTY = 30;
export type UnActionDiscardEnergyFromCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_CREATURE;
    creatures: {
        id: string;
        energy: number;
        energyLostThisTurn: number;
    }[];
};
export type UnActionDiscardEnergyFromMagi = {
    type: typeof UNMAKE_EFFECT_TYPE_DISCARD_ENERGY_FROM_MAGI;
    magi: {
        id: string;
        owner: number;
        energy: number;
    }[];
};
export type MetaDataEntry = {
    spellId: string;
    field: string;
    previousValue: any;
};
export type UnActionMoveCardBetweenZones = {
    type: typeof UNMAKE_EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES;
    card: CardInGame;
    sourceZone: ZoneType;
    sourceZoneOwner: number;
    destinationZone: ZoneType;
    position: number;
    bottom: boolean;
    metaDataEntries: MetaDataEntry[];
};
export type UnActionDieRolled = {
    type: typeof UNMAKE_EFFECT_TYPE_DIE_ROLLED;
    spellId: string;
    previousRollResult: any;
};
export type CardFlagsSnapshot = {
    id: string;
    actionsUsed: string[];
    wasAttacked: boolean;
    hasAttacked: boolean;
    attacked: number;
    defeatedCreature: boolean;
    energyLostThisTurn: number;
};
export type UnActionStartTurn = {
    type: typeof UNMAKE_EFFECT_TYPE_START_TURN;
    previousTurn: number | null;
    previousActivePlayer: number;
    previousStep: number | null;
    previousContinuousEffects: ContinuousEffectType[];
    cardFlags: Record<string, CardFlagsSnapshot>;
};
export type UnActionStartStep = {
    type: typeof UNMAKE_EFFECT_TYPE_START_STEP;
    previousStep: number | null;
};
export type UnActionRearrangeCardsOfZone = {
    type: typeof UNMAKE_EFFECT_TYPE_REARRANGE_CARDS_OF_ZONE;
    zone: ZoneType;
    zoneOwner: number | null;
    previousOrder: string[];
};
export type UnActionCreateContinuousEffect = {
    type: typeof UNMAKE_EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT;
    previousLength: number;
};
export type UnActionAddEnergyToCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_CREATURE;
    creatures: {
        id: string;
        energy: number;
    }[];
};
export type UnActionAddEnergyToMagi = {
    type: typeof UNMAKE_EFFECT_TYPE_ADD_ENERGY_TO_MAGI;
    magi: {
        id: string;
        owner: number;
        energy: number;
    }[];
};
export type UnActionStartOfTurn = {
    type: typeof UNMAKE_EFFECT_TYPE_START_OF_TURN;
    player: number;
    cardFlags: Record<string, CardFlagsSnapshot>;
};
export type UnActionBeforeDamage = {
    type: typeof UNMAKE_EFFECT_TYPE_BEFORE_DAMAGE;
    sourceId: string;
    sourceHasAttacked: boolean;
    sourceAttacked: number;
    targetId: string;
    targetWasAttacked: boolean;
};
export type UnActionCreatureDefeatsCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_CREATURE_DEFEATS_CREATURE;
    sourceId: string;
    sourceDefeatedCreature: boolean;
};
export type UnActionDiscardCreatureFromPlay = {
    type: typeof UNMAKE_EFFECT_TYPE_DISCARD_CREATURE_FROM_PLAY;
};
export type UnActionMoveEnergy = {
    type: typeof UNMAKE_EFFECT_TYPE_MOVE_ENERGY;
    sourceId: string;
    sourceEnergy: number;
    sourceEnergyLost: number;
    targetId: string;
    targetEnergy: number;
};
export type UnActionRemoveEnergyFromCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_CREATURE;
    creatureId: string;
    energy: number;
    energyLost: number;
};
export type UnActionRemoveEnergyFromMagi = {
    type: typeof UNMAKE_EFFECT_TYPE_REMOVE_ENERGY_FROM_MAGI;
    magiId: string;
    owner: number;
    energy: number;
    energyLost: number;
};
export type UnActionPromptEntered = {
    type: typeof UNMAKE_EFFECT_TYPE_PROMPT_ENTERED;
    previousPrompt: boolean;
    previousPromptMessage: string | undefined;
    previousPromptPlayer: number | undefined;
    previousPromptType: PromptTypeType | null;
    previousPromptVariable: string | undefined;
    previousPromptGeneratedBy: string | undefined;
    previousPromptParams: PromptParamsType;
};
export type UnActionFindStartingCards = {
    type: typeof UNMAKE_EFFECT_TYPE_FIND_STARTING_CARDS;
    spellId: string;
    previousFoundCards: string[] | undefined;
};
export type UnActionReshuffleDiscard = {
    type: typeof UNMAKE_EFFECT_TYPE_RESHUFFLE_DISCARD;
    player: number;
    previousDeckCards: CardInGame[];
    previousDiscardCards: CardInGame[];
};
export type UnActionAddDelayedTrigger = {
    type: typeof UNMAKE_EFFECT_TYPE_ADD_DELAYED_TRIGGER;
    previousLength: number;
};
export type UnActionRearrangeEnergyOnCreatures = {
    type: typeof UNMAKE_EFFECT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
    creatures: {
        id: string;
        energy: number;
    }[];
};
export type UnActionDistributeEnergyOnCreatures = {
    type: typeof UNMAKE_EFFECT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
    creatures: {
        id: string;
        energy: number;
    }[];
};
export type UnActionForbidAttackToCreature = {
    type: typeof UNMAKE_EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE;
    creatures: {
        id: string;
        attacked: number;
    }[];
};
export type UnActionCalculate = {
    type: typeof UNMAKE_CALCULATION;
    generatedBy: string;
    variable: string;
    wasEmpty: boolean;
    previousValue?: any;
};
export type UnActionSelect = {
    type: typeof UNMAKE_SELECT;
    generatedBy: string;
    variable: string;
    wasEmpty: boolean;
    previousValue?: any;
};
export type UnActionProperty = {
    type: typeof UNMAKE_PROPERTY;
    generatedBy: string;
    variable: string;
    wasEmpty: boolean;
    previousValue?: any;
};
export type UnAction = UnActionDiscardEnergyFromCreature | UnActionDiscardEnergyFromMagi | UnActionMoveCardBetweenZones | UnActionDieRolled | UnActionStartTurn | UnActionStartStep | UnActionRearrangeCardsOfZone | UnActionCreateContinuousEffect | UnActionAddEnergyToCreature | UnActionAddEnergyToMagi | UnActionStartOfTurn | UnActionBeforeDamage | UnActionCreatureDefeatsCreature | UnActionDiscardCreatureFromPlay | UnActionMoveEnergy | UnActionRemoveEnergyFromCreature | UnActionRemoveEnergyFromMagi | UnActionPromptEntered | UnActionFindStartingCards | UnActionReshuffleDiscard | UnActionAddDelayedTrigger | UnActionRearrangeEnergyOnCreatures | UnActionDistributeEnergyOnCreatures | UnActionForbidAttackToCreature | UnActionCalculate | UnActionSelect | UnActionProperty;
export type UnActionRestoreValue = {
    type: typeof UNMAKE_RESTORE_VALUE;
    path: string;
    value: any;
};
export type UnActionMoveElementBack = {
    type: typeof UNMAKE_MOVE_ELEMENT_BACK;
    newPath: string;
    newIndex: number;
    oldPath: string;
    oldIndex: number;
    oldElement: any;
};
export type UnActionRemoveElement = {
    type: typeof UNMAKE_REMOVE_ELEMENT;
    path: string;
    index: number;
};
