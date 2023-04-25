import CardInGame from '../classes/CardInGame';
import { ACTION_ENTER_PROMPT, PROMPT_TYPE_CHOOSE_CARDS, PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE, PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES, PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES, PROMPT_TYPE_MAY_ABILITY, PROMPT_TYPE_PLAYER, PROMPT_TYPE_POWER_ON_MAGI, PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE, PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES, RESTRICTION_CREATURE_TYPE, RESTRICTION_CREATURE_WAS_ATTACKED, RESTRICTION_ENERGY_LESS_THAN, RESTRICTION_ENERGY_LESS_THAN_STARTING, RESTRICTION_EXCEPT_SOURCE, RESTRICTION_MAGI_WITHOUT_CREATURES, RESTRICTION_OPPONENT_CREATURE, RESTRICTION_OWN_CREATURE, RESTRICTION_PLAYABLE, RESTRICTION_REGION, RESTRICTION_REGION_IS_NOT, RESTRICTION_STATUS, RESTRICTION_TYPE } from '../const';
import { GenericPromptType, RestrictionType, RestrictionObjectType, ZoneType } from './common'

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
}

interface PromptInteface {
  type: typeof ACTION_ENTER_PROMPT;
  message?: string;
  player?: number | string;
  variable?: string;
  generatedBy?: string;
  replacedBy?: string[];
}

export type PromptTypeDistributeEnergy = PromptInteface & {
  promptType: typeof PROMPT_TYPE_DISTRIBUTE_ENERGY_ON_CREATURES;
  amount: string | number;
  restriction?: RestrictionType;
  restrictionValue?: any;
}

export type PromptTypeDistributeDamage = PromptInteface & {
  promptType: typeof PROMPT_TYPE_DISTRIBUTE_DAMAGE_ON_CREATURES;
  amount: string | number;
  restriction?: RestrictionType;
}

export type PromptTypeRearrangeEnergy = PromptInteface & {
  promptType: typeof PROMPT_TYPE_REARRANGE_ENERGY_ON_CREATURES;
}

export type PromptTypeChooseUpToNCardsFromZone = PromptInteface & {
  promptType: typeof PROMPT_TYPE_CHOOSE_UP_TO_N_CARDS_FROM_ZONE;
  zone: ZoneType;
  zoneOwner: string;
  numberOfCards: number | string;
  restriction?: RestrictionType;
  restrictionValue?: string | number | boolean;
  restrictions?: RestrictionObjectType[];
}

export type PromptTypePlayer = PromptInteface & {
  promptType: typeof PROMPT_TYPE_PLAYER;
}

export type ChooseCardsPromptType = PromptInteface & {
  promptType: typeof PROMPT_TYPE_CHOOSE_CARDS;
  promptParams: {
    availableCards: string[];
    startingCards: string[];
  }
}

export type PromptTypeMayAbility = PromptInteface & {
  promptType: typeof PROMPT_TYPE_MAY_ABILITY;
  promptParams: {
    effect: {
      name: string;
      text: string;
    },
  }
}

export type PromptTypeRearrangeCardsOfZone = PromptInteface & {
  promptType: typeof PROMPT_TYPE_REARRANGE_CARDS_OF_ZONE;
  promptParams: {
    zone: ZoneType | string,
    zoneOwner: number | string,
    numberOfCards: number | string,
  }
}

type GeneralPromptType = PromptParams & {
  type: typeof ACTION_ENTER_PROMPT;
  promptType: GenericPromptType;
  promptParams?: any;
  generatedBy?: string;
  replacedBy?: string[];
}

export type MagiPowerPromptParams = {
  promptType: typeof PROMPT_TYPE_POWER_ON_MAGI;
  magi: CardInGame | string;
} 

export type PromptTypeMagiPower = PromptInteface & MagiPowerPromptParams;

export type PromptType = GeneralPromptType |
  PromptTypeRearrangeEnergy |
  PromptTypeDistributeEnergy |
  PromptTypeChooseUpToNCardsFromZone |
  PromptTypeDistributeDamage |
  PromptTypePlayer |
  ChooseCardsPromptType |
  PromptTypeMayAbility |
  PromptTypeRearrangeCardsOfZone |
  PromptTypeMagiPower;
