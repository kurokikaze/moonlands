import CardInGame from "../../classes/CardInGame.js";
import { ACTION_EFFECT, EFFECT_TYPE_DISCARD_CARD_FROM_HAND, EFFECT_TYPE_DISCARD_RESHUFFLED, EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES, ZONE_TYPE_DECK, ZONE_TYPE_DISCARD, ZONE_TYPE_HAND, } from "../../const.js";
import { oneOrSeveral } from "../actionMapUtils.js";
export var applyDiscardCardsEffect = function (action, transform) {
    var targets = this.getMetaValue(action.target, action.generatedBy);
    oneOrSeveral(targets, function (target) {
        return target && transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_DISCARD_CARD_FROM_HAND,
            target: target,
            generatedBy: action.generatedBy,
            player: action.player,
        });
    });
};
export var applyDiscardCardEffect = function (action, transform) {
    var target = this.getMetaValue(action.target, action.generatedBy);
    if (target) {
        transform({
            type: ACTION_EFFECT,
            effectType: EFFECT_TYPE_MOVE_CARD_BETWEEN_ZONES,
            sourceZone: ZONE_TYPE_HAND,
            destinationZone: ZONE_TYPE_DISCARD,
            bottom: false,
            target: target,
            generatedBy: action.generatedBy,
        });
    }
};
export var applyReshuffleDiscardEffect = function (action, transform, _state, seeded_nanoid) {
    var player = this.getMetaValue(action.player, action.generatedBy);
    var deck = this.getZone(ZONE_TYPE_DECK, player);
    var discard = this.getZone(ZONE_TYPE_DISCARD, player);
    var newCards = discard.cards.map(function (card) { return new CardInGame(card.card, card.owner, seeded_nanoid); });
    deck.add(newCards);
    deck.shuffle();
    discard.empty();
    transform({
        type: ACTION_EFFECT,
        effectType: EFFECT_TYPE_DISCARD_RESHUFFLED,
        cards: newCards.map(function (_a) {
            var id = _a.id;
            return id;
        }),
        player: player,
        generatedBy: action.generatedBy,
    });
};
//# sourceMappingURL=discard.js.map