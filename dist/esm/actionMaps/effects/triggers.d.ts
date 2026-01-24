import { EFFECT_TYPE_CONDITIONAL, EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT, EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE } from "../../const.js";
import { ActionTransformer } from "../actionMapTypes.js";
export declare const applyForbidAttackToCreatureEffect: ActionTransformer<typeof EFFECT_TYPE_FORBID_ATTACK_TO_CREATURE>;
export declare const applyConditionalEffect: ActionTransformer<typeof EFFECT_TYPE_CONDITIONAL>;
export declare const applyCreateContinuousEffect: ActionTransformer<typeof EFFECT_TYPE_CREATE_CONTINUOUS_EFFECT>;
