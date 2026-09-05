import { EFFECT_TYPE_DISCARD_CARDS_FROM_HAND, EFFECT_TYPE_DISCARD_CARD_FROM_HAND, EFFECT_TYPE_RESHUFFLE_DISCARD } from "../../const.js";
import { ActionTransformer } from "../actionMapTypes.js";
export declare const applyDiscardCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND>;
export declare const applyDiscardCardEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CARD_FROM_HAND>;
export declare const applyReshuffleDiscardEffect: ActionTransformer<typeof EFFECT_TYPE_RESHUFFLE_DISCARD>;
