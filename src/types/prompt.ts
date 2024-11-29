import { ACTION_ENTER_PROMPT } from '../const';
import { GenericPromptType, RestrictionType, RestrictionObjectType, ZoneType } from './common'
import { AlternativePromptParams, AnyCreatureExceptSourcePromptParams, ChooseCardsPromptParams, ChooseNCardsFromZonePromptParams, ChooseUpToNCardsFromZonePromptParams, DistributeCardsInZonesPromptParams, DistributeDamagePromptParams, DistributeEnergyPromptParams, GenericPromptParams, MagiPowerPromptParams, MayAbilityPromptParams, PaymentSourcePromptParams, PlayerPromptParams, RearrangeCardsOfZonePromptParams, RearrangeEnergyPromptParams } from './promptParams'

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

interface PromptInterface {
  type: typeof ACTION_ENTER_PROMPT;
  message?: string;
  player?: number | string;
  variable?: string;
  generatedBy?: string;
  replacedBy?: string[];
}

type GeneralPromptType = PromptParams & GenericPromptParams

export type PromptTypeDistributeEnergy = PromptInterface & DistributeEnergyPromptParams
export type PromptTypeDistributeDamage = PromptInterface & DistributeDamagePromptParams
export type PromptTypeRearrangeEnergy = PromptInterface & RearrangeEnergyPromptParams
export type PromptTypeChooseUpToNCardsFromZone = PromptInterface & ChooseUpToNCardsFromZonePromptParams
export type PromptTypeChooseNCardsFromZone = PromptInterface & ChooseNCardsFromZonePromptParams
export type PromptTypePlayer = PromptInterface & PlayerPromptParams
export type ChooseCardsPromptType = PromptInterface & ChooseCardsPromptParams
export type PromptTypeMayAbility = PromptInterface & MayAbilityPromptParams
export type PromptTypeRearrangeCardsOfZone = PromptInterface & RearrangeCardsOfZonePromptParams
export type PromptTypeDistributeCardsInZones = PromptInterface & DistributeCardsInZonesPromptParams
export type PromptTypeAlternative = PromptInterface & AlternativePromptParams;
export type PromptTypePaymentSource = PromptInterface & PaymentSourcePromptParams;
export type PromptTypeMagiPower = PromptInterface & MagiPowerPromptParams;
export type PromptTypeAnyCreatureExceptSource = PromptInterface & AnyCreatureExceptSourcePromptParams

export type PromptType = GeneralPromptType |
  PromptTypeRearrangeEnergy |
  PromptTypeDistributeEnergy |
  PromptTypeChooseUpToNCardsFromZone |
  PromptTypeDistributeDamage |
  PromptTypePlayer |
  ChooseCardsPromptType |
  PromptTypeMayAbility |
  PromptTypeRearrangeCardsOfZone |
  PromptTypeAlternative |
  PromptTypePaymentSource |
  PromptTypeDistributeCardsInZones |
  PromptTypeAnyCreatureExceptSource |
  PromptTypeMagiPower;
