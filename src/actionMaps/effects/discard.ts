import CardInGame from "../../classes/CardInGame";
import {
  ACTION_EFFECT,
  EFFECT_TYPE_DISCARD_CARDS_FROM_HAND,
  EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
  EFFECT_TYPE_DISCARD_RESHUFFLED,
  EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
  EFFECT_TYPE_RESHUFFLE_DISCARD,
  ZONE_TYPE_DECK,
  ZONE_TYPE_DISCARD,
  ZONE_TYPE_HAND,
} from "../../const";
import { oneOrSeveral } from "../actionMapUtils";
import { ActionTransformer } from "../actionMapTypes";

export const applyDiscardCardsEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CARDS_FROM_HAND> = function (action, transform) {
  const targets = this.getMetaValue(action.target, action.generatedBy);
  oneOrSeveral(targets, target =>
    target && transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
      target,
      generatedBy: action.generatedBy,
      player: action.player,
    })
  );
}

export const applyDiscardCardEffect: ActionTransformer<typeof EFFECT_TYPE_DISCARD_CARD_FROM_HAND> = function (action, transform) {
  const target = this.getMetaValue(action.target, action.generatedBy);

  if (target) {
    transform({
      type: ACTION_EFFECT,
      effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
      sourceZone: ZONE_TYPE_HAND,
      destinationZone: ZONE_TYPE_DISCARD,
      bottom: false,
      target,
      generatedBy: action.generatedBy,
    })
  }
}

export const applyReshuffleDiscardEffect: ActionTransformer<typeof EFFECT_TYPE_RESHUFFLE_DISCARD> = function (action, transform, _state, seeded_nanoid) {
  const player = this.getMetaValue(action.player, action.generatedBy);
  const deck = this.getZone(ZONE_TYPE_DECK, player);
  const discard = this.getZone(ZONE_TYPE_DISCARD, player);

  const newCards = discard.cards.map(card => new CardInGame(card.card, card.owner, seeded_nanoid));
  deck.add(newCards);
  deck.shuffle();
  discard.empty();
  transform({
    type: ACTION_EFFECT,
    effectType: EFFECT_TYPE_DISCARD_RESHUFFLED,
    cards: newCards.map(({ id }) => id),
    player: player,
    generatedBy: action.generatedBy,
  });
}
