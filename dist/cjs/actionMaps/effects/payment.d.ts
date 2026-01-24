import { EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE, EFFECT_TYPE_PAYING_ENERGY_FOR_POWER, EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC, EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL } from "../../const";
import { ActionTransformer } from "../actionMapTypes";
export declare const applyPayingEnergyForRelicEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_RELIC>;
export declare const applyPayingEnergyForSpellEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_SPELL>;
export declare const applyPayingEnergyForCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_CREATURE>;
export declare const applyPayingEnergyForPowerEffect: ActionTransformer<typeof EFFECT_TYPE_PAYING_ENERGY_FOR_POWER>;
