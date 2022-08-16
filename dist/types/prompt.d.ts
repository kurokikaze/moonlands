import { ACTION_ENTER_PROMPT, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_PLAYER, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES } from '../const';
import { GenericPromptType, RestrictionType, RestrictionObjectType, ZoneType } from './common';
export declare type PromptParams = {
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
interface PromptInteface {
    type: typeof ACTION_ENTER_PROMPT;
    message?: string;
    player?: number | string;
    variable?: string;
    generatedBy?: string;
    replacedBy?: string[];
}
export declare type PromptTypeDistributeEnergy = PromptInteface & {
    promptType: typeof PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
    amount: string | number;
    restriction?: RestrictionType;
    restrictionValue?: any;
};
export declare type PromptTypeDistributeDamage = PromptInteface & {
    promptType: typeof PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES;
    amount: string | number;
    restriction?: RestrictionType;
};
export declare type PromptTypeRearrangeEnergy = PromptInteface & {
    promptType: typeof PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
};
export declare type PromptTypeChooseUpToNCardsFromZone = PromptInteface & {
    promptType: typeof PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE;
    zone: ZoneType;
    zoneOwner: string;
    numberOfCards: number | string;
    restriction?: RestrictionType;
    restrictionValue?: string | number | boolean;
    restrictions?: RestrictionObjectType[];
};
export declare type PromptTypePlayer = PromptInteface & {
    promptType: typeof PROMPT_TYPE_PLAYER;
};
export declare type ChooseCardsPromptType = PromptInteface & {
    promptType: typeof PROMPT_TYPE_CHOOSE_CARDS;
    promptParams: {
        availableCards: string[];
    };
};
declare type GeneralPromptType = PromptParams & {
    type: typeof ACTION_ENTER_PROMPT;
    promptType: GenericPromptType;
    promptParams?: any;
    generatedBy?: string;
    replacedBy?: string[];
};
export declare type PromptType = GeneralPromptType | PromptTypeRearrangeEnergy | PromptTypeDistributeEnergy | PromptTypeChooseUpToNCardsFromZone | PromptTypeDistributeDamage | PromptTypePlayer | ChooseCardsPromptType;
export {};
