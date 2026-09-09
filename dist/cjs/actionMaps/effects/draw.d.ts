import { EFFECT_TYPE_DRAW, EFFECT_TYPE_DRAW_N_CARDS } from "../../const.js";
import { ActionTransformer } from "../actionMapTypes.js";
export declare const applyDrawNCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW_N_CARDS>;
export declare const applyDrawEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW>;
