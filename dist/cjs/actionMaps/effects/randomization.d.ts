import { EFFECT_TYPE_DIE_ROLLED, EFFECT_TYPE_ROLL_DIE } from "../../const.js";
import { ActionTransformer } from "../actionMapTypes.js";
export declare const applyRollDieEffect: ActionTransformer<typeof EFFECT_TYPE_ROLL_DIE>;
export declare const applyDieRolledEffect: ActionTransformer<typeof EFFECT_TYPE_DIE_ROLLED>;
