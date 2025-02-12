import CardInGame from '../classes/CardInGame.js';
import { ACTION_ENTER_PROMPT, PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_NUMBER, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, PROMPT_TYPE_SINGLE_CREATURE_FILTERED, TYPE_CREATURE, TYPE_RELIC, TYPE_SPELL } from '../const.js';
import { GenericPromptType, RestrictionType, RestrictionObjectType, ZoneType } from './common.js';
export type AnyCreatureExceptSourcePromptParams = {
    promptType: typeof PROMPT_TYPE_ANY_CREATURE_EXCEPT_SOURCE;
    source: CardInGame;
};
export type SingleCreatureFilteredPromptParams = {
    promptType: typeof PROMPT_TYPE_SINGLE_CREATURE_FILTERED;
    restrictions: RestrictionObjectType[];
    restriction: RestrictionType;
    restrictionValue: string | number | boolean | undefined;
    source: CardInGame;
};
export type PaymentSourcePromptParams = {
    promptType: typeof PROMPT_TYPE_PAYMENT_SOURCE;
    paymentType: typeof TYPE_CREATURE | typeof TYPE_SPELL | typeof TYPE_RELIC;
    amount: number;
    cards: CardInGame[];
    variable?: string;
};
export type MagiPowerPromptParams = {
    promptType: typeof PROMPT_TYPE_POWER_ON_MAGI;
    magi: CardInGame | string;
};
export type DistributeEnergyPromptParams = {
    promptType: typeof PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
    amount: string | number;
    restriction?: RestrictionType;
    restrictionValue?: any;
};
export type DistributeDamagePromptParams = {
    promptType: typeof PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES;
    amount: string | number;
    restriction?: RestrictionType;
};
export type RearrangeEnergyPromptParams = {
    promptType: typeof PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
};
export type ChooseNCardsFromZonePromptParams = {
    promptType: typeof PROMPT_TYPE_CHOOSE_N_CARDS_FROM_ZONE;
    zone: ZoneType;
    zoneOwner: string;
    numberOfCards: number | string;
    restriction?: RestrictionType;
    restrictionValue?: string | number | boolean;
    restrictions?: RestrictionObjectType[];
};
export type ChooseUpToNCardsFromZonePromptParams = {
    promptType: typeof PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE;
    zone: ZoneType;
    zoneOwner: string;
    numberOfCards: number | string;
    restriction?: RestrictionType;
    restrictionValue?: string | number | boolean;
    restrictions?: RestrictionObjectType[];
};
export type PlayerPromptParams = {
    promptType: typeof PROMPT_TYPE_PLAYER;
};
export type ChooseCardsPromptParams = {
    promptType: typeof PROMPT_TYPE_CHOOSE_CARDS;
    promptParams: {
        availableCards: string[];
        startingCards: string[];
    };
};
export type MayAbilityPromptParams = {
    promptType: typeof PROMPT_TYPE_MAY_ABILITY;
    promptParams: {
        effect: {
            name: string;
            text: string;
        };
    };
};
export type RearrangeCardsOfZonePromptParams = {
    promptType: typeof PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE;
    promptParams: {
        zone: ZoneType | string;
        zoneOwner: number | string;
        numberOfCards: number | string;
    };
};
export type DistributeCardsInZonesPromptParams = {
    promptType: typeof PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES;
    sourceZone: ZoneType | string;
    sourceZoneOwner: ZoneType | string;
    targetZones: ZoneType[] | string[];
    numberOfCards: number;
};
export type GenericPromptParams = {
    type: typeof ACTION_ENTER_PROMPT;
    promptType: GenericPromptType;
    promptParams?: any;
    generatedBy?: string;
    replacedBy?: string[];
};
export type AlternativeType = {
    name: string;
    value: string;
};
export type AlternativePromptParams = {
    promptType: typeof PROMPT_TYPE_ALTERNATIVE;
    alternatives: AlternativeType[];
    message?: string;
    variable?: string;
    player?: string | number;
};
export type NumberPromptParams = {
    promptType: typeof PROMPT_TYPE_NUMBER;
    min: number | string;
    max: number | string;
};
