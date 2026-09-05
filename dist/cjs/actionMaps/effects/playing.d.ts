import { EFFECT_TYPE_ATTACH_CARD_TO_CARD, EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE, EFFECT_TYPE_PLAY_CREATURE, EFFECT_TYPE_PLAY_RELIC, EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE } from "../../const.js";
import { ActionTransformer } from "../actionMapTypes.js";
export declare const applyPlayRelicEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_RELIC>;
export declare const applyPlayCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_CREATURE>;
export declare const applyStartingEnergyOnCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_STARTING_ENERGY_ON_CREATURE>;
export declare const applyPlayAttachedToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_PLAY_ATTACHED_TO_CREATURE>;
export declare const applyAttachCardToCardEffect: ActionTransformer<typeof EFFECT_TYPE_ATTACH_CARD_TO_CARD>;
