import { EFFECT_TYPE_DRAW, EFFECT_TYPE_DRAW_N_CARDS } from "../../const";
import { ActionTransformer } from "../actionMapTypes";
export declare const applyDrawNCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW_N_CARDS>;
export declare const applyDrawEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW>;
