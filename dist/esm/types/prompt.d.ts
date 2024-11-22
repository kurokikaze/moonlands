import CardInGame from '../classes/CardInGame.js';
import { ACTION_ENTER_PROMPT, PROMPT_TYPE_ALTERNATIVE, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_PAYMENT_SOURCE, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, TYPE_CREATURE, TYPE_RELIC, TYPE_SPELL } from '../const.js';
import { GenericPromptType, RestrictionType, RestrictionObjectType, ZoneType } from './common.js';
export type PromptParams = {
    promptType: GenericPromptType;
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
};
interface PromptInterface {
    type: typeof ACTION_ENTER_PROMPT;
    message?: string;
    player?: number | string;
    variable?: string;
    generatedBy?: string;
    replacedBy?: string[];
}
export type PromptTypeDistributeEnergy = PromptInterface & {
    promptType: typeof PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
    amount: string | number;
    restriction?: RestrictionType;
    restrictionValue?: any;
};
export type PromptTypeDistributeDamage = PromptInterface & {
    promptType: typeof PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES;
    amount: string | number;
    restriction?: RestrictionType;
};
export type PromptTypeRearrangeEnergy = PromptInterface & {
    promptType: typeof PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
};
export type PromptTypeChooseUpToNCardsFromZone = PromptInterface & {
    promptType: typeof PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE;
    zone: ZoneType;
    zoneOwner: string;
    numberOfCards: number | string;
    restriction?: RestrictionType;
    restrictionValue?: string | number | boolean;
    restrictions?: RestrictionObjectType[];
};
export type PromptTypePlayer = PromptInterface & {
    promptType: typeof PROMPT_TYPE_PLAYER;
};
export type ChooseCardsPromptType = PromptInterface & {
    promptType: typeof PROMPT_TYPE_CHOOSE_CARDS;
    promptParams: {
        availableCards: string[];
        startingCards: string[];
    };
};
export type PromptTypeMayAbility = PromptInterface & {
    promptType: typeof PROMPT_TYPE_MAY_ABILITY;
    promptParams: {
        effect: {
            name: string;
            text: string;
        };
    };
};
export type PromptTypeRearrangeCardsOfZone = PromptInterface & {
    promptType: typeof PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE;
    promptParams: {
        zone: ZoneType | string;
        zoneOwner: number | string;
        numberOfCards: number | string;
    };
};
export type PromptTypeDistributeCardsInZones = PromptInterface & {
    promptType: typeof PROMPT_TYPE_DISTRUBUTE_CARDS_IN_ZONES;
    sourceZone: ZoneType | string;
    sourceZoneOwner: ZoneType | string;
    targetZones: ZoneType[] | string[];
    numberOfCards: number;
};
type GeneralPromptType = PromptParams & {
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
export type PromptTypeAlternative = PromptInterface & AlternativePromptParams;
export type PaymentSourcePromptParams = {
    promptType: typeof PROMPT_TYPE_PAYMENT_SOURCE;
    paymentType: typeof TYPE_CREATURE | typeof TYPE_SPELL | typeof TYPE_RELIC;
    amount: number;
    cards: CardInGame[];
    variable?: string;
};
export type PromptTypePaymentSource = PromptInterface & PaymentSourcePromptParams;
export type MagiPowerPromptParams = {
    promptType: typeof PROMPT_TYPE_POWER_ON_MAGI;
    magi: CardInGame | string;
};
export type PromptTypeMagiPower = PromptInterface & MagiPowerPromptParams;
export type PromptType = GeneralPromptType | PromptTypeRearrangeEnergy | PromptTypeDistributeEnergy | PromptTypeChooseUpToNCardsFromZone | PromptTypeDistributeDamage | PromptTypePlayer | ChooseCardsPromptType | PromptTypeMayAbility | PromptTypeRearrangeCardsOfZone | PromptTypeAlternative | PromptTypePaymentSource | PromptTypeDistributeCardsInZones | PromptTypeMagiPower;
export {};
