import {
  ACTION_EFFECT,
  EFFECT_TYPE_DRAW,
  EFFECT_TYPE_DRAW_N_CARDS,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_RESHUFFLE_DISCARD,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_HAND,
} from "../../const";
import { ActionTransformer } from "../actionMapTypes";

export const applyDrawNCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW_N_CARDS> = function (action, transform) {
  const numberOfCards = this.getMetaValue(action.numberOfCards, action.generatedBy) || 0;
  for (let i = 0; i < numberOfCards; i++) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DRAW,
      player: action.player,
      generatedBy: action.generatedBy,
    });
  }
}

export const applyDrawEffect: ActionTransformer<typeof EFFECT_TYPE_DRAW> = function (action, transform) {
  const player = this.getMetaValue(action.player, action.generatedBy);

  const deck = this.getZone(ZONE_TYPE_DECK, player);
  const discard = this.getZone(ZONE_TYPE_DISCARD, player);

  if (deck.length > 0) {
    const card = deck.cards[0];

    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
      target: card,
      sourceZone: ZONE_TYPE_DECK,
      destinationZone: ZONE_TYPE_HAND,
      bottom: false,
      player: player,
      generatedBy: action.generatedBy,
    });
  } else if (discard.length > 0) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_RESHUFFLE_DISCARD,
      player: player,
      generatedBy: action.generatedBy,
    },
      action);
  }
}
